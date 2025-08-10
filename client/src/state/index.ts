import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/*---------------------------------- STATE SHAPE ----------------------------------*/
/*
   Defines the structure of the slice state for the Course Editor feature:
   - sections: Ordered list of course sections, each containing chapters.
   - isChapterModalOpen / isSectionModalOpen: Controls modal visibility.
   - selectedSectionIndex / selectedChapterIndex: Tracks the currently selected section/chapter for editing.
*/
interface InitialStateTypes {
  courseEditor: {
    sections: Section[];                 // All sections in the course
    isChapterModalOpen: boolean;         // Chapter modal visibility
    isSectionModalOpen: boolean;         // Section modal visibility
    selectedSectionIndex: number | null; // Currently selected section index
    selectedChapterIndex: number | null; // Currently selected chapter index
  };
}

/*---------------------------------- INITIAL STATE ----------------------------------*/
/*
   Default state for the Course Editor feature:
   - No sections yet
   - Both modals closed
   - No section/chapter selected
*/
const initialState: InitialStateTypes = {
  courseEditor: {
    sections: [],
    isChapterModalOpen: false,
    isSectionModalOpen: false,
    selectedSectionIndex: null,
    selectedChapterIndex: null,
  },
};

/*---------------------------------- SLICE: GLOBAL ----------------------------------*/
/*
   This slice manages all UI and data state for the Course Editor.
   Reducers handle:
   - Setting sections
   - Opening/closing modals
   - Adding, editing, deleting sections
   - Adding, editing, deleting chapters
*/
export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    /* ---------- Sections: Set entire list ---------- */
    setSections: (state, action: PayloadAction<Section[]>) => {
      state.courseEditor.sections = action.payload;
    },

    /* ---------- Chapter Modal: Open/Close with selection ---------- */
    openChapterModal: (
      state,
      action: PayloadAction<{
        sectionIndex: number | null; // Which section this chapter belongs to
        chapterIndex: number | null; // Which chapter to edit (null = add new)
      }>
    ) => {
      state.courseEditor.isChapterModalOpen = true;
      state.courseEditor.selectedSectionIndex = action.payload.sectionIndex;
      state.courseEditor.selectedChapterIndex = action.payload.chapterIndex;
    },
    closeChapterModal: (state) => {
      state.courseEditor.isChapterModalOpen = false;
      state.courseEditor.selectedSectionIndex = null;
      state.courseEditor.selectedChapterIndex = null;
    },

    /* ---------- Section Modal: Open/Close with selection ---------- */
    openSectionModal: (
      state,
      action: PayloadAction<{ sectionIndex: number | null }> // null = add new; number = edit
    ) => {
      state.courseEditor.isSectionModalOpen = true;
      state.courseEditor.selectedSectionIndex = action.payload.sectionIndex;
    },
    closeSectionModal: (state) => {
      state.courseEditor.isSectionModalOpen = false;
      state.courseEditor.selectedSectionIndex = null;
    },

    /* ---------- Sections: Add / Edit / Delete ---------- */
    addSection: (state, action: PayloadAction<Section>) => {
      state.courseEditor.sections.push(action.payload);
    },
    editSection: (
      state,
      action: PayloadAction<{ index: number; section: Section }>
    ) => {
      state.courseEditor.sections[action.payload.index] = action.payload.section;
    },
    deleteSection: (state, action: PayloadAction<number>) => {
      state.courseEditor.sections.splice(action.payload, 1);
    },

    /* ---------- Chapters: Add / Edit / Delete ---------- */
    addChapter: (
      state,
      action: PayloadAction<{ sectionIndex: number; chapter: Chapter }>
    ) => {
      state.courseEditor.sections[action.payload.sectionIndex].chapters.push(
        action.payload.chapter
      );
    },
    editChapter: (
      state,
      action: PayloadAction<{
        sectionIndex: number;
        chapterIndex: number;
        chapter: Chapter;
      }>
    ) => {
      state.courseEditor.sections[action.payload.sectionIndex].chapters[
        action.payload.chapterIndex
      ] = action.payload.chapter;
    },
    deleteChapter: (
      state,
      action: PayloadAction<{ sectionIndex: number; chapterIndex: number }>
    ) => {
      state.courseEditor.sections[action.payload.sectionIndex].chapters.splice(
        action.payload.chapterIndex,
        1
      );
    },
  },
});

/*---------------------------------- EXPORTS ----------------------------------*/
/*
   Exported actions and reducer for use in components and store configuration.
*/
export const {
  setSections,
  openChapterModal,
  closeChapterModal,
  openSectionModal,
  closeSectionModal,
  addSection,
  editSection,
  deleteSection,
  addChapter,
  editChapter,
  deleteChapter,
} = globalSlice.actions;

export default globalSlice.reducer;
