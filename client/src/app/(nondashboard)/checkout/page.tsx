"use client";

import Loading from "@/components/Loading";
import WizardStepper from "@/components/WizardStepper";
import useCheckoutNavigation from "@/hooks/useCheckoutNavigation";
import { useUser } from "@clerk/nextjs";
import React from "react";
import CheckoutDetailsPage from "./details";
import PaymentPage from "./payment";
import CompletionPage from "./completion";

/* =========================================================
   Component: CheckoutWizard
   Purpose:
     - Controls the multi-step checkout process.
     - Displays different checkout steps (Details → Payment → Completion).
     - Shows a progress stepper at the top.
   Usage:
     - Acts as the main container for the checkout flow.
     - Steps are determined by checkoutStep from the navigation hook.
   ========================================================= */

const CheckoutWizard = () => {
  /* ---------- Clerk Auth ---------- */
  const { isLoaded } = useUser();

  /* ---------- Checkout Step State ---------- */
  const { checkoutStep } = useCheckoutNavigation();

  /* ---------- Loading State ---------- */
  if (!isLoaded) return <Loading />;

  /* ---------- Step Renderer ---------- */
  const renderStep = () => {
    switch (checkoutStep) {
      case 1:
        return <CheckoutDetailsPage />;
      case 2:
        return <PaymentPage />;
      case 3:
        return <CompletionPage />;
      default:
        return "checkout details page";
    }
  };

  /* ---------- Render ---------- */
  return (
    <div className="checkout">
      {/* Stepper Progress Bar */}
      <WizardStepper currentStep={checkoutStep} />

      {/* Step Content */}
      <div className="checkout__content">{renderStep()}</div>
    </div>
  );
};

export default CheckoutWizard;
