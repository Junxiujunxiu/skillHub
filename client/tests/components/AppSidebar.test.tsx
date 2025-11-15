/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

// ------------------------------------------------------------
// Create the mock BEFORE importing AppSidebar
// ------------------------------------------------------------
const mockSignOut = jest.fn();

jest.mock("@clerk/nextjs", () => ({
  useUser: jest.fn(),
  useClerk: () => ({ signOut: mockSignOut }),
}));

// ------------------------------------------------------------
// Other mocks (sidebar, icons, next/navigation, next/link, next/image)
// ------------------------------------------------------------
jest.mock("lucide-react", () =>
  new Proxy(
    {},
    {
      get: (_, prop) =>
        function MockIcon(props: any) {
          return <svg data-testid={`icon-${String(prop).toLowerCase()}`} {...props} />;
        },
    }
  )
);

jest.mock('@/components/ui/sidebar', () => ({
  Sidebar: ({ children }: any) => <div>{children}</div>,
  SidebarHeader: ({ children }: any) => <div>{children}</div>,
  SidebarContent: ({ children }: any) => <div>{children}</div>,
  SidebarFooter: ({ children }: any) => <div>{children}</div>,
  SidebarMenu: ({ children }: any) => <ul>{children}</ul>,
  SidebarMenuItem: ({ children }: any) => <li>{children}</li>,
  SidebarMenuButton: ({ children }: any) => <>{children}</>,
  useSidebar: () => ({ toggleSidebar: jest.fn() }),
}));

jest.mock("next/image", () => (props: any) => <img {...props} />);
jest.mock("next/link", () => (props: any) => <a href={props.href}>{props.children}</a>);

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

// ------------------------------------------------------------
// AFTER all mocks → import the component
// ------------------------------------------------------------
import AppSidebar from "../../src/components/AppSidebar";

const mockUseUser = require("@clerk/nextjs").useUser;
const mockUsePathname = require("next/navigation").usePathname;

// ------------------------------------------------------------
// TESTS
// ------------------------------------------------------------
describe("AppSidebar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows loading state when Clerk is not loaded", () => {
    mockUseUser.mockReturnValue({ isLoaded: false });

    render(<AppSidebar />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("shows 'User not found.' when no user", () => {
    mockUseUser.mockReturnValue({ isLoaded: true, user: null });

    render(<AppSidebar />);
    expect(screen.getByText("User not found.")).toBeInTheDocument();
  });

  test("renders student nav links", () => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      user: { publicMetadata: { userType: "student" } },
    });
    mockUsePathname.mockReturnValue("/user/courses");

    render(<AppSidebar />);

    expect(screen.getByText("Courses")).toBeInTheDocument();
    expect(screen.getByText("Billing")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  test("renders teacher nav links", () => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      user: { publicMetadata: { userType: "teacher" } },
    });
    mockUsePathname.mockReturnValue("/teacher/billing");

    render(<AppSidebar />);

    expect(screen.getByText("Courses")).toBeInTheDocument();
    expect(screen.getByText("Billing")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  test("calls signOut when clicking sign out", () => {
    mockUseUser.mockReturnValue({
      isLoaded: true,
      user: { publicMetadata: { userType: "student" } },
    });
    mockUsePathname.mockReturnValue("/user/courses");

    render(<AppSidebar />);

    fireEvent.click(screen.getByText("Sign out"));

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
