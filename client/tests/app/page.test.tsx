import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

// Mock child components so we don't load their real logic
jest.mock("@/components/NonDashBoardNavBar", () => () => (
  <div data-testid="mock-navbar">Mock Navbar</div>
));

jest.mock("@/app/(nondashboard)/landing/page", () => () => (
  <div data-testid="mock-landing">Mock Landing Page</div>
));

jest.mock("@/components/Footer", () => () => (
  <div data-testid="mock-footer">Mock Footer</div>
));

describe("Home Page", () => {
  it("renders the home layout with navbar, landing, and footer", () => {
    render(<Home />);

    expect(screen.getByTestId("mock-navbar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-landing")).toBeInTheDocument();
    expect(screen.getByTestId("mock-footer")).toBeInTheDocument();
  });
});
