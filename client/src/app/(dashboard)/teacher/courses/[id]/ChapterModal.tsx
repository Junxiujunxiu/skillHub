import { CustomFormField } from "@/components/CustomFormField";
import CustomModal from "@/components/CustomModal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChapterFormData, chapterSchema } from "@/lib/schemas";
import { addChapter, closeChapterModal, editChapter } from "@/state";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

/* =========================================================
   ChapterModal Component
   - Renders a modal to add or edit a chapter in the course editor
   - Uses react-hook-form + zod for validation
   - Supports uploading a video or adding text content
   ========================================================= */
const ChapterModal = () => {
  /* ---------- Redux setup ---------- */
  const dispatch = useAppDispatch();
  const {
    isChapterModalOpen,
    selectedSectionIndex,
    selectedChapterIndex,
    sections,
  } = useAppSelector((state) => state.global.courseEditor);

  /* ---------- Determine current chapter (edit mode) ---------- */
  const chapter: Chapter | undefined =
    selectedSectionIndex !== null && selectedChapterIndex !== null
      ? sections[selectedSectionIndex].chapters[selectedChapterIndex]
      : undefined;

  /* ---------- Form setup (react-hook-form) ---------- */
  const methods = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema), // Zod schema validation
    defaultValues: {
      title: "",
      content: "",
      video: "",
    },
  });

  /* ---------- Reset form values when editing or creating ---------- */
  useEffect(() => {
    if (chapter) {
      // Editing: pre-fill form with existing chapter data
      methods.reset({
        title: chapter.title,
        content: chapter.content,
        video: chapter.video || "",
      });
    } else {
      // Creating: reset to blank fields
      methods.reset({
        title: "",
        content: "",
        video: "",
      });
    }
  }, [chapter, methods]);

  /* ---------- Close modal ---------- */
  const onClose = () => {
    dispatch(closeChapterModal());
  };

  /* ---------- Handle save (add or edit) ---------- */
  const onSubmit = (data: ChapterFormData) => {
    if (selectedSectionIndex === null) return;

    // Create new chapter object (keep existing ID if editing)
    const newChapter: Chapter = {
      chapterId: chapter?.chapterId || uuidv4(),
      title: data.title,
      content: data.content,
      type: data.video ? "Video" : "Text",
      video: data.video,
    };

    if (selectedChapterIndex === null) {
      // Add new chapter to the section
      dispatch(
        addChapter({
          sectionIndex: selectedSectionIndex,
          chapter: newChapter,
        })
      );
    } else {
      // Update existing chapter in the section
      dispatch(
        editChapter({
          sectionIndex: selectedSectionIndex,
          chapterIndex: selectedChapterIndex,
          chapter: newChapter,
        })
      );
    }

    // Show success toast (reminder to save course)
    toast.success(
      `Chapter added/updated successfully but you need to save the course to apply the changes`
    );

    // Close modal
    onClose();
  };

  /* ---------- Render modal UI ---------- */
  return (
    <CustomModal isOpen={isChapterModalOpen} onClose={onClose}>
      <div className="chapter-modal">
        {/* ---------- Modal Header ---------- */}
        <div className="chapter-modal__header">
          <h2 className="chapter-modal__title">Add/Edit Chapter</h2>
          <button onClick={onClose} className="chapter-modal__close">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ---------- Chapter Form ---------- */}
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="chapter-modal__form"
          >
            {/* Title field */}
            <CustomFormField
              name="title"
              label="Chapter Title"
              placeholder="Write chapter title here"
            />

            {/* Content field */}
            <CustomFormField
              name="content"
              label="Chapter Content"
              type="textarea"
              placeholder="Write chapter content here"
            />

            {/* Video upload field */}
            <FormField
              control={methods.control}
              name="video"
              render={({ field: { onChange, value } }) => (
                <FormItem>
                  <FormLabel className="text-customgreys-dirtyGrey text-sm">
                    Chapter Video
                  </FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
                        className="border-none bg-customgreys-darkGrey py-2 cursor-pointer"
                      />

                      {/* Show current or selected video name */}
                      {typeof value === "string" && value && (
                        <div className="my-2 text-sm text-gray-600">
                          Current video: {value.split("/").pop()}
                        </div>
                      )}
                      {value instanceof File && (
                        <div className="my-2 text-sm text-gray-600">
                          Selected file: {value.name}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* ---------- Form Actions ---------- */}
            <div className="chapter-modal__actions">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary-700">
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </CustomModal>
  );
};

export default ChapterModal;
