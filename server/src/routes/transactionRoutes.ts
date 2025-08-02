import express from "express";
import { createStripePaymemtIntent, createTransaction } from "../controllers/transactionController";

const router = express.Router();

router.post("/", createTransaction);
router.post("/stripe/payment-intent", createStripePaymemtIntent);

export default router;