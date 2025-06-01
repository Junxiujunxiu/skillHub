import {Request, Response } from "express";
import Course from "../models/courseModel";

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
    const {courseID} = req.params;
    try{
        //will try to find and return that one course.
        const course = await Course.get(courseID);
        if(!course){
            res.status(404).json({message: "Course not found"});
            return;
        }

        res.json({ message: "Courses retrieved successfully", data: course})
    }catch (error){
        res.status(500).json({message: "Error retreiving course", error});
    }
};