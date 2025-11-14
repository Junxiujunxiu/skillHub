/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import SignUpComponent from "../../src/components/SignUp";
import { jest } from "@jest/globals";

// ---------------- Mock Clerk ----------------
const mockUseUser = jest.fn();

const mockSignUp = jest.fn((props: any) => (
  <div data-testid="mock-signup" {...props} />
));

jest.mock("@clerk/nextjs", () => ({
  SignUp: (props: any) => mockSignUp(props),
  useUser: () => mockUseUser(),
}));

// ---------------- Mock next/navigation ----------------
const mockSearchParams = jest.fn();

jest.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams(),
}));

// ---------------- Mock Clerk theme ----------------
jest.mock("@clerk/themes", () => ({
  dark: "mock-dark-theme",
}));

// ---------------- Silence ONLY Clerk-related warnings ----------------
const originalError = console.error;

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((message, ...args) => {
    // Ignore Clerk props warnings (React DOM unknown prop errors)
    if (
      typeof message === "string" &&
      message.includes("React does not recognize")
    ) {
      return;
    }

    // Ignore Clerk "%s" errors (internal formatting warnings)
    if (typeof message === "string" && message.includes("%s")) {
      return;
    }

    // Otherwise show real errors
    originalError(message, ...args);
  });
});

// ---------------- TEST SUITE ----------------
describe("SignUpComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockRender = () => render(<SignUpComponent />);

  // ============= 1. Normal signup =============
  it("passes correct signInUrl and redirect for normal signup", () => {
    mockSearchParams.mockReturnValue({ get: () => null });

    mockUseUser.mockReturnValue({
      user: { publicMetadata: { userType: "student" } },
    });

    mockRender();

    const el = screen.getByTestId("mock-signup");

    expect(el.getAttribute("signInUrl")).toBe("/signin");
    expect(el.getAttribute("forceRedirectUrl")).toBe("user/courses");
  });

  // ============= 2. Teacher redirect =============
  it("redirects teachers to /teacher/courses", () => {
    mockSearchParams.mockReturnValue({ get: () => null });

    mockUseUser.mockReturnValue({
      user: { publicMetadata: { userType: "teacher" } },
    });

    mockRender();

    const el = screen.getByTestId("mock-signup");

    expect(el.getAttribute("forceRedirectUrl")).toBe("/teacher/courses");
  });

  // ============= 3. Checkout flow signup URL =============
  it("passes correct signInUrl during checkout flow", () => {
    mockSearchParams.mockReturnValue({
      get: (key: string) =>
        key === "showSignUp"
          ? "true"
          : key === "id"
          ? "xyz789"
          : null,
    });

    mockUseUser.mockReturnValue({ user: null });

    mockRender();

    const el = screen.getByTestId("mock-signup");

    expect(el.getAttribute("signInUrl")).toBe(
      "/checkout?step=1&id=xyz789&showSignUp=false"
    );
  });

  // ============= 4. Checkout redirect after signup =============
  it("redirects correctly after signup during checkout", () => {
    mockSearchParams.mockReturnValue({
      get: (key: string) =>
        key === "showSignUp"
          ? "true"
          : key === "id"
          ? "xyz789"
          : null,
    });

    mockUseUser.mockReturnValue({
      user: { publicMetadata: { userType: "student" } },
    });

    mockRender();

    const el = screen.getByTestId("mock-signup");

    expect(el.getAttribute("forceRedirectUrl")).toBe(
      "/checkout?step=2&id=xyz789&showSignUp=false"
    );
  });

  // ============= 5. Base Clerk props =============
  it("applies routing + appearance props", () => {
    mockSearchParams.mockReturnValue({ get: () => null });
    mockUseUser.mockReturnValue({ user: null });

    mockRender();

    const el = screen.getByTestId("mock-signup");

    expect(el.getAttribute("routing")).toBe("hash");
    expect(el.getAttribute("afterSignOutUrl")).toBe("/");
  });
});
