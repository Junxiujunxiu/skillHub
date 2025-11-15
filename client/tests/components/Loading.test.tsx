/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import Loading from "@/components/Loading";
import { Loader2 } from "lucide-react";

/* --------------------------------------------------
   Mock lucide-react Loader2 icon to avoid SVG issues
-------------------------------------------------- */
jest.mock("lucide-react", () => ({
  Loader2: (props: any) => (
    <div data-testid="loader-icon" {...props}>ICON</div>
  ),
}));

describe("Loading Component", () => {
  test("renders Loading text", () => {
    render(<Loading />);
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  test("renders loader spinner icon", () => {
    render(<Loading />);
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
  });

  test("renders additional loading message", () => {
    render(<Loading />);
    expect(screen.getByText("Please wait...")).toBeInTheDocument();
  });
});
