import React from 'react'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

// CourseCardSearch displays a compact clickable card for course search results
const CourseCardSearch = ({ course, isSelected, onClick }: SearchCourseCardProps) => {
  return (
    // Card wrapper — applies different styles depending on selection state
    <div
      onClick={onClick}
      className={`course-card-search group ${
        isSelected ? "course-card-search--selected" : "course-card-search-unselected"
      }`}
    >
      {/* Image container with responsive course image */}
      <div className="course-card-search__image-container">
        <Image
          src={course.image || "/placeholder.png"} // Fallback image if none provided
          alt={course.title}
          fill
          sizes="(max-width: 760px) 100vw, (max-width:1200) 50vw, 33vw"
          className="course-card-search__image"
        />
      </div>

      {/* Course information */}
      <div className="course-card-search__content">
        {/* Title and description */}
        <div>
          <h2 className="course-card-search__title">{course.title}</h2>
          <p className="course-card-search__description">{course.description}</p>
        </div>

        {/* Teacher name, price, and enrollment info */}
        <div className="mt-2">
          <p className="course-card-search__teacher">by {course.teacherName}</p>

          <div className="course-card-search__footer">
            <span className="course-card-search__price">
              {formatPrice(course.price)}
            </span>
            <span className="course-card-search__enrollment">
              {course.enrollments?.length} Enrolled
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseCardSearch
