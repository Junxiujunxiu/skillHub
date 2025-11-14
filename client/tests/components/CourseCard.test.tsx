/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from "@testing-library/react";
import CourseCard from "../../src/components/CourseCard";
import { jest } from "@jest/globals";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />,
}));

// Mock UI components
jest.mock("../../src/components/ui/card", () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h2>{children}</h2>,
  CardFooter: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("../../src/components/ui/avatar", () => ({
  Avatar: ({ children }: any) => <div>{children}</div>,
  AvatarImage: () => <img alt="avatar" />,
  AvatarFallback: ({ children }: any) => <span>{children}</span>,
}));

jest.mock("../../src/lib/utils", () => ({
  formatPrice: (price: number) => `$${price}`,
}));

describe("CourseCard Component", () => {
  const mockCourse = {
    courseId: "123",
    teacherId: "t001",
    level: "beginner",
    status: "published",
    sections: [],
    title: "React Mastery",
    description: "Learn React from scratch",
    image: "/test-image.png",
    teacherName: "Junxiu",
    category: "Web Development",
    price: 49,
  } as any; // Cast to any to ignore irrelevant fields

  const mockOnGoToCourse = jest.fn();

  it("renders course title and description", () => {
    render(<CourseCard course={mockCourse} onGoToCourse={mockOnGoToCourse} />);
    expect(
      screen.getByText("React Mastery: Learn React from scratch")
    ).toBeInTheDocument();
  });

  it("renders the course image", () => {
    render(<CourseCard course={mockCourse} onGoToCourse={mockOnGoToCourse} />);
    const img = screen.getByAltText("React Mastery");
    expect(img).toHaveAttribute("src", "/test-image.png");
  });

  it("renders teacher avatar fallback properly", () => {
    render(<CourseCard course={mockCourse} onGoToCourse={mockOnGoToCourse} />);
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("renders category and price", () => {
    render(<CourseCard course={mockCourse} onGoToCourse={mockOnGoToCourse} />);
    expect(screen.getByText("Web Development")).toBeInTheDocument();
    expect(screen.getByText("$49")).toBeInTheDocument();
  });

  it("calls onGoToCourse when the card is clicked", () => {
    render(<CourseCard course={mockCourse} onGoToCourse={mockOnGoToCourse} />);
    const title = screen.getByText("React Mastery: Learn React from scratch");
    fireEvent.click(title.parentElement!);
    expect(mockOnGoToCourse).toHaveBeenCalledWith(mockCourse);
  });

  it("uses fallback image if no image is provided", () => {
    const noImgCourse = { ...mockCourse, image: null };
    render(<CourseCard course={noImgCourse} onGoToCourse={mockOnGoToCourse} />);
    const img = screen.getByAltText("React Mastery");
    expect(img).toHaveAttribute("src", "/placeholder.png");
  });
});
