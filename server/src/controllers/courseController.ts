import {Request, Response } from "express";
import Course from "../models/courseModel";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "@clerk/express";

export const listCourses = async(
    req: Request,
    res: Response
): Promise<void> => {
    const {category} = req.query;
    try{
        const courses = category && category !== "all"
        //scan the Course table and look for category section and find the one equals category variable then run it. 
        ? await Course.scan("category").eq(category).exec()
        //give me all the courses
        : await Course.scan().exec();
        //res will send the data back to the client and the client can see the data, like you can see it in postman.
        res.json({ message: "Courses retrieved successfully", data: courses})
    }catch (error){
        res.status(500).json({message: "Error retreiving courses", error});
    }
};

export const getCourse = async(
    req: Request,
    res: Response
): Promise<void> => {
    const {courseId} = req.params;
    try{
        //will try to find and return that one course.
        const course = await Course.get(courseId);
        if(!course){
            res.status(404).json({message: "Course not found"});
            return;
        }

        res.json({ message: "Courses retrieved successfully", data: course})
    }catch (error){
        res.status(500).json({message: "Error retreiving course", error});
    }
};

export const createCourse = async(
    req: Request,
    res: Response
): Promise<void> => {
    try{
        const {teacherId, teacherName } = req.body;

        if(!teacherId || !teacherName){
            res.status(404).json({message: "Teacher Id and name are required"});
            return;
        }

        const newCourse = new Course({
            courseId: uuidv4(),
            teacherId,
            teacherName,
            titile: "untitled Course",
            description: "",
            category: "Uncategorized",
            image: "",
            price: 0,
            level: "Beginner",
            status: "Draft",
            sections: [],
            enrollments: [],
        });
        await newCourse.save();

        res.json({ message: "Courses retrieved successfully", data: newCourse})
    }catch (error){
        res.status(500).json({message: "Error creating course", error});
    }
};

export const updateCourse = async(
    req: Request,
    res: Response
): Promise<void> => {
    const { courseId } = req.params; // Get course ID from URL
    const updateData = { ...req.body }; // Copy request body into a mutable object
    const { userId } = getAuth(req); // Get the current logged-in user's ID

    try{
        // 1Fetch the course by ID
        const course = await Course.get(courseId);
        // If no course found → return 404
        if(!course){
            res.status(404).json({message: "Course not found"});
            return;
        }
         // Authorisation check: only the teacher can update
       if(course.teacherId !== userId){
        res.status(403).json({message: "Not authorized to update this course"});
        return;
       }
        // Handle price update (if provided)
      if(updateData.price){
        const price = parseInt(updateData.price);
        if(isNaN(price)){
            res.status(400).json({
                message: "Invalid price format",
                error: "Price must be a valid number",
            });
            return;
        }
        // Store price in cents to avoid floating-point issues
        updateData.price = price * 100;
      }

      // Handle sections update (if provided)
      if(updateData.sections){
        // // Parse JSON string to array if needed
        const sectionsData =
        typeof updateData.sections === "string"
        ? JSON.parse(updateData.sections)
        : updateData.sections;

        // Ensure each section and chapter has an ID
        updateData.sections = sectionsData.map((section: any) => ({
            ...section,
            sectionId: section.sectionId || uuidv4(),
            chapters: section.chapters.map((chapter:any) => ({
                ...chapter,
                chapterId: chapter.chapterId || uuidv4(),
            })),
        }));
      }

      // Merge updates into course and save
      Object.assign(course, updateData);
      await course.save();

      res.json({message: "Course updated successfully", data: course });
    }catch (error) {
        res.status(500).json({message: "Error updating course", error});
    }
};

export const deleteCourse = async(
    req: Request,
    res: Response
): Promise<void> => {
    const { courseId } = req.params;
    const { userId } = getAuth(req);

    try{
        const course = await Course.get(courseId);

        if(!course){
            res.status(404).json({message: "Course not found"});
            return;
        }

        if(course.teacherId !== userId){
            res.status(403).json({message: "Not authorized to delete this course"});
            return;
           }

        await Course.delete(courseId);

        res.json({ message: "Courses deleted successfully", data: course})
    }catch (error){
        res.status(500).json({message: "Error deleting course", error});
    }
};