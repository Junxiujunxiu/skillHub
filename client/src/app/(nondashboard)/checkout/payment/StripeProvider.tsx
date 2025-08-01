import React, { useEffect, useState } from 'react'
import{ Appearance, loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useCreateStripePaymentIntentMutation } from '@/state/api';
import { useCurrentCourse } from '@/hooks/useCurrentCourse';
import Loading from '@/components/Loading';
import { Elements } from "@stripe/react-stripe-js";

if(!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY){
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not set");
}

// Load Stripe with the public key from your .env file
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

// Customise the appearance of Stripe Elements (card input UI)
const appearance: Appearance = {
    theme:"stripe",
    variables: {
        colorPrimary: "#0570de",
        colorBackground: "#18181b",
        colorText: "#d2d2d2",
        colorDanger: "#df1b41",
        colorTextPlaceholder: "#6e6e6e",
        fontFamily: "Inter, system-ui, sans-serif",
        spacingUnit: "3px",
        borderRadius: "10px",
        fontSizeBase: "14px",
    },
};

//// StripeProvider wraps any child component and provides Stripe context
const StripeProvider = ({children} : {children: React.ReactNode}) => {
  const [clientSecret, setClientSecret] = useState<string | "">("");
  const [createStripePaymentIntent] = useCreateStripePaymentIntentMutation();
  const { course } = useCurrentCourse();

  // Fetch Stripe clientSecret when course data is available
  useEffect(() => {
    if (!course) return;
    const fetchPaymentIntent = async () =>{
    const result = await createStripePaymentIntent({
      amount: course?.price ?? 9999999999999999,
    }).unwrap();
    
    setClientSecret(result.clientSecret);
  };

  fetchPaymentIntent();
}, [createStripePaymentIntent, course?.price, course]);

// This object passes the payment info (clientSecret) and style (appearance) to Stripe <Elements>
const options: StripeElementsOptions = {
  clientSecret,
  appearance,
}

if (!clientSecret) return <Loading />;

// Wrap the children so they can use Stripe features like useStripe() and CardElement()
  return (
    <Elements stripe={stripePromise} options={options} key={clientSecret}>
      {children}
    </Elements>
  )
}

export default StripeProvider