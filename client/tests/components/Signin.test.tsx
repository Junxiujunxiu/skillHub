/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import SignInComponent from "../../src/components/Signin";
import { jest } from "@jest/globals";

// =========================================================
//                      MOCKS
// =========================================================

// -------- Mock Clerk --------
const mockUseUser = jest.fn();
const mockSignIn = jest.fn((props: any) => (
  <div data-testid="mock-signin" {...props} />
));

jest.mock("@clerk/nextjs", () => ({
  SignIn: (props: any) => mockSignIn(props),
  useUser: () => mockUseUser(),
}));

// -------- Mock next/navigation --------
const mockSearchParams = jest.fn();

jest.mock("next/navigation", () => ({
  useSearchParams: () => mockSearchParams(),
}));

// -------- Mock Clerk theme --------
jest.mock("@clerk/themes", () => ({
  dark: "mock-dark-theme",
}));

// =========================================================
//        SILENCE CLERK PROP WARNINGS (SAFE VERSION)
// =========================================================

// capture original console.error BEFORE mock
const originalError = console.error;

beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation((message) => {
      if (
        typeof message === "string" &&
        (
          message.includes("signUpUrl") ||          // SignIn warnings
          message.includes("forceRedirectUrl") ||
          message.includes("afterSignOutUrl") ||
          message.includes("React does not recognize") ||  // DOM prop warnings
          message.includes("%s")                         // the placeholder warning
        )
      ) {
        return; // suppress only these warnings
      }
  
      originalError(message); // allow all other errors
    });
  });  

// =========================================================
//                       TESTS
// =========================================================

describe("SignInComponent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockRender = () => render(<SignInComponent />);

  // ---------------------------------------------------------
  // Test 1 — Normal login flow
  // ---------------------------------------------------------
  it("passes correct signUpUrl and redirect for normal login", () => {
    mockSearchParams.mockReturnValue({ get: () => null });

    mockUseUser.mockReturnValue({
      user: { publicMetadata: { userType: "student" } },
    });

    mockRender();

    const signInEl = screen.getByTestId("mock-signin");

    expect(signInEl.getAttribute("signUpUrl")).toBe("/signup");
    expect(signInEl.getAttribute("forceRedirectUrl")).toBe("user/courses");
  });

  // ---------------------------------------------------------
  // Test 2 — Teacher login redirect
  // ---------------------------------------------------------
  it("redirects teachers to /teacher/courses", () => {
    mockSearchParams.mockReturnValue({ get: () => null });

    mockUseUser.mockReturnValue({
      user: { publicMetadata: { userType: "teacher" } },
    });

    mockRender();

    const signInEl = screen.getByTestId("mock-signin");
    expect(signInEl.getAttribute("forceRedirectUrl")).toBe("/teacher/courses");
  });

  // ---------------------------------------------------------
  // Test 3 — Checkout sign up link
  // ---------------------------------------------------------
  it("passes correct signUpUrl during checkout", () => {
    mockSearchParams.mockReturnValue({
      get: (key: string) =>
        key === "showSignUp"
          ? "true"
          : key === "id"
          ? "abc123"
          : null,
    });

    mockUseUser.mockReturnValue({ user: null });

    mockRender();

    const signInEl = screen.getByTestId("mock-signin");

    expect(signInEl.getAttribute("signUpUrl")).toBe(
      "/checkout?step=1&id=abc123&showSignUp=true"
    );
  });

  // ---------------------------------------------------------
  // Test 4 — Checkout redirect after sign-in
  // ---------------------------------------------------------
  it("redirects correctly after sign-in during checkout", () => {
    mockSearchParams.mockReturnValue({
      get: (key: string) =>
        key === "showSignUp"
          ? "true"
          : key === "id"
          ? "abc123"
          : null,
    });

    mockUseUser.mockReturnValue({
      user: { publicMetadata: { userType: "student" } },
    });

    mockRender();

    const signInEl = screen.getByTestId("mock-signin");

    expect(signInEl.getAttribute("forceRedirectUrl")).toBe(
      "/checkout?step=2&id=abc123&showSignUp=true"
    );
  });

  // ---------------------------------------------------------
  // Test 5 — Routing + appearance props
  // ---------------------------------------------------------
  it("applies routing + appearance props", () => {
    mockSearchParams.mockReturnValue({ get: () => null });
    mockUseUser.mockReturnValue({ user: null });

    mockRender();

    const signInEl = screen.getByTestId("mock-signin");

    expect(signInEl.getAttribute("routing")).toBe("hash");
    expect(signInEl.getAttribute("afterSignOutUrl")).toBe("/");
  });
});
