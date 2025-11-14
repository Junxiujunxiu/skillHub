/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useForm, FormProvider } from "react-hook-form";

import { CustomFormField } from "../../src/components/CustomFormField";

// ===============================================================
//  🔥  MOCKS
// ===============================================================

// ---------- Fix Slot so label works ----------
jest.mock("@radix-ui/react-slot", () => ({
    Slot: ({ children, ...props }: any) => {
      return React.cloneElement(
        React.Children.only(children),
        { id: props.id || "test-id", ...children.props }
      );
    },
  }));
  
  // ---------- FIXED Select mock (no <div> inside <select>) ----------
  jest.mock("@/components/ui/select", () => {
    const React = require("react");
  
    return {
      Select: ({ children, value, onValueChange }: any) => (
        <select
          data-testid="mock-select"
          value={value ?? ""}
          onChange={(e) => onValueChange(e.target.value)}
        >
          {children}
        </select>
      ),
      SelectTrigger: ({ children }: any) => null, // remove illegal <div>
      SelectValue: ({ placeholder }: any) => (
        <option disabled value="">
          {placeholder}
        </option>
      ),
      SelectContent: ({ children }: any) => <>{children}</>,
      SelectItem: ({ value, children }: any) => (
        <option value={value}>{children}</option>
      ),
    };
  });  

// ---------- Mock Switch ----------
jest.mock("@/components/ui/switch", () => ({
  Switch: ({ checked, onCheckedChange }: any) => (
    <button
      role="switch"
      aria-checked={checked}
      data-testid="mock-switch"
      onClick={() => onCheckedChange(!checked)}
    >
      {checked ? "ON" : "OFF"}
    </button>
  ),
}));

// ---------- Mock FilePond ----------
jest.mock("react-filepond", () => ({
  FilePond: ({ onupdatefiles }: any) => (
    <input
      data-testid="mock-filepond"
      type="file"
      onChange={(e: any) => onupdatefiles([{ file: e.target.files[0] }])}
    />
  ),
}));

jest.mock("filepond-plugin-image-preview", () => {});
jest.mock("filepond-plugin-image-exif-orientation", () => {});

// ---------- Mock Icons ----------
jest.mock("lucide-react", () => ({
  X: () => <span data-testid="icon-x" />,
  Plus: () => <span data-testid="icon-plus" />,
}));

// ---------- Mock useFieldArray ----------
const mockAppend = jest.fn();
const mockRemove = jest.fn();

jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
    useFieldArray: jest.fn(() => ({
      fields: [{ id: "1" }],
      append: mockAppend,
      remove: mockRemove,
    })),
  };
});


// ===============================================================
//  🔥  Utility to Wrap in RHF
// ===============================================================
const renderWithForm = (ui: React.ReactNode, defaultValues = {}) => {
  const Wrapper = () => {
    const methods = useForm({ defaultValues });
    return <FormProvider {...methods}>{ui}</FormProvider>;
  };
  return render(<Wrapper />);
};

// ===============================================================
//  🔥  TESTS
// ===============================================================
describe("CustomFormField", () => {
  test("renders a text input", () => {
    renderWithForm(
      <CustomFormField name="title" label="Title" type="text" />
    );

    const input = screen.getByLabelText("Title");
    expect(input).toBeInTheDocument();
  });

  test("renders a textarea", () => {
    renderWithForm(
      <CustomFormField name="bio" label="Bio" type="textarea" />
    );

    expect(screen.getByLabelText("Bio")).toBeInTheDocument();
  });

  test("renders a number input", () => {
    renderWithForm(
      <CustomFormField name="age" label="Age" type="number" />
    );

    const input = screen.getByLabelText("Age");
    expect(input).toHaveAttribute("type", "number");
  });

  test("renders a select and updates value", () => {
    renderWithForm(
      <CustomFormField
        name="role"
        label="Role"
        type="select"
        options={[
          { value: "student", label: "Student" },
          { value: "teacher", label: "Teacher" },
        ]}
      />,
      { role: "" }
    );

    const select = screen.getByTestId("mock-select") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "teacher" } });

    expect(select.value).toBe("teacher");
  });

  test("renders a switch and toggles", () => {
    renderWithForm(
      <CustomFormField name="active" label="Active" type="switch" />,
      { active: false }
    );

    const sw = screen.getByRole("switch");
    expect(sw).toHaveAttribute("aria-checked", "false");

    fireEvent.click(sw);
    expect(sw).toHaveAttribute("aria-checked", "true");
  });

  test("renders FilePond when type is file", () => {
    renderWithForm(
      <CustomFormField name="video" label="Video" type="file" />,
      { video: null }
    );

    expect(screen.getByTestId("mock-filepond")).toBeInTheDocument();
  });

  test("adds and removes multi-input fields", () => {
    const mockAppend = require("react-hook-form").useFieldArray().append;
    const mockRemove = require("react-hook-form").useFieldArray().remove;

    renderWithForm(
      <CustomFormField
        name="tags"
        label="Tags"
        type="multi-input"
      />,
      { tags: ["hello"] }
    );

    fireEvent.click(screen.getByText("Add Item"));
    expect(mockAppend).toHaveBeenCalled();

    fireEvent.click(screen.getByTestId("icon-x"));
    expect(mockRemove).toHaveBeenCalled();
  });

  test("applies initialValue correctly", () => {
    renderWithForm(
      <CustomFormField
        name="preset"
        label="Preset"
        type="text"
        initialValue="hello"
      />
    );

    const input = screen.getByLabelText("Preset") as HTMLInputElement;
    expect(input.value).toBe("hello");
  });
});
