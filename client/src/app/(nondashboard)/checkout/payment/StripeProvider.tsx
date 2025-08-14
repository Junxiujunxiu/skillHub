import React, { useEffect, useState } from "react";
import { Appearance, loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useCreateStripePaymentIntentMutation } from "@/state/api";
import { useCurrentCourse } from "@/hooks/useCurrentCourse";
import Loading from "@/components/Loading";
import { Elements } from "@stripe/react-stripe-js";

/* =========================================================
   Component: StripeProvider
   Purpose:
     - Wraps child components with Stripe's <Elements> context.
     - Creates a Stripe PaymentIntent for the current course.
     - Passes styling options for Stripe Elements.
   Usage:
     - Used to wrap checkout/payment pages to provide Stripe context.
   ========================================================= */

/* ---------- Environment Validation ---------- */
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not set");
}

/* ---------- Stripe Instance ---------- */
// Load Stripe with public key from .env
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

/* ---------- Stripe Appearance Settings ---------- */
// Customises the look and feel of Stripe Elements UI
const appearance: Appearance = {
  theme: "stripe",
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

/* ---------- Provider Component ---------- */
const StripeProvider = ({ children }: { children: React.ReactNode }) => {
  /* ---------- Local State ---------- */
  const [clientSecret, setClientSecret] = useState<string | "">("");

  /* ---------- API Hook ---------- */
  const [createStripePaymentIntent] = useCreateStripePaymentIntentMutation();

  /* ---------- Course Data ---------- */
  const { course } = useCurrentCourse();

  /* ---------- Fetch PaymentIntent ---------- */
  useEffect(() => {
    if (!course) return;

    const fetchPaymentIntent = async () => {
      const result = await createStripePaymentIntent({
        amount: course?.price ?? 9999999999999999, // fallback value
      }).unwrap();

      setClientSecret(result.clientSecret);
    };

    fetchPaymentIntent();
  }, [createStripePaymentIntent, course?.price, course]);

  /* ---------- Stripe Elements Options ---------- */
  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  /* ---------- Loading State ---------- */
  if (!clientSecret) return <Loading />;

  /* ---------- Render with Stripe Context ---------- */
  return (
    <Elements stripe={stripePromise} options={options} key={clientSecret}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
