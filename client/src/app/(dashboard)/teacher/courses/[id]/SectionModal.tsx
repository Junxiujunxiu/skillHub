import { CustomFormField } from "@/components/CustomFormField";
import CustomModal from "@/components/CustomModal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SectionFormData, sectionSchema } from "@/lib/schemas";
import { addSection, closeSectionModal, editSection } from "@/state";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

/* =========================================================
   SectionModal Component
   - Modal for creating or editing a course section
   - Uses react-hook-form with zod validation
   - Supports title & description fields
   - Can either add a new section or edit an existing one
   ========================================================= */
const SectionModal = () => {
  /* ---------- Redux setup ---------- */
  const dispatch = useAppDispatch();
  const { isSectionModalOpen, selectedSectionIndex, sections } = useAppSelector(
    (state) => state.global.courseEditor
  );

  /* ---------- Determine current section (edit mode) ---------- */
  const section =
    selectedSectionIndex !== null ? sections[selectedSectionIndex] : null;

  /* ---------- Form setup ---------- */
  const methods = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema), // Validate using zod schema
    defaultValues: {
      title: "",
      description: "",
    },
  });

  /* ---------- Populate form when editing ---------- */
  useEffect(() => {
    if (section) {
      // Editing: load section's existing values
      methods.reset({
        title: section.sectionTitle,
        description: section.sectionDescription,
      });
    } else {
      // Creating: reset to empty values
      methods.reset({
        title: "",
        description: "",
      });
    }
  }, [section, methods]);

  /* ---------- Close modal handler ---------- */
  const onClose = () => {
    dispatch(closeSectionModal());
  };

  /* ---------- Save form handler ---------- */
  const onSubmit = (data: SectionFormData) => {
    // Create new section object, reusing ID if editing
    const newSection: Section = {
      sectionId: section?.sectionId || uuidv4(),
      sectionTitle: data.title,
      sectionDescription: data.description,
      chapters: section?.chapters || [], // Keep chapters if editing
    };

    if (selectedSectionIndex === null) {
      // Add new section
      dispatch(addSection(newSection));
    } else {
      // Edit existing section
      dispatch(
        editSection({
          index: selectedSectionIndex,
          section: newSection,
        })
      );
    }

    // Show success message (reminder to save course)
    toast.success(
      `Section added/updated successfully but you need to save the course to apply the changes`
    );

    // Close modal
    onClose();
  };

  /* ---------- Render modal UI ---------- */
  return (
    <CustomModal isOpen={isSectionModalOpen} onClose={onClose}>
      <div className="section-modal">
        {/* Modal header with title + close button */}
        <div className="section-modal__header">
          <h2 className="section-modal__title">Add/Edit Section</h2>
          <button onClick={onClose} className="section-modal__close">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Section form */}
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="section-modal__form"
          >
            {/* Section title input */}
            <CustomFormField
              name="title"
              label="Section Title"
              placeholder="Write section title here"
            />

            {/* Section description input */}
            <CustomFormField
              name="description"
              label="Section Description"
              type="textarea"
              placeholder="Write section description here"
            />

            {/* Form actions */}
            <div className="section-modal__actions">
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

export default SectionModal;
