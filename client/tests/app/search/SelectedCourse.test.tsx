import { render, screen, fireEvent } from "@testing-library/react";
import SelectedCourse from "@/app/(nondashboard)/search/SelectedCourse";

// Mock AccordionSections component
jest.mock("@/components/AccordionSections", () => ({ sections }: any) => (
  <div data-testid="accordion">Accordion Mock - Sections: {sections.length}</div>
));

// Mock Button component
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick }: any) => (
    <button data-testid="enroll-btn" onClick={onClick}>
      {children}
    </button>
  ),
}));

// Mock formatPrice util
jest.mock("@/lib/utils", () => ({
  formatPrice: (price: number) => `$${price}`,
}));

describe("SelectedCourse Component", () => {
    const mockCourse = {
        courseId: "abc123",
        title: "React Mastery",
        teacherName: "John Doe",
        teacherId: "t1",
        category: "Web Development",
        level: "Beginner",
        status: "active",
        enrollments: [{}, {}], // 2 enrollments
        description: "Master React from zero to hero.",
        price: 199,
        sections: [{ id: 1 }, { id: 2 }],
      } as any;  //  Cast so TS doesn't complain      

  const mockHandleEnrollNow = jest.fn();

  it("renders course details correctly", () => {
    render(<SelectedCourse course={mockCourse} handleEnrollNow={mockHandleEnrollNow} />);

    expect(screen.getByText("React Mastery")).toBeInTheDocument();
    expect(screen.getByText("By John Doe |")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument(); // enrollment count
    expect(screen.getByText("Master React from zero to hero.")).toBeInTheDocument();
    expect(screen.getByTestId("accordion")).toHaveTextContent("Sections: 2");
    expect(screen.getByText("$199")).toBeInTheDocument();
  });

  it("calls handleEnrollNow when clicking enroll button", () => {
    render(<SelectedCourse course={mockCourse} handleEnrollNow={mockHandleEnrollNow} />);

    fireEvent.click(screen.getByTestId("enroll-btn"));

    expect(mockHandleEnrollNow).toHaveBeenCalledWith("abc123");
    expect(mockHandleEnrollNow).toHaveBeenCalledTimes(1);
  });
});
