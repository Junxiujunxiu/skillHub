import Stripe from "stripe";
import dotenv from "dotenv";
import { Request, Response } from "express";
import Course from "../models/courseModel";
import Transaction from "../models/transactionModel";
import UserCourseProgress from "../models/userCourseProgressModel";

dotenv.config(); 

if(!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is not defined in environment variables.");
}
//this is a controller that defines what happens when a user accesses the payment endpoint like get/create-payment

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// It is used to handle payments in the application
export const createStripePaymemtIntent = async(
    req: Request,
    res: Response
): Promise<void> => {
    let {amount} = req.body;

    // Default amount to 50 if not provided or invalid
    if(!amount || amount <= 0) {
        amount = 50;
    }

    //Returns a PaymentIntent object which includes the client_secret.
    try{
        const paymentIntent = await stripe.paymentIntents.create({
            amount, 
            currency: "usd", 
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never"
            },
        });

        res.json({ message: "", data: {
            // This is the client secret that you will use in the frontend to confirm the payment
            clientSecret: paymentIntent.client_secret,
        }})
    }catch (error){
        res.status(500).json({message: "Error creating stripe payment intent", error});
    }
};

export const createTransaction = async(
    req: Request,
    res: Response
): Promise<void> => {
    const { userId, courseId, transactionId, amount, paymentProvider } = req.body;

    try{
        //1. get course info
        const course = await Course.get(courseId);

        //2. create transaction record with the data from the frontend.
        const newTransaction = new Transaction({
            dateTime: new Date().toISOString(),
            userId,
            courseId,
            transactionId,
            amount,
            paymentProvider
        })
        await newTransaction.save();

        //3.create initial course progress
        const initialProgress = new UserCourseProgress({
            userId,
            courseId,
            enrollmentDate: new Date().toISOString(),
            overallProgress: 0,
            sections: course.sections.map((section: any) =>({
                sectionId: section.sectionId,
                chapters: section.chapters.map((chapter: any) =>({
                    chapterId: chapter.chapterId,
                    completed: false,
                })),
            })),
            lastAccessedTimestamp: new Date().toISOString(),
        });
        await initialProgress.save();
        //4.Add the user to the course’s enrollment list
        //This updates the course so the backend knows this user is now enrolled.
        await Course.update(
            { courseId },
            {
                $ADD: {
                    enrollments: [{ userId }],
                },
            }
        );
        //Sends back transaction and progress data
        res.json({ 
            message: "Purchase Course successfully", 
            data: {
                transaction: newTransaction,
                courseProgress: initialProgress,
        }});
    }catch (error){
        res.status(500).json({message: "Error creating transaction and enrollment", error});
    }
};