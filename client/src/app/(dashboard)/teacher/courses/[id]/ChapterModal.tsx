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

const ChapterModal = () => {
  /* ------------------------- Redux state & dispatcher ------------------------- */
  // Extract modal state, selected section/chapter indices, and course sections
  const dispatch = useAppDispatch();
  const {
    isChapterModalOpen,
    selectedSectionIndex,
    selectedChapterIndex,
    sections,
  } = useAppSelector((state) => state.global.courseEditor);

  /* ------------------------- Current chapter (edit mode) ---------------------- */
  // If section & chapter indices exist, retrieve the chapter being edited
  const chapter: Chapter | undefined =
    selectedSectionIndex !== null && selectedChapterIndex !== null
      ? sections[selectedSectionIndex].chapters[selectedChapterIndex]
      : undefined;

  /* --------------------------- Form setup & validation ------------------------ */
  // Initialize react-hook-form with zod validation schema and default values
  const methods = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: "",
      content: "",
      video: "",
    },
  });

  /* -------------------- Sync form with selected chapter ----------------------- */
  // Populate the form when editing or reset when adding a new chapter
  useEffect(() => {
    if (chapter) {
      methods.reset({
        title: chapter.title,
        content: chapter.content,
        video: chapter.video || "",
      });
    } else {
      methods.reset({
        title: "",
        content: "",
        video: "",
      });
    }
  }, [chapter, methods]);

  /* ------------------------------ Close modal --------------------------------- */
  const onClose = () => {
    dispatch(closeChapterModal());
  };

  /* ------------------------------ Save chapter -------------------------------- */
  // Handles both creating a new chapter and editing an existing one
  const onSubmit = (data: ChapterFormData) => {
    if (selectedSectionIndex === null) return;

    // Create new chapter object (retain ID if editing)
    const newChapter: Chapter = {
      chapterId: chapter?.chapterId || uuidv4(),
      title: data.title,
      content: data.content,
      type: data.video ? "Video" : "Text",
      video: data.video,
    };

    // Add or update chapter in Redux store
    if (selectedChapterIndex === null) {
      dispatch(
        addChapter({
          sectionIndex: selectedSectionIndex,
          chapter: newChapter,
        })
      );
    } else {
      dispatch(
        editChapter({
          sectionIndex: selectedSectionIndex,
          chapterIndex: selectedChapterIndex,
          chapter: newChapter,
        })
      );
    }

    // Show success notification and close modal
    toast.success(
      `Chapter added/updated successfully but you need to save the course to apply the changes`
    );
    onClose();
  };

  /* ------------------------------- Render UI ---------------------------------- */
  return (
    <CustomModal isOpen={isChapterModalOpen} onClose={onClose}>
      <div className="chapter-modal">
        
        {/* ---------- Modal header with title and close button ---------- */}
        <div className="chapter-modal__header">
          <h2 className="chapter-modal__title">Add/Edit Chapter</h2>
          <button onClick={onClose} className="chapter-modal__close">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ---------- Form for chapter details ---------- */}
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="chapter-modal__form"
          >
            {/* Chapter title field */}
            <CustomFormField
              name="title"
              label="Chapter Title"
              placeholder="Write chapter title here"
            />

            {/* Chapter content field */}
            <CustomFormField
              name="content"
              label="Chapter Content"
              type="textarea"
              placeholder="Write chapter content here"
            />

            {/* Chapter video file upload */}
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

            {/* ---------- Form actions ---------- */}
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
