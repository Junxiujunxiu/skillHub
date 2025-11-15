/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import NonDashBoardNavBar from "@/components/NonDashBoardNavBar";

/* --------------------------------------------------
   Mock Next.js Link
-------------------------------------------------- */
jest.mock("next/link", () => {
  return ({ children, href }: any) => (
    <a data-testid={`link-${href}`} href={href}>
      {children}
    </a>
  );
});

/* --------------------------------------------------
   Mock Clerk components
-------------------------------------------------- */
const mockUseUser = jest.fn();

jest.mock("@clerk/nextjs", () => ({
  useUser: () => mockUseUser(),
  SignedIn: ({ children }: any) => <div data-testid="signed-in">{children}</div>,
  SignedOut: ({ children }: any) => (
    <div data-testid="signed-out">{children}</div>
  ),
  UserButton: (props: any) => (
    <div data-testid="user-button">{JSON.stringify(props)}</div>
  ),
}));

/* --------------------------------------------------
   Mock lucide-react icons
-------------------------------------------------- */
jest.mock("lucide-react", () => ({
  Bell: () => <div data-testid="icon-bell" />,
  BookOpen: () => <div data-testid="icon-bookopen" />,
}));

/* --------------------------------------------------
   TESTS
-------------------------------------------------- */
describe("NonDashBoardNavBar (Unit Test)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders brand name link", () => {
    mockUseUser.mockReturnValue({ user: null });

    render(<NonDashBoardNavBar />);

    expect(screen.getByTestId("link-/")).toHaveTextContent("BrandName");
  });

  test("renders the search link", () => {
    mockUseUser.mockReturnValue({ user: null });

    render(<NonDashBoardNavBar />);

    expect(screen.getByTestId("link-/search")).toBeInTheDocument();
  });

  test("renders notification button and bell icon", () => {
    mockUseUser.mockReturnValue({ user: null });

    render(<NonDashBoardNavBar />);

    expect(screen.getByTestId("icon-bell")).toBeInTheDocument();
  });

  test("shows Log in & Sign up when signed out", () => {
    mockUseUser.mockReturnValue({ user: null });

    render(<NonDashBoardNavBar />);

    expect(screen.getByTestId("signed-out")).toBeInTheDocument();
    expect(screen.getByTestId("link-/signin")).toHaveTextContent("Log in");
    expect(screen.getByTestId("link-/signup")).toHaveTextContent("Sign up");
  });

  test("shows UserButton when signed in", () => {
    mockUseUser.mockReturnValue({
      user: {
        publicMetadata: { userType: "student" },
      },
    });

    render(<NonDashBoardNavBar />);

    expect(screen.getByTestId("signed-in")).toBeInTheDocument();
    expect(screen.getByTestId("user-button")).toBeInTheDocument();
  });
});
