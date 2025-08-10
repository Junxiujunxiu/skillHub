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
   Purpose:
   - Handles adding and editing course sections inside a modal
   - Uses react-hook-form for form handling
   - Validates input using zod
   - Integrates with Redux for section management

   Key Features:
   - Modal opens when triggered via Redux state
   - Prefills data if editing an existing section
   - Creates new section IDs for new entries
   - Displays success toast but requires saving the course for final commit
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
    resolver: zodResolver(sectionSchema), // Validates form using zod
    defaultValues: {
      title: "",
      description: "",
    },
  });

  /* ---------- Populate form when editing ---------- */
  useEffect(() => {
    if (section) {
      // Edit mode: load existing section data
      methods.reset({
        title: section.sectionTitle,
        description: section.sectionDescription,
      });
    } else {
      // New section: reset to empty form
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

  /* ---------- Form submission handler ---------- */
  const onSubmit = (data: SectionFormData) => {
    // Build section object
    const newSection: Section = {
      sectionId: section?.sectionId || uuidv4(),
      sectionTitle: data.title,
      sectionDescription: data.description,
      chapters: section?.chapters || [], // Keep chapters if editing
    };

    if (selectedSectionIndex === null) {
      // Adding a new section
      dispatch(addSection(newSection));
    } else {
      // Editing an existing section
      dispatch(
        editSection({
          index: selectedSectionIndex,
          section: newSection,
        })
      );
    }

    // Notify user of success but remind to save course
    toast.success(
      `Section added/updated successfully but you need to save the course to apply the changes`
    );

    // Close modal
    onClose();
  };

  /* ---------- Render UI ---------- */
  return (
    <CustomModal isOpen={isSectionModalOpen} onClose={onClose}>
      <div className="section-modal">
        {/* Modal header */}
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
            {/* Section title */}
            <CustomFormField
              name="title"
              label="Section Title"
              placeholder="Write section title here"
            />

            {/* Section description */}
            <CustomFormField
              name="description"
              label="Section Description"
              type="textarea"
              placeholder="Write section description here"
            />

            {/* Action buttons */}
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
