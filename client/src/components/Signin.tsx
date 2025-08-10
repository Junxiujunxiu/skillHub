"use client";

import { SignIn, useUser } from '@clerk/nextjs';
import React from 'react';
import { dark } from '@clerk/themes';
import { useSearchParams } from 'next/navigation';

/* =========================================================
   SignInComponent
   - Renders the Clerk SignIn UI with custom styling
   - Handles conditional redirects based on:
       1. Checkout page flow
       2. User role (teacher/student)
   - Preserves query parameters for seamless checkout sign-up
   ========================================================= */
const SignInComponent = () => {
  /* ---------- Hooks ---------- */
  const { user } = useUser();
  const searchParams = useSearchParams();

  // Check if we are on the checkout page
  const isCheckoutPage = searchParams.get("showSignUp") !== null;
  const courseId = searchParams.get("id");

  /* ---------- Sign-up URL ---------- */
  // Preserve course + step info if on checkout page
  const signUpUrl = isCheckoutPage
    ? `/checkout?step=1&id=${courseId}&showSignUp=true`
    : "/signup";

  /* ---------- Redirect Logic After Sign-in ---------- */
  const getRedirectedUrl = () => {
    if (isCheckoutPage) {
      // Continue checkout process
      return `/checkout?step=2&id=${courseId}&showSignUp=true`;
    }

    // Teacher role → Teacher dashboard
    const userType = user?.publicMetadata?.userType as string;
    if (userType === "teacher") {
      return "/teacher/courses";
    }

    // Default → User courses
    return "user/courses";
  };

  /* ---------- Render ---------- */
  return (
    <SignIn
      appearance={{
        baseTheme: dark,
        elements: {
          rootBox: "flex justify-center items-center py-5",
          cardBox: "shadow-none",
          card: "bg-customgreys-secondarybg w-full shadow-none",
          footer: {
            background: "#25262F",
            padding: "0rem 2.5rem",
            "& > div > div:nth-child(1)": {
              background: "#25262F",
            },
          },
          formFieldLabel: "text-white-50 font-normal",
          formButtonPrimary:
            "bg-primary-700 text-white-100 hover:bg-primary-600 !shadow-none",
          formFieldInput:
            "bg-customgreys-primarybg text-white-50 !shadow-none",
          footerActionLink: "text-primary-750 hover:text-primary-600",
        },
      }}
      signUpUrl={signUpUrl} // Redirect for sign-up button click
      forceRedirectUrl={getRedirectedUrl()} // Post sign-in redirect
      routing="hash" // Use hash-based routing
      afterSignOutUrl="/" // Post sign-out redirect
    />
  );
};

export default SignInComponent;
