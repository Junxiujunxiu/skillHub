"use client";

/* =========================================================
   Page: CheckoutDetailsPage
   Purpose:
     - Displays course preview and checkout options.
     - Allows guest checkout via email or account-based checkout
       via Sign In / Sign Up.
   Layout:
     - Left column: Course preview.
     - Right column: Guest checkout form + Auth components.
   Features:
     - Uses react-hook-form + zod for guest email validation.
     - Toggle between Sign In and Sign Up based on URL param.
     - Includes loading/error states for course data.
   ========================================================= */

import CoursePreview from "@/components/CoursePreview";
import { CustomFormField } from "@/components/CustomFormField";
import Loading from "@/components/Loading";
import { useCurrentCourse } from "@/hooks/useCurrentCourse";
import { GuestFormData, guestSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import SignInComponent from "@/components/Signin";
import SignUpComponent from "@/components/SignUp";

const CheckoutDetailsPage = () => {
  /* ---------- Data Fetching ---------- */
  const { course: selectedCourse, isLoading, isError } = useCurrentCourse();

  /* ---------- URL Params ---------- */
  const searchParams = useSearchParams();
  const showSignUp = searchParams.get("showSignUp") === "true";

  /* ---------- Form Setup (Guest Checkout) ---------- */
  const methods = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      email: "",
    },
  });

  /* ---------- Loading / Error States ---------- */
  if (isLoading) return <Loading />;
  if (isError) return <div>Failed to fetch course data</div>;
  if (!selectedCourse) return <div>No course found</div>;

  /* ---------- Render ---------- */
  return (
    <div className="checkout-details">
      <div className="checkout-details__container">
        
        {/* ---------- Course Preview Section ---------- */}
        <div className="checkout-details__preview">
          <CoursePreview course={selectedCourse} />
        </div>

        {/* ---------- Checkout Options Section ---------- */}
        <div className="checkout-details__options">
          
          {/* Guest Checkout */}
          <div className="checkout-details__guest">
            <h2 className="checkout-details__title">Guest Checkout</h2>
            <p className="checkout-details__subtitle">
              Enter your email to receive course access details and order
              confirmation. You can create an account after purchase.
            </p>

            <Form {...methods}>
              <form
                className="checkout-details__form"
                onSubmit={methods.handleSubmit((data) => {
                  console.log("Guest Checkout Data:", data);
                })}
              >
                <CustomFormField
                  name="email"
                  label="Email Address"
                  type="email"
                  className="w-full rounded mt-4"
                  labelClassName="font-normal text-white-50"
                  inputClassName="py-3"
                />
                <Button type="submit" className="checkout-details__submit">
                  Continue as Guest
                </Button>
              </form>
            </Form>
          </div>

          {/* Divider */}
          <div className="checkout-details__divider">
            <hr className="checkout-details__divider-line" />
            <span className="checkout-details__divider-text">Or</span>
            <hr className="checkout-details__divider-line" />
          </div>

          {/* Auth Section (Sign In / Sign Up) */}
          <div className="checkout-details__auth">
            {showSignUp ? <SignUpComponent /> : <SignInComponent />}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutDetailsPage;
