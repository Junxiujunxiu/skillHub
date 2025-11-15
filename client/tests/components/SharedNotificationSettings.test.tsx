/**
 * @jest-environment jsdom
 */

import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import SharedNotificationSettings from "@/components/SharedNotificationSettings";

/* --------------------------------------------------
   MOCK Clerk user
-------------------------------------------------- */
jest.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    user: {
      id: "123",
      publicMetadata: {
        settings: {
          courseNotifications: true,
          emailAlerts: false,
          smsAlerts: true,
          notificationFrequency: "daily",
        },
      },
    },
  }),
}));

/* --------------------------------------------------
   MOCK RTK Query
-------------------------------------------------- */
const mockUpdateUser = jest.fn();

jest.mock("@/state/api", () => ({
  useUpdateUserMutation: () => [mockUpdateUser],
}));

/* --------------------------------------------------
   MOCK CustomFormField (avoid useController / RHF complexity)
-------------------------------------------------- */
jest.mock("@/components/CustomFormField", () => ({
  CustomFormField: ({ label }: any) => (
    <div data-testid="mock-field">{label}</div>
  ),
}));

/* --------------------------------------------------
   MOCK Header
-------------------------------------------------- */
jest.mock("@/components/Header", () => ({
  __esModule: true,
  default: ({ title, subtitle }: any) => (
    <div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  ),
}));

/* --------------------------------------------------
   MOCK toast
-------------------------------------------------- */
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

/* --------------------------------------------------
   TESTS
-------------------------------------------------- */
describe("SharedNotificationSettings (Unit Test)", () => {
  beforeEach(() => {
    mockUpdateUser.mockClear();
  });

  test("renders header", () => {
    render(<SharedNotificationSettings />);

    expect(screen.getByText("Notification Settings")).toBeInTheDocument();
    expect(
      screen.getByText("Manage your notification settings")
    ).toBeInTheDocument();
  });

  test("renders all form fields", () => {
    render(<SharedNotificationSettings />);

    expect(screen.getByText("Course Notifications")).toBeInTheDocument();
    expect(screen.getByText("Email Alerts")).toBeInTheDocument();
    expect(screen.getByText("SMS Alerts")).toBeInTheDocument();
    expect(screen.getByText("Notification Frequency")).toBeInTheDocument();
  });

  test("renders submit button", () => {
    render(<SharedNotificationSettings />);
    expect(
      screen.getByRole("button", { name: /update settings/i })
    ).toBeInTheDocument();
  });

  test("submit triggers updateUser mutation", async () => {
    render(<SharedNotificationSettings />);

    const btn = screen.getByRole("button", { name: /update settings/i });
    fireEvent.click(btn);

    // wait for async submit handler to run
    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledTimes(1);
    });
  });
});

/* --------------------------------------------------
   COMMAND TO RUN THIS TEST ONLY
-------------------------------------------------- */

//
// npm test -- tests/components/SharedNotificationSettings.test.tsx
//
