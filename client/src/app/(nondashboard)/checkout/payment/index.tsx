import React from 'react'
import StripeProvider from './StripeProvider';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useCheckoutNavigation } from '@/hooks/useCheckoutNavigation';
import { useCurrentCourse } from '@/hooks/useCurrentCourse';
import { useClerk, useUser } from '@clerk/nextjs';
import CoursePreview from '@/components/CoursePreview';
import { CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PaymentPageContent = () => {
  const stripe = useStripe();
  const elements = useElements();
  //const [createTransaction] = useCreateTransactionMutation();
  const {navigateToStep} = useCheckoutNavigation();
  const { course, courseId } = useCurrentCourse();
  const { user } = useUser();
  const { signOut } = useClerk();

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
          <form className="payment__form" id="payment-form">
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
          //onClick={handleSignOutandNavigate}
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