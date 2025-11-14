/**
 * @jest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import CoursePreview from "../../src/components/CoursePreview";
import { jest } from "@jest/globals";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />,
}));

jest.mock("../../src/lib/utils", () => ({
  formatPrice: (price: number) => `$${price}`,
}));

jest.mock("../../src/components/AccordionSections", () => ({
  __esModule: true,
  default: ({ sections }: any) => (
    <div data-testid="accordion-mock">Accordion Mock - {sections.length} sections</div>
  ),
}));

const mockCourse = {
    courseId: "1",
    teacherId: "t1",
    level: "Beginner",   
    status: "published",
    sections: [{}, {}],
    title: "Next.js Masterclass",
    description: "Deep dive into Next.js.",
    image: "/course-img.png",
    teacherName: "Junxiu",
    category: "Web",
    price: 100,
  } as any;
  

describe("CoursePreview Component", () => {
  it("renders course title, teacher name, and description", () => {
    render(<CoursePreview course={mockCourse} />);

    expect(screen.getByText("Next.js Masterclass")).toBeInTheDocument();
    expect(screen.getByText("by Junxiu")).toBeInTheDocument();
    expect(screen.getByText("Deep dive into Next.js.")).toBeInTheDocument();
  });

  it("renders course image", () => {
    render(<CoursePreview course={mockCourse} />);

    const img = screen.getByAltText("Course Preview");
    expect(img).toHaveAttribute("src", "/course-img.png");
  });

  it("uses fallback image when image is missing", () => {
    const noImgCourse = { ...mockCourse, image: null };

    render(<CoursePreview course={noImgCourse} />);

    const img = screen.getByAltText("Course Preview");
    expect(img).toHaveAttribute("src", "/placeholder-image.png");
  });

  it("renders AccordionSections with correct count", () => {
    render(<CoursePreview course={mockCourse} />);

    expect(screen.getByTestId("accordion-mock")).toHaveTextContent("2 sections");
  });

  // ⭐ FIXED TEST BELOW — no more getByText() error
  it("displays formatted price correctly", () => {
    render(<CoursePreview course={mockCourse} />);

    const prices = screen.getAllByText("$100");
    expect(prices.length).toBe(2);
  });

  it("renders price details correctly", () => {
    render(<CoursePreview course={mockCourse} />);

    expect(screen.getByText("1x Next.js Masterclass")).toBeInTheDocument();
    expect(screen.getByText("Total Amount")).toBeInTheDocument();
  });
});
