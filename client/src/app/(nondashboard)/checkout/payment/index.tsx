import React from "react";
import StripeProvider from "./StripeProvider";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useCheckoutNavigation } from "@/hooks/useCheckoutNavigation";
import { useCurrentCourse } from "@/hooks/useCurrentCourse";
import { useClerk, useUser } from "@clerk/nextjs";
import CoursePreview from "@/components/CoursePreview";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateTransactionMutation } from "@/state/api";
import { toast } from "sonner";

/* =========================================================
   Page: PaymentPage
   Purpose:
     - Handles Stripe payment processing for the selected course.
     - Displays course preview and payment form.
     - Submits transaction details to the backend upon success.
   Layout:
     - Left column: Course preview.
     - Right column: Payment form.
     - Footer: Navigation actions (Switch Account / Pay).
   Features:
     - Uses Stripe Elements for secure payment input.
     - Confirms payment and stores transaction in backend.
     - Allows switching accounts mid-checkout.
   ========================================================= */

const PaymentPageContent = () => {
  /* ---------- Stripe Hooks ---------- */
  const stripe = useStripe();
  const elements = useElements();

  /* ---------- API Hooks ---------- */
  const [createTransaction] = useCreateTransactionMutation();

  /* ---------- Navigation ---------- */
  const { navigateToStep } = useCheckoutNavigation();

  /* ---------- Course & User Data ---------- */
  const { course, courseId } = useCurrentCourse();
  const { user } = useUser();
  const { signOut } = useClerk();

  /* ---------- Handle Payment Submission ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe service is not available");
      return;
    }

    //url to redirect after payment
    const baseUrl = process.env.NEXT_PUBLIC_LOCAL_URL
    ? `http://${process.env.NEXT_PUBLIC_LOCAL_URL}`
    : process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : undefined;

    // Confirm payment with Stripe
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${baseUrl}/checkout?step=3&id=${courseId}`,
      },
      redirect: "if_required",
    });

    // 👉 Log/handle Stripe confirm errors explicitly
    if (result.error) {
      console.error("Stripe confirm error:", {
        type: result.error.type,
        message: result.error.message,
        code: (result.error as any).code,
        piStatus: (result.error as any).payment_intent?.status,
      });
      toast.error(result.error.message || "Payment failed");
      return;
    }

    // If payment succeeded, send transaction to backend
    if (result.paymentIntent?.status === "succeeded") {
      const transactionData: Partial<Transaction> = {
        transactionId: result.paymentIntent.id,
        userId: user?.id,
        courseId: courseId,
        paymentProvider: "stripe",
        amount: course?.price || 0,
      };

      
      //  ADD THIS LINE
    console.log("createTransaction payload →", JSON.stringify(transactionData, null, 2));

      await createTransaction(transactionData);
      navigateToStep(3);
    }
  };

  /* ---------- Handle Account Switch ---------- */
  const handleSignOutAndNavigate = async () => {
    await signOut();
    navigateToStep(1);
  };

  /* ---------- Guard Clause ---------- */
  if (!course) return null;

  /* ---------- Render ---------- */
  return (
    <div className="payment">
      <div className="payment__container">
        
        {/* ---------- Order Summary Section ---------- */}
        <div className="payment__preview">
          <CoursePreview course={course} />
        </div>

        {/* ---------- Payment Form Section ---------- */}
        <div className="payment__form-container">
          <form
            className="payment__form"
            id="payment-form"
            onSubmit={handleSubmit}
          >
            <div className="payment__content">
              <h1 className="payment__title">Checkout</h1>
              <p className="payment__subtitle">
                Fill out the payment details below to complete your purchase
              </p>

              {/* Payment Method */}
              <div className="payment__method">
                <div className="payment__card-header">
                  <CreditCard size={24} />
                  <span>Credit/Debit Card</span>
                </div>
                <div className="payment__card-element">
                  <PaymentElement />
                </div>
              </div>
            </div>
          </form>
        </div>

      </div>

      {/* ---------- Navigation Buttons ---------- */}
      <div className="payment__actions">
        <Button
          className="hover:bg-white-50/10"
          onClick={handleSignOutAndNavigate}
          variant="outline"
          type="button"
        >
          Switch Account
        </Button>

        <Button
          form="payment-form"
          type="submit"
          className="payment__submit"
          disabled={!stripe || !elements}
        >
          Pay with Credit Card
        </Button>
      </div>
    </div>
  );
};

/* ---------- Page Wrapper with StripeProvider ---------- */
const PaymentPage = () => (
  <StripeProvider>
    <PaymentPageContent />
  </StripeProvider>
);

export default PaymentPage;
