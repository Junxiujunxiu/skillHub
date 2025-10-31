import { render, screen, fireEvent } from "@testing-library/react";
import Search from "@/app/(nondashboard)/search/page";

//  Mock RTK Query hook
jest.mock("@/state/api", () => ({
  useGetCoursesQuery: jest.fn(),
}));

//  Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

//  Mock child components
jest.mock("@/components/CourseCardSearch", () => ({ course, onClick }: any) => (
  <div data-testid={`course-card-${course.courseId}`} onClick={onClick}>
    {course.name}
  </div>
));

jest.mock("@/app/(nondashboard)/search/SelectedCourse", () => ({ course }: any) => (
    <div data-testid="selected-course">Selected: {course.name}</div>
  ));  

jest.mock("@/components/Loading", () => () => <div data-testid="loading">Loading...</div>);

// 👇 Import mock after mocks are defined
import { useGetCoursesQuery } from "@/state/api";

describe("Search Page", () => {
  const mockCourses = [
    { courseId: "1", name: "Course One" },
    { courseId: "2", name: "Course Two" },
  ];

  it("shows loading state", () => {
    (useGetCoursesQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });

    render(<Search />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("shows error when API fails", () => {
    (useGetCoursesQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });

    render(<Search />);
    expect(screen.getByText("Failed to fetch courses")).toBeInTheDocument();
  });

  it("renders course list and allows selecting a course", () => {
    (useGetCoursesQuery as jest.Mock).mockReturnValue({
      data: mockCourses,
      isLoading: false,
      isError: false,
    });

    render(<Search />);

    // Renders courses
    expect(screen.getByTestId("course-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("course-card-2")).toBeInTheDocument();

    // Click a course
    fireEvent.click(screen.getByTestId("course-card-2"));

    // SelectedCourse component should render
    expect(screen.getByTestId("selected-course")).toHaveTextContent("Course Two");
  });
});
