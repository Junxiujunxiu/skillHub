import React from 'react'
import StripeProvider from './StripeProvider';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useCheckoutNavigation } from '@/hooks/useCheckoutNavigation';
import { useCurrentCourse } from '@/hooks/useCurrentCourse';
import { useClerk, useUser } from '@clerk/nextjs';
import CoursePreview from '@/components/CoursePreview';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCreateTransactionMutation } from '@/state/api';
import { toast } from 'sonner';

const PaymentPageContent = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [createTransaction] = useCreateTransactionMutation();
  const {navigateToStep} = useCheckoutNavigation();
  const { course, courseId } = useCurrentCourse();
  const { user } = useUser();
  const { signOut } = useClerk();

  //handle submit function.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!stripe || !elements) {
      toast.error("Stripe service is not available");
      return;
    }
    //Confirm the payment with Stripe
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_STRIPE_REDIRECT_URL}?id=${courseId}`,
      },
      redirect: "if_required",
    });
    //if payment was successful,  Build a transaction object to send to the backend
    if (result.paymentIntent?.status === "succeeded"){
      const transactionData: Partial<Transaction> ={
        transactionId: result.paymentIntent.id,
        userId: user?.id,
        courseId: courseId,
        paymentProvider: "stripe",
        amount: course?.price || 0,
      };
      //Send transaction data to backend and go to next step.
      await createTransaction(transactionData), 
      navigateToStep(3);
    }
  };

  //trigger when the user sign out
  const handleSignOutAndNavigate = async () => {
    await signOut();
    navigateToStep(1);
  }

  if(!course) return null;

  return (
    <div className="payment">
      <div className="payment__container">
  
        {/* Order Summary Section */}
        <div className="payment__preview">
          <CoursePreview course={course} />
        </div>

        {/* Payment Form Section */}
        <div className="payment__form-container">
          <form className="payment__form" id="payment-form" onSubmit={handleSubmit}>
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

      {/* Navigation Buttons */}
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
}

const PaymentPage = () =>(
    <StripeProvider>
        <PaymentPageContent />
    </StripeProvider>
)

export default PaymentPage;