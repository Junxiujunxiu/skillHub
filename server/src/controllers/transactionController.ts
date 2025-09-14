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
  let { amount } = req.body;

  // Default amount to 50 if not provided or invalid
  if (!amount || amount <= 0) {
    amount = 50;
  }

  try {
    // Create a PaymentIntent object in Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    });

    res.json({
      message: "PaymentIntent created successfully",
      data: {
        // This is used in frontend to confirm the payment
        clientSecret: paymentIntent.client_secret,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating stripe payment intent", error });
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
  const { userId, courseId, transactionId, amount, paymentProvider } =
    req.body;

    console.log("👉 Incoming request body:", req.body);

  try {
    // Step 1: Get course details
    const course = await Course.get(courseId);

    // Step 2: Create a new transaction record
    const newTransaction = new Transaction({
      dateTime: new Date().toISOString(),
      userId,
      courseId,
      transactionId,
      amount,
      paymentProvider,
    });
    await newTransaction.save();

    // Step 3: Create initial course progress (all chapters set to incomplete)
    const initialProgress = new UserCourseProgress({
      userId,
      courseId,
      enrollmentDate: new Date().toISOString(),
      overallProgress: 0,
      sections: course.sections.map((section: any) => ({
        sectionId: section.sectionId,
        chapters: section.chapters.map((chapter: any) => ({
          chapterId: chapter.chapterId,
          completed: false,
        })),
      })),
      lastAccessedTimestamp: new Date().toISOString(),
    });
    await initialProgress.save();

    // Step 4: Add user to the course’s enrollment list
    await Course.update(
      { courseId },
      {
        $ADD: {
          enrollments: [{ userId }],
        },
      }
    );

    // Step 5: Respond with transaction & progress data
    res.json({
      message: "Purchase course successfully",
      data: {
        transaction: newTransaction,
        courseProgress: initialProgress,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating transaction and enrollment",
      error,
    });
  }
};
