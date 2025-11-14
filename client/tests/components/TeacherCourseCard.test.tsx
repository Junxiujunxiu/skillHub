/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from "@testing-library/react";
import TeacherCourseCard from "../../src/components/TeacherCourseCard";
import { jest } from "@jest/globals";

// ---- Mock next/image ----
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />,
}));

// ---- Mock ShadCN UI components ----
jest.mock("../../src/components/ui/card", () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h2>{children}</h2>,
  CardDescription: ({ children }: any) => <p>{children}</p>,
}));

jest.mock("../../src/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

// ---- Mock icons ----
jest.mock("lucide-react", () => ({
  Pencil: () => <div data-testid="pencil-icon" />,
  Trash2: () => <div data-testid="trash-icon" />,
}));

// ---- Mock cn util ----
jest.mock("../../src/lib/utils", () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

describe("TeacherCourseCard Component", () => {
  const mockCourse = {
    courseId: "c001",
    teacherId: "t001",
    title: "React for Beginners",
    category: "Web Development",
    status: "Published",
    image: "/sample-img.png",
    enrollments: [{ id: 1 }, { id: 2 }],
  } as any;

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  it("renders the course title and category", () => {
    render(
      <TeacherCourseCard
        course={mockCourse}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isOwner={true}
      />
    );

    expect(screen.getByText("React for Beginners")).toBeInTheDocument();
    expect(screen.getByText("Web Development")).toBeInTheDocument();
  });

  it("renders the course image", () => {
    render(
      <TeacherCourseCard
        course={mockCourse}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isOwner={true}
      />
    );

    const img = screen.getByAltText("React for Beginners");
    expect(img).toHaveAttribute("src", "/sample-img.png");
  });

  it("uses fallback image if no image provided", () => {
    const noImageCourse = { ...mockCourse, image: null };

    render(
      <TeacherCourseCard
        course={noImageCourse}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isOwner={true}
      />
    );

    const img = screen.getByAltText("React for Beginners");
    expect(img).toHaveAttribute("src", "/placeholder.png");
  });

  it("displays correct status badge", () => {
    render(
      <TeacherCourseCard
        course={mockCourse}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isOwner={true}
      />
    );

    expect(screen.getByText("Published")).toBeInTheDocument();
  });

  it("shows enrollment count correctly", () => {
    render(
      <TeacherCourseCard
        course={mockCourse}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isOwner={true}
      />
    );

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Students Enrolled")).toBeInTheDocument();
  });

  it("renders Edit and Delete buttons when user is owner", () => {
    render(
      <TeacherCourseCard
        course={mockCourse}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isOwner={true}
      />
    );

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("calls onEdit correctly", () => {
    render(
      <TeacherCourseCard
        course={mockCourse}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isOwner={true}
      />
    );

    fireEvent.click(screen.getByText("Edit"));
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockCourse);
  });

  it("calls onDelete correctly", () => {
    render(
      <TeacherCourseCard
        course={mockCourse}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isOwner={true}
      />
    );

    fireEvent.click(screen.getByText("Delete"));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockCourse);
  });

  it("shows 'View Only' when user is NOT owner", () => {
    render(
      <TeacherCourseCard
        course={mockCourse}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isOwner={false}
      />
    );

    expect(screen.getByText("View Only")).toBeInTheDocument();
  });
});
