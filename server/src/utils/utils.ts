import path from "path";

/* =========================================================================
   Function: updateCourseVideoInfo
   Purpose:
     - Attach/update video info for a specific chapter within a course.
     - Ensures the target section/chapter exists before updating.
   Params:
     - course (any): The course object containing sections/chapters.
     - sectionId (string): ID of the section to update.
     - chapterId (string): ID of the chapter to update.
     - videoUrl (string): URL to the uploaded video/manifest.
   Behavior:
     - Throws an error if the section or chapter cannot be found.
     - Sets chapter.video and forces chapter.type = "Video".
   ========================================================================= */
export const updateCourseVideoInfo = (
  course: any,
  sectionId: string,
  chapterId: string,
  videoUrl: string
) => {
  const section = course.sections?.find((s: any) => s.sectionId === sectionId);
  if (!section) {
    throw new Error(`Section not found: ${sectionId}`);
  }

  const chapter = section.chapters?.find((c: any) => c.chapterId === chapterId);
  if (!chapter) {
    throw new Error(`Chapter not found: ${chapterId}`);
  }

  chapter.video = videoUrl;
  chapter.type = "Video";
};

/* =========================================================================
   Function: validateUploadedFiles
   Purpose:
     - Validates that uploaded files are allowed video-related formats.
   Params:
     - files (any): Array of multer file objects ({ originalname, buffer, ... }).
   Behavior:
     - Checks file extensions against a whitelist.
     - Throws an error on the first unsupported file extension.
   Allowed:
     - .mp4 (progressive MP4)
     - .m3u8 (HLS manifest)
     - .mpd (MPEG-DASH manifest)
     - .ts  (HLS transport stream segments)
     - .m4s (fMP4 segments)
   ========================================================================= */
export const validateUploadedFiles = (files: any) => {
  const allowedExtensions = [".mp4", ".m3u8", ".mpd", ".ts", ".m4s"];
  for (const file of files) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      throw new Error(`Unsupported file type: ${ext}`);
    }
  }
};

/* =========================================================================
   Function: getContentType
   Purpose:
     - Returns a suitable MIME type for a given filename based on extension.
   Params:
     - filename (string): The file name to inspect.
   Returns:
     - A string representing the content type to send to S3/clients.
   Notes:
     - Defaults to "application/octet-stream" for unknown types.
   ========================================================================= */
export const getContentType = (filename: string) => {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".mp4":
      return "video/mp4";
    case ".m3u8":
      return "application/vnd.apple.mpegurl";
    case ".mpd":
      return "application/dash+xml";
    case ".ts":
      return "video/MP2T";
    case ".m4s":
      return "video/iso.segment";
    default:
      return "application/octet-stream";
  }
};

/* =========================================================================
   Function: handleAdvancedVideoUpload
   Purpose:
     - Handles multi-file uploads for adaptive streaming formats (HLS/DASH).
     - Uploads all provided files (manifest + segments) to S3 if detected.
   Params:
     - s3 (any): AWS S3 client (v2 SDK style with .upload().promise()).
     - files (any): Array of multer files (manifest + segments).
     - uniqueId (string): Unique folder/namespace for this video set.
     - bucketName (string): S3 bucket name.
   Behavior:
     - If .m3u8 or .mpd is present → treat as HLS/DASH set and upload all files.
     - Returns:
         { videoUrl, videoType: "hls" | "dash" }
       where videoUrl points to the manifest on CloudFront.
     - Returns null if no HLS/DASH manifest is found → caller can handle MP4 case.
   Requirements:
     - process.env.CLOUDFRONT_DOMAIN must be set to build public URL.
   ========================================================================= */
export const handleAdvancedVideoUpload = async (
  s3: any,
  files: any,
  uniqueId: string,
  bucketName: string
) => {
  const isHLSOrDASH = files.some(
    (file: any) =>
      file.originalname.endsWith(".m3u8") || file.originalname.endsWith(".mpd")
  );

  if (isHLSOrDASH) {
    // Upload all provided files under videos/{uniqueId}/
    const uploadPromises = files.map((file: any) => {
      const s3Key = `videos/${uniqueId}/${file.originalname}`;
      return s3
        .upload({
          Bucket: bucketName,
          Key: s3Key,
          Body: file.buffer,
          ContentType: getContentType(file.originalname),
        })
        .promise();
    });
    await Promise.all(uploadPromises);

    // Pick the manifest file and infer videoType
    const manifestFile = files.find(
      (file: any) =>
        file.originalname.endsWith(".m3u8") ||
        file.originalname.endsWith(".mpd")
    );
    const manifestFileName = manifestFile?.originalname || "";
    const videoType = manifestFileName.endsWith(".m3u8") ? "hls" : "dash";

    return {
      videoUrl: `${process.env.CLOUDFRONT_DOMAIN}/videos/${uniqueId}/${manifestFileName}`,
      videoType,
    };
  }

  // Not an HLS/DASH upload → let caller handle regular single-file (e.g., MP4)
  return null;
};

/* =========================================================================
   Function: mergeSections
   Purpose:
     - Merge new section progress into existing section progress.
     - Adds new sections and merges chapters of existing sections.
   Params:
     - existingSections (any[]): Current sections array.
     - newSections (any[]): Incoming sections array with updates.
   Returns:
     - A new array of sections with merged chapter data.
   ========================================================================= */
export const mergeSections = (
  existingSections: any[],
  newSections: any[]
): any[] => {
  const existingSectionsMap = new Map<string, any>();
  for (const existingSection of existingSections) {
    existingSectionsMap.set(existingSection.sectionId, existingSection);
  }

  for (const newSection of newSections) {
    const section = existingSectionsMap.get(newSection.sectionId);
    if (!section) {
      // New section → add directly
      existingSectionsMap.set(newSection.sectionId, newSection);
    } else {
      // Existing section → merge chapters
      section.chapters = mergeChapters(section.chapters, newSection.chapters);
      existingSectionsMap.set(newSection.sectionId, section);
    }
  }

  return Array.from(existingSectionsMap.values());
};

/* =========================================================================
   Function: mergeChapters
   Purpose:
     - Merge new chapter progress into existing chapter progress.
     - Overwrites fields of matching chapters while preserving existing data.
   Params:
     - existingChapters (any[]): Current chapter list.
     - newChapters (any[]): Incoming chapter updates.
   Returns:
     - A new array of chapters with merged data.
   Notes:
     - Uses Map keyed by chapterId for O(1) merges.
   ========================================================================= */
export const mergeChapters = (
  existingChapters: any[],
  newChapters: any[]
): any[] => {
  const existingChaptersMap = new Map<string, any>();
  for (const existingChapter of existingChapters) {
    existingChaptersMap.set(existingChapter.chapterId, existingChapter);
  }

  for (const newChapter of newChapters) {
    // Merge by spreading existing (if any) then overlaying new fields
    existingChaptersMap.set(newChapter.chapterId, {
      ...(existingChaptersMap.get(newChapter.chapterId) || {}),
      ...newChapter,
    });
  }

  return Array.from(existingChaptersMap.values());
};

/* =========================================================================
   Function: calculateOverallProgress
   Purpose:
     - Compute overall course progress percentage from section/chapter states.
   Params:
     - sections (any[]): Array of sections (each with chapters[] and completed flag).
   Returns:
     - number: A percentage from 0 to 100.
   Behavior:
     - Counts total chapters and completed chapters and computes ratio * 100.
     - Safeguards against divide-by-zero when there are no chapters.
   ========================================================================= */
export const calculateOverallProgress = (sections: any[]): number => {
  const totalChapters = sections.reduce(
    (acc: number, section: any) => acc + section.chapters.length,
    0
  );

  const completedChapters = sections.reduce(
    (acc: number, section: any) =>
      acc + section.chapters.filter((chapter: any) => chapter.completed).length,
    0
  );

  return totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
};
