/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import NavBar from "../../src/components/Navbar";
import { jest } from "@jest/globals";

// ===============================
//  Mock Clerk
// ===============================
jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
  UserButton: (props: any) => (
    <div data-testid="user-button" data-url={props.userProfileUrl}></div>
  ),
  SignedIn: ({ children }: any) => <div>{children}</div>,
  SignedOut: ({ children }: any) => <div>{children}</div>,
}));

// ===============================
//  Mock Icons
// ===============================
jest.mock("lucide-react", () => ({
  Bell: () => <span data-testid="icon-bell" />,
  BookOpen: () => <span data-testid="icon-book" />,
}));

// ===============================
//  Mock Sidebar Trigger
// ===============================
jest.mock("@/components/ui/sidebar", () => ({
  SidebarTrigger: (props: any) => (
    <button data-testid="sidebar-trigger" {...props} />
  ),
}));

// ===============================
// 🔥 Mock Next.js Link
// ===============================
jest.mock("next/link", () => {
    return ({ children, href, className }: any) => (
      <a data-testid="next-link" href={href} className={className}>
        {children}
      </a>
    );
  });  

// ===============================
//  Tests
// ===============================
describe("NavBar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders search bar, bell icon, and sidebar trigger", () => {
    const useUser = require("@clerk/nextjs").useUser;
    useUser.mockReturnValue({ user: null });

    render(<NavBar isCoursePage={false} />);

    expect(screen.getByTestId("next-link")).toHaveAttribute("href", "/search");
    expect(screen.getByTestId("icon-book")).toBeInTheDocument();
    expect(screen.getByTestId("icon-bell")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-trigger")).toBeInTheDocument();
  });

  test("applies different background when isCoursePage=true", () => {
    const useUser = require("@clerk/nextjs").useUser;
    useUser.mockReturnValue({ user: null });

    render(<NavBar isCoursePage={true} />);

    const searchLink = screen.getByTestId("next-link");
    expect(searchLink.className).toContain("!bg-customgreys-secondarybg");
  });

  test("UserButton uses student profile URL by default", () => {
    const useUser = require("@clerk/nextjs").useUser;

    useUser.mockReturnValue({
      user: { publicMetadata: { userType: "student" } },
    });

    render(<NavBar isCoursePage={false} />);

    const userBtn = screen.getByTestId("user-button");

    expect(userBtn.getAttribute("data-url")).toBe("/user/profile");
  });

  test("UserButton uses teacher profile URL when role=teacher", () => {
    const useUser = require("@clerk/nextjs").useUser;

    useUser.mockReturnValue({
      user: { publicMetadata: { userType: "teacher" } },
    });

    render(<NavBar isCoursePage={false} />);

    const userBtn = screen.getByTestId("user-button");

    expect(userBtn.getAttribute("data-url")).toBe("/teacher/profile");
  });
});
