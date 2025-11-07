import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CheckoutDetailsPage from "../../../../src/app/(nondashboard)/checkout/details/index";
import { jest } from "@jest/globals";

/* =========================================================
   Mocks
   ========================================================= */

// 🧩 Mock react-hook-form
jest.mock("react-hook-form", () => ({
  useForm: () => ({
    handleSubmit: (fn: any) => (e?: any) => fn({ email: "test@example.com" }),
    register: jest.fn(),
    formState: { errors: {} },
  }),
}));

// 🧩 Mock next/navigation
jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(),
}));
import { useSearchParams } from "next/navigation";

// 🧩 Mock custom hook
jest.mock("../../../../src/hooks/useCurrentCourse", () => ({
  __esModule: true,
  useCurrentCourse: jest.fn(),
}));

// 🧩 Mock UI dependencies
jest.mock("../../../../src/components/CoursePreview", () => ({
  __esModule: true,
  default: ({ course }: any) => (
    <div data-testid="course-preview">{course.title}</div>
  ),
}));

jest.mock("../../../../src/components/CustomFormField", () => ({
  __esModule: true,
  CustomFormField: ({ name }: any) => (
    <input data-testid={name} name={name} />
  ),
}));

jest.mock("../../../../src/components/Signin", () => ({
  __esModule: true,
  default: () => <div data-testid="signin-component">Sign In</div>,
}));

jest.mock("../../../../src/components/SignUp", () => ({
  __esModule: true,
  default: () => <div data-testid="signup-component">Sign Up</div>,
}));

jest.mock("../../../../src/components/Loading", () => ({
  __esModule: true,
  default: () => <div data-testid="loading">Loading...</div>,
}));

// 🧩 Mock the missing Form component from "@/components/ui/form"
jest.mock("../../../../src/components/ui/form", () => ({
  __esModule: true,
  Form: ({ children }: any) => <div data-testid="form-wrapper">{children}</div>,
}));

/* =========================================================
   Tests
   ========================================================= */

describe("CheckoutDetailsPage", () => {
  const { useCurrentCourse } = require("../../../../src/hooks/useCurrentCourse");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state", () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => "false" });
    useCurrentCourse.mockReturnValue({
      isLoading: true,
      isError: false,
      course: null,
    });

    render(<CheckoutDetailsPage />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  test("renders error state", () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => "false" });
    useCurrentCourse.mockReturnValue({
      isLoading: false,
      isError: true,
      course: null,
    });

    render(<CheckoutDetailsPage />);
    expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
  });

  test("renders no course found message", () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => "false" });
    useCurrentCourse.mockReturnValue({
      isLoading: false,
      isError: false,
      course: null,
    });

    render(<CheckoutDetailsPage />);
    expect(screen.getByText(/no course found/i)).toBeInTheDocument();
  });

  test("renders course preview and SignIn component", () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => "false" });
    useCurrentCourse.mockReturnValue({
      isLoading: false,
      isError: false,
      course: { title: "React Basics" },
    });

    render(<CheckoutDetailsPage />);
    expect(screen.getByTestId("course-preview")).toHaveTextContent("React Basics");
    expect(screen.getByTestId("signin-component")).toBeInTheDocument();
  });

  test("renders SignUp component when showSignUp=true", () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => "true" });
    useCurrentCourse.mockReturnValue({
      isLoading: false,
      isError: false,
      course: { title: "React Basics" },
    });

    render(<CheckoutDetailsPage />);
    expect(screen.getByTestId("signup-component")).toBeInTheDocument();
  });

  test("handles guest email submission", async () => {
    (useSearchParams as jest.Mock).mockReturnValue({ get: () => "false" });
    useCurrentCourse.mockReturnValue({
      isLoading: false,
      isError: false,
      course: { title: "React Basics" },
    });

    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    render(<CheckoutDetailsPage />);

    const emailInput = screen.getByTestId("email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    // find the form element and submit it
    const form = emailInput.closest("form");
    if (form) fireEvent.submit(form);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Guest Checkout Data:", {
        email: "test@example.com",
      });
    });

    consoleSpy.mockRestore();
  });
});
