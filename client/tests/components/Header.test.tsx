/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "@/components/Header"; // adjust path if required

describe("Header Component", () => {
  test("renders title and subtitle", () => {
    render(<Header title="Dashboard" subtitle="Welcome back!" />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Welcome back!")).toBeInTheDocument();
  });

  test("renders rightElement when provided", () => {
    render(
      <Header
        title="Courses"
        subtitle="Your learning progress"
        rightElement={<button data-testid="header-btn">Add</button>}
      />
    );

    expect(screen.getByTestId("header-btn")).toBeInTheDocument();
  });

  test("does not render rightElement when not provided", () => {
    render(<Header title="Profile" subtitle="Manage your info" />);

    expect(screen.queryByTestId("header-btn")).not.toBeInTheDocument();
  });
});
