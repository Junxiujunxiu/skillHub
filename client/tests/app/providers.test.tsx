import React from "react";
import { render, screen } from "@testing-library/react";
import Providers from "@/app/providers"; // adjust if located elsewhere

// 🧩 Mock the Redux StoreProvider to isolate this test
jest.mock("@/state/redux", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-store-provider">{children}</div>
  ),
}));

describe("Providers component", () => {
  test("renders children within the StoreProvider", () => {
    render(
      <Providers>
        <p data-testid="child">Hello Provider</p>
      </Providers>
    );

    //  Ensure StoreProvider is rendered
    expect(screen.getByTestId("mock-store-provider")).toBeInTheDocument();

    //  Ensure children are rendered correctly
    expect(screen.getByTestId("child")).toHaveTextContent("Hello Provider");
  });
});
