/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from "@testing-library/react";
import CourseCardSearch from "../../src/components/CourseCardSearch";
import { jest } from "@jest/globals";

// Mock next/image for Jest
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />,
}));

// Mock formatPrice
jest.mock("../../src/lib/utils", () => ({
  formatPrice: (price: number) => `$${price}`,
}));

describe("CourseCardSearch Component", () => {
  const mockCourse = {
    courseId: "123",
    teacherId: "t001",
    level: "beginner",
    status: "published",
    sections: [],
    title: "Next.js Course",
    description: "Learn Next.js step by step",
    image: "/test-image.png",
    teacherName: "Junxiu",
    category: "Web Development",
    price: 79,
    enrollments: [{ id: 1 }, { id: 2 }, { id: 3 }],
  } as any;

  const mockOnClick = jest.fn();

  it("renders course title and description", () => {
    render(
      <CourseCardSearch
        course={mockCourse}
        isSelected={false}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText("Next.js Course")).toBeInTheDocument();
    expect(
      screen.getByText("Learn Next.js step by step")
    ).toBeInTheDocument();
  });

  it("renders teacher name and price", () => {
    render(
      <CourseCardSearch
        course={mockCourse}
        isSelected={false}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText("by Junxiu")).toBeInTheDocument();
    expect(screen.getByText("$79")).toBeInTheDocument();
  });

  it("renders enrollment count", () => {
    render(
      <CourseCardSearch
        course={mockCourse}
        isSelected={false}
        onClick={mockOnClick}
      />
    );

    expect(screen.getByText("3 Enrolled")).toBeInTheDocument();
  });

  it("renders the course image", () => {
    render(
      <CourseCardSearch
        course={mockCourse}
        isSelected={false}
        onClick={mockOnClick}
      />
    );

    const img = screen.getByAltText("Next.js Course");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/test-image.png");
  });

  it("uses fallback image when no image exists", () => {
    const noImageCourse = { ...mockCourse, image: null };

    render(
      <CourseCardSearch
        course={noImageCourse}
        isSelected={false}
        onClick={mockOnClick}
      />
    );

    const img = screen.getByAltText("Next.js Course");
    expect(img).toHaveAttribute("src", "/placeholder.png");
  });

  it("applies selected class when isSelected = true", () => {
    const { container } = render(
      <CourseCardSearch
        course={mockCourse}
        isSelected={true}
        onClick={mockOnClick}
      />
    );
  
    const card = container.firstChild as HTMLElement;
    expect(card.classList.contains("course-card-search--selected")).toBe(true);
  });
  
  it("applies unselected class when isSelected = false", () => {
    const { container } = render(
      <CourseCardSearch
        course={mockCourse}
        isSelected={false}
        onClick={mockOnClick}
      />
    );
  
    const card = container.firstChild as HTMLElement;
    expect(card.classList.contains("course-card-search-unselected")).toBe(true);
  });
  
});
