import Stripe from "stripe";
import dotenv from "dotenv";
import { Request, Response } from "express";

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

    try{
        const paymentIntent = await stripe.paymentIntents.create({
            amount, 
            currency: "usd", // Australian Dollar
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