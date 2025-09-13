import Stripe from "stripe";
import dotenv from "dotenv";
import { Request, Response } from "express";
import Course from "../models/courseModel";
import Transaction from "../models/transactionModel";
import UserCourseProgress from "../models/userCourseProgressModel";

dotenv.config();

// ===================== Stripe Initialization =====================
// Check for Stripe secret key in environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    "Stripe secret key is not defined in environment variables."
  );
}

// Create a new Stripe client using the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* =========================================================================
   Controller: listTransactions
   Purpose:
     - Retrieve all transactions OR transactions for a specific user.
   Flow:
     1. Check if a userId query parameter is provided.
     2. If userId exists → query transactions for that user.
     3. If no userId → retrieve all transactions.
     4. Return the transactions in JSON format.
   ========================================================================= */
export const listTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.query;

  try {
    // Retrieve transactions either by userId or all
    const transactions = userId
      ? await Transaction.query("userId").eq(userId).exec()
      : await Transaction.scan().exec();

    res.json({
      message: "Transactions retrieved successfully",
      data: transactions,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving transactions", error });
  }
};

/* =========================================================================
   Controller: createStripePaymentIntent
   Purpose:
     - Create a PaymentIntent in Stripe for a specific amount.
     - Returns the client secret to the frontend to complete the payment.
   Flow:
     1. Extract the amount from the request body.
     2. Default to $50 if not provided or invalid.
     3. Create a PaymentIntent with USD currency.
     4. Enable automatic payment methods (no redirects allowed).
     5. Return the client secret in the response.
   ========================================================================= */
   export const createStripePaymentIntent = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      // We expect cents (smallest unit) from the client
      const amountInCents = Number(req.body.amount); // e.g., 2400 = $24.00
      if (!Number.isInteger(amountInCents) || amountInCents <= 0) {
        res.status(400).json({ message: "Invalid amount (must be integer cents > 0)" });
        return;
      }
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "usd", // or "nzd" if you switch later
        automatic_payment_methods: { enabled: true }, // <-- no "never"
        // If you want to avoid Link while testing, use:
        // payment_method_types: ["card"],
      });
  
      res.json({
        message: "PaymentIntent created successfully",
        data: { clientSecret: paymentIntent.client_secret },
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating stripe payment intent", error });
    }
  };
  

/* =========================================================================
   Controller: createTransaction
   Purpose:
     - Record a successful purchase transaction in the database.
     - Enroll the user in the purchased course.
     - Create an initial progress record for the user in that course.
   Flow:
     1. Extract purchase details from request body.
     2. Retrieve the course details from DB.
     3. Create a new Transaction record with purchase details.
     4. Create an initial UserCourseProgress record with all chapters uncompleted.
     5. Add the user to the course's enrollment list.
     6. Return both the transaction and course progress to the client.
   ========================================================================= */
   export const createTransaction = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { userId, courseId, transactionId, amount, paymentProvider } = req.body;
  
      // 1) Validate input
      if (!userId || !courseId || !transactionId) {
        res.status(400).json({ message: "Missing required fields (userId, courseId, transactionId)" });
        return;
      }
  
      // 2) Load course
      const course = await Course.get(courseId);
      if (!course) {
        res.status(404).json({ message: "Course not found" });
        return;
      }
  
      // 3) Create transaction (store cents consistently)
      const newTransaction = new Transaction({
        dateTime: new Date().toISOString(),
        userId,
        courseId,
        transactionId,
        amount, // keep cents throughout your system
        paymentProvider: paymentProvider ?? "stripe",
      });
      await newTransaction.save();
  
      // 4) Create initial progress safely
      const sections = Array.isArray(course.sections) ? course.sections : [];
      const initialProgress = new UserCourseProgress({
        userId,
        courseId,
        enrollmentDate: new Date().toISOString(),
        overallProgress: 0,
        sections: sections.map((section: any) => ({
          sectionId: section.sectionId,
          chapters: (Array.isArray(section.chapters) ? section.chapters : []).map((chapter: any) => ({
            chapterId: chapter.chapterId,
            completed: false,
          })),
        })),
        lastAccessedTimestamp: new Date().toISOString(),
      });
      await initialProgress.save();
  
      // 5) Append enrollment to list (no $ADD for lists)
      if (!Array.isArray(course.enrollments)) course.enrollments = [];
      if (!course.enrollments.find((e: any) => e.userId === userId)) {
        course.enrollments.push({ userId });
        await course.save();
      }
  
      // 6) Respond
      res.json({
        message: "Purchase course successfully",
        data: {
          transaction: newTransaction,
          courseProgress: initialProgress,
        },
      });
    } catch (error) {
      console.error("createTransaction error:", error);
      res.status(500).json({
        message: "Error creating transaction and enrollment",
        error,
      });
    }
  };
  
