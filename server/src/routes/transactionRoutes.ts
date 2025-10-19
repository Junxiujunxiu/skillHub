import express from "express";
import {
  createStripePaymentIntent,
  createTransaction,
  listTransactions,
} from "../controllers/transactionController";
import { requireAuth } from "@clerk/express"; 

const router = express.Router();

/* =========================================================================
   Route: POST /stripe/payment-intent
   Description:
     - Create a Stripe PaymentIntent for processing a payment.
     - Returns a client secret used by frontend to complete payment.
   Access: Public (no Clerk token required)
   ========================================================================= */
router.post("/stripe/payment-intent", createStripePaymentIntent);

/* =========================================================================
   Middleware: Clerk Authentication
   Description:
     - Everything below this line requires a valid Clerk session.
     - Protects sensitive routes like creating and listing transactions.
   ========================================================================= */
router.use(requireAuth()); // 👈 apply auth AFTER payment-intent route

/* =========================================================================
   Route: POST /
   Description:
     - Create a new transaction record after a successful course purchase.
     - Saves transaction details and enrolls the user in the course.
   ========================================================================= */
router.post("/", createTransaction);

/* =========================================================================
   Route: GET /
   Description:
     - Retrieve all transactions or filter by userId (?userId=...).
   ========================================================================= */
router.get("/", listTransactions);

/* =========================================================================
   Export Router
   ========================================================================= */
export default router;
