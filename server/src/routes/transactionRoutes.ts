import express from "express";
import { createStripePaymemtIntent, createTransaction, listTransactions } from "../controllers/transactionController";

const router = express.Router();

router.post("/", createTransaction);
router.get("/", listTransactions)
router.post("/stripe/payment-intent", createStripePaymemtIntent);

export default router;