import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

// CourseCard component displays information about a single course
const CourseCard = ({ course, onGoToCourse }: CourseCardProps) => {
  return (
    // The entire card is clickable; clicking it triggers onGoToCourse with the course data
    <Card className="course-card group" onClick={() => onGoToCourse(course)}>

      {/* Header section containing the course image */}
      <CardHeader className="course-card__header">
        <Image
          src={course.image || "/placeholder.png"} // Fallback image if course has no image
          alt={course.title}
          width={400}
          height={350}
          className="course-card__image"
          priority
        />
      </CardHeader>

      {/* Main content section */}
      <CardContent className="course-card__content">

        {/* Course title and description */}
        <CardTitle className="course-card__title">
          {course.title}: {course.description}
        </CardTitle>

        {/* Teacher avatar and name */}
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage alt={course.teacherName} />
            <AvatarFallback className="bg-secondary-700 text-black">
              {course.teacherName[0]} {/* Display the first letter of the teacher's name */}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm text-customgreys-dirtyGrey">
            {course.teacherName}
          </p>
        </div>

        {/* Footer section with category and price */}
        <CardFooter className="course-card__footer">
          <div className="course-card__category">{course.category}</div>
          <span className="course-card__price">
            {formatPrice(course.price)}
          </span>
        </CardFooter>

      </CardContent>
    </Card>
  );
};

export default CourseCard;
