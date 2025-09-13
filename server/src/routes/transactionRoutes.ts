import express from "express";
import {
  createStripePaymentIntent,
  createTransaction,
  listTransactions,
} from "../controllers/transactionController";

/* =========================================================================
   Router: Transaction Routes
   Purpose:
     - Defines API endpoints for handling course purchase transactions
       and payment processing through Stripe.
   ========================================================================= */
const router = express.Router();

/* =========================================================================
   Route: POST /
   Description:
     - Create a new transaction record after a successful course purchase.
     - Saves transaction details to the database.
     - Also enrolls the user in the course and creates initial progress tracking.
   Access: Public (should typically be called from a secure backend flow)
   Controller: createTransaction
   Example: POST /transactions
   ========================================================================= */
router.post("/", createTransaction);

/* =========================================================================
   Route: GET /
   Description:
     - Retrieve all transactions or filter by userId via query parameter (?userId=...).
   Access: Public (can be restricted via authentication if needed)
   Controller: listTransactions
   Example: GET /transactions
   ========================================================================= */
router.get("/", listTransactions);

/* =========================================================================
   Route: POST /stripe/payment-intent
   Description:
     - Create a Stripe PaymentIntent for processing a payment.
     - Returns a client secret that the frontend uses to complete the payment.
   Access: Public (should be called from backend after validating purchase request)
   Controller: createStripePaymemtIntent
   Example: POST /transactions/stripe/payment-intent
   ========================================================================= */
router.post("/stripe/payment-intent", createStripePaymentIntent);

/* =========================================================================
   Export:
     - Exports the configured router for use in the main app.
   ========================================================================= */
export default router;
