import express from "express";
import { createStripePaymemtIntent } from "../controllers/transactionController";

const router = express.Router();

router.post("/stripe/payment-intent", createStripePaymemtIntent);

export default router;