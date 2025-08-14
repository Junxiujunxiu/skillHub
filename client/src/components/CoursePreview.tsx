import { formatPrice } from '@/lib/utils'
import React from 'react'
import Image from 'next/image'
import AccordionSections from './AccordionSections'

// CoursePreview displays detailed information about a selected course,
// including its image, title, description, content breakdown, and price details.
const CoursePreview = ({ course }: CoursePreviewProps) => {
  // Format course price for display
  const price = formatPrice(course.price)

  return (
    <div className="course-preview">
      {/* Left section: Course details */}
      <div className="course-preview__container">
        {/* Course image */}
        <div className="course-preview__image-wrapper">
          <Image
            src={course.image || "/placeholder-image.png"} // Fallback image if none provided
            alt="Course Preview"
            width={640}
            height={360}
            className="w-full"
          />
        </div>

        {/* Course title, teacher, and description */}
        <div>
          <h2 className="course-preview__title">{course.title}</h2>
          <p className="text-gray-400 text-md mb-4">by {course.teacherName}</p>
          <p className="text-sm text-customgreys-dirtyGrey">
            {course.description}
          </p>
        </div>

        {/* Course content accordion */}
        <div>
          <h4 className="text-white-50/90 font-semibold mb-2">
            Course Content
          </h4>
          <AccordionSections sections={course.sections} />
        </div>
      </div>

      {/* Right section: Price summary */}
      <div className="course-preview__container">
        <h3 className="text-xl mb-4">Price Details (1 item)</h3>
        <div className="flex justify-between mb-4 text-customgreys-dirtyGrey text-base">
          <span className="font-bold">1x {course.title}</span>
          <span className="font-bold">{price}</span>
        </div>
        <div className="flex justify-between border-t border-customgreys-dirtyGrey pt4">
          <span className="font-bold text-lg">Total Amount</span>
          <span className="font-bold text-lg">{price}</span>
        </div>
      </div>
    </div>
  )
}

export default CoursePreview
