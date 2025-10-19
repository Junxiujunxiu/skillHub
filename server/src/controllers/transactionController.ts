import Stripe from "stripe";
import dotenv from "dotenv";
import { Request, Response } from "express";
import Course from "../models/courseModel";
import Transaction from "../models/transactionModel";
import UserCourseProgress from "../models/userCourseProgressModel";

dotenv.config();

// ===================== Stripe Initialization =====================
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Stripe secret key is not defined in environment variables.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* =========================================================================
   Controller: listTransactions
   ========================================================================= */
export const listTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.query;

  try {
    const transactions = userId
      ? await Transaction.query("userId").eq(userId as string).exec()
      : await Transaction.scan().exec();

    res.json({
      message: "Transactions retrieved successfully",
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving transactions", error });
  }
};

/* =========================================================================
   Controller: createStripePaymentIntent
   ========================================================================= */
export const createStripePaymentIntent = async (
  req: Request,
  res: Response
): Promise<void> => {
  let { amount } = req.body as { amount?: number };

  if (!amount || amount <= 0) {
    amount = 5000; // default $50 in cents
  }

  try {
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
      data: { clientSecret: paymentIntent.client_secret },
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating stripe payment intent", error });
  }
};

/* =========================================================================
   Controller: createTransaction
   ========================================================================= */
export const createTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  // ✅ Fix: ensure body is correctly parsed in AWS Lambda
  try {
    if (Buffer.isBuffer(req.body)) {
      req.body = JSON.parse(req.body.toString());
    } else if (typeof req.body === "string") {
      req.body = JSON.parse(req.body);
    }
  } catch (err) {
    console.log("⚠️ Failed to parse req.body in createTransaction:", err);
    res.status(400).json({ message: "Invalid JSON body", data: {} });
    return; // ✅ required to satisfy Promise<void>
  }

  console.log("🧾 Final parsed body in controller:", req.body);

  const { userId, courseId, transactionId, amount, paymentProvider } =
    req.body as {
      userId?: string;
      courseId?: string;
      transactionId?: string;
      amount?: number;
      paymentProvider?: string;
    };

  // --- Guard: fail fast on bad input
  if (
    !userId ||
    !courseId ||
    !transactionId ||
    typeof amount !== "number" ||
    Number.isNaN(amount)
  ) {
    console.log("❌ Missing or invalid fields:", {
      userId,
      courseId,
      transactionId,
      amount,
      paymentProvider,
    });
    res.status(400).json({
      message: "Missing or invalid fields",
      data: { userId, courseId, transactionId, amount, paymentProvider },
    });
    return;
  }

  try {
    // Step 1: Fetch the course
    let course;
    try {
      course = await Course.get(courseId);
    } catch (e) {
      console.log("❌ Failed to read course:", e);
      res.status(500).json({ message: "Failed to read course", error: e });
      return;
    }
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    // Step 2: Create transaction record
    const newTransaction = new Transaction({
      dateTime: new Date().toISOString(),
      userId,
      courseId,
      transactionId,
      amount,
      paymentProvider,
    });

    try {
      await newTransaction.save();
    } catch (e) {
      console.log("❌ Transaction save failed:", e);
      res.status(500).json({ message: "Transaction save failed", error: e });
      return;
    }

    // Step 3: Create initial user course progress
    const safeSections = Array.isArray(course.sections) ? course.sections : [];
    const initialProgress = new UserCourseProgress({
      userId,
      courseId,
      enrollmentDate: new Date().toISOString(),
      overallProgress: 0,
      sections: safeSections.map((section: any) => ({
        sectionId: section.sectionId,
        chapters: (Array.isArray(section.chapters) ? section.chapters : []).map(
          (chapter: any) => ({
            chapterId: chapter.chapterId,
            completed: false,
          })
        ),
      })),
      lastAccessedTimestamp: new Date().toISOString(),
    });

    try {
      await initialProgress.save();
    } catch (e) {
      console.log("❌ UserCourseProgress save failed:", e);
      res
        .status(500)
        .json({ message: "UserCourseProgress save failed", error: e });
      return;
    }

    // Step 4: Add user to course enrollment list
    try {
      const current = Array.isArray(course.enrollments)
        ? course.enrollments
        : [];
      const already = current.some((e: any) => e && e.userId === userId);
      if (!already) {
        course.enrollments = current.concat([{ userId }]);
        await course.save();
      }
    } catch (e) {
      console.log("❌ Course enrollment update failed:", e);
      res
        .status(500)
        .json({ message: "Course enrollments update failed", error: e });
      return;
    }

    // ✅ Step 5: Success
    console.log("✅ Transaction completed successfully!");
    res.json({
      message: "Purchase course successfully",
      data: {
        transaction: newTransaction,
        courseProgress: initialProgress,
      },
    });
  } catch (error) {
    console.log("❌ Unexpected error in createTransaction:", error);
    res.status(500).json({
      message: "Error creating transaction and enrollment",
      error,
    });
  }
};
