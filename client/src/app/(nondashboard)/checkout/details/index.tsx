"use client"

import CoursePreview from '@/components/CoursePreview';
import { CustomFormField } from '@/components/CustomFormField';
import Loading from '@/components/Loading';
import { useCurrentCourse } from '@/hooks/useCurrentCourse';
import { GuestFormData, guestSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'next/navigation';
import React, { use } from 'react'
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import SignInComponent from '@/components/Signin';
import SignUpComponent from '@/components/SignUp';

const CheckoutDetailsPage = () => {
    const { course: selectedCourse, isLoading, isError } = useCurrentCourse()
    const searchParams = useSearchParams();
    const showSignUp = searchParams.get("showSignUp") === "true";

    const methods = useForm<GuestFormData>({
      resolver: zodResolver(guestSchema),
        defaultValues: {
           email: "",
        },
    });

    if(isLoading) return <Loading />;
    if(isError) return <div>Failed to fetch course data</div>;
    if(!selectedCourse) return <div>No course found</div>;

  return (
    <div className="checkout-details">
      <div className="checkout-details__container">
        <div className="checkout-details__preview">
          <CoursePreview course={selectedCourse} />
        </div>

        {/* STRETCH FEATURE */}
        <div className="checkout-details__options">
          <div className="checkout-details__guest">
            <h2 className="checkout-details__title">Guest Checkout</h2>
            <p className="checkout-details__subtitle">
              Enter email to receive course access details and order confirmation. 
              You can create an account after purchanse.
            </p>
            <Form {...methods}>
              <form className="checkout-details__form"
              onSubmit={methods.handleSubmit((data)=>{
                console.log("Guest Checkout Data:", data);
              })}>
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

          <div className="checkout-details__divider">
              <hr className="checkout-details__divider-line"/>
                <span className="checkout-details__divider-text">Or</span>
              <hr className="checkout-details__divider-line"/>
          </div>

          <div className="checkout-details__auth">
              {showSignUp ? <SignUpComponent /> : <SignInComponent />}
          </div>

        </div>
      </div>
    </div>
  )
}

export default CheckoutDetailsPage