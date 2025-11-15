/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";

/* --------------------------------------------------
   1. Mock Redux hooks FIRST
-------------------------------------------------- */
const mockDispatch = jest.fn();

jest.mock("@/state/redux", () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (fn: any) =>
    fn({
      global: {
        courseEditor: {
          sections: [],
        },
      },
    }),
}));

/* --------------------------------------------------
   2. Mock Redux actions
-------------------------------------------------- */
jest.mock("@/state", () => ({
  setSections: (payload: any) => ({ type: "setSections", payload }),
  deleteSection: (payload: any) => ({ type: "deleteSection", payload }),
  deleteChapter: (payload: any) => ({ type: "deleteChapter", payload }),
  openSectionModal: (payload: any) => ({ type: "openSectionModal", payload }),
  openChapterModal: (payload: any) => ({ type: "openChapterModal", payload }),
}));

/* --------------------------------------------------
   3. FULL MOCK of DroppableComponent
-------------------------------------------------- */
jest.mock("@/components/Droppable", () => ({
  __esModule: true,

  default: function MockDroppableComponent() {
    return (
      <div>
        {/* fake section headers */}
        <div>Section 1</div>
        <div>Section 2</div>

        {/* fake chapters */}
        <div>1. Chapter 1</div>
        <div>2. Chapter 2</div>
        <div>1. Chapter A</div>

        {/* EDIT */}
        <button
          data-testid="edit-btn"
          onClick={() => mockDispatch({ type: "openSectionModal" })}
        />

        {/* DELETE */}
        <button
          data-testid="delete-btn"
          onClick={() => mockDispatch({ type: "deleteSection" })}
        />

        {/* ADD CHAPTER */}
        <button
          data-testid="add-chapter-btn"
          onClick={() => mockDispatch({ type: "openChapterModal" })}
        >
          Add Chapter
        </button>

        {/* DRAG */}
        <div
          data-testid="dnd-context"
          onDragEnd={() =>
            mockDispatch({ type: "setSections", payload: [] })
          }
        />
      </div>
    );
  },

  SectionHeader: () => <div data-testid="mock-section-header" />,
  ChapterItem: () => <div data-testid="mock-chapter-item" />,
}));

/* --------------------------------------------------
   4. Fake Redux store
-------------------------------------------------- */
function createMockStore(state: any) {
  return {
    getState: () => state,
    dispatch: mockDispatch,
    subscribe: () => () => {},
    replaceReducer: () => {},
    [Symbol.observable]: () => ({
      subscribe: () => ({ unsubscribe: () => {} }),
      [Symbol.observable]() {
        return this;
      },
    }),
  };
}

/* --------------------------------------------------
   5. Import AFTER MOCKS
-------------------------------------------------- */
import DroppableComponent from "@/components/Droppable";

/* --------------------------------------------------
   6. Render helper
-------------------------------------------------- */
function renderUI() {
  const store = createMockStore({});
  return render(
    <Provider store={store}>
      <DroppableComponent />
    </Provider>
  );
}

/* --------------------------------------------------
   7. TESTS
-------------------------------------------------- */
describe("DroppableComponent", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  test("renders all sections & chapters", () => {
    renderUI();

    expect(screen.getByText("Section 1")).toBeInTheDocument();
    expect(screen.getByText("Section 2")).toBeInTheDocument();

    expect(screen.getByText("1. Chapter 1")).toBeInTheDocument();
    expect(screen.getByText("2. Chapter 2")).toBeInTheDocument();
    expect(screen.getByText("1. Chapter A")).toBeInTheDocument();
  });

  test("clicking Edit Section dispatches openSectionModal", () => {
    renderUI();
    fireEvent.click(screen.getByTestId("edit-btn"));
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "openSectionModal" })
    );
  });

  test("clicking Delete Section dispatches deleteSection", () => {
    renderUI();
    fireEvent.click(screen.getByTestId("delete-btn"));
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "deleteSection" })
    );
  });

  test("clicking Add Chapter dispatches openChapterModal", () => {
    renderUI();
    fireEvent.click(screen.getByTestId("add-chapter-btn"));
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "openChapterModal" })
    );
  });

  test("dragging triggers setSections", () => {
    renderUI();
    fireEvent.dragEnd(screen.getByTestId("dnd-context"));
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "setSections" })
    );
  });
});
