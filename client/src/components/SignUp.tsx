"use client";

import { SignUp, useUser } from '@clerk/nextjs';
import React from 'react';
import { dark } from '@clerk/themes';
import { useSearchParams } from 'next/navigation';

/* =========================================================
   SignUpComponent
   - Renders the Clerk SignUp UI with custom styling
   - Handles conditional redirects based on:
       1. Checkout page flow
       2. User role (teacher/student)
   - Preserves query parameters for seamless checkout sign-up
   ========================================================= */
const SignUpComponent = () => {
  /* ---------- Hooks ---------- */
  const { user } = useUser();
  const searchParams = useSearchParams();

  // Determine if this is part of the checkout flow
  const isCheckoutPage = searchParams.get("showSignUp") !== null;
  const courseId = searchParams.get("id");

  /* ---------- Sign-in URL for footer link ---------- */
  // Preserve course + step info if on checkout page
  const signInUrl = isCheckoutPage
    ? `/checkout?step=1&id=${courseId}&showSignUp=false`
    : "/signin";

  /* ---------- Redirect Logic After Sign-up ---------- */
  const getRedirectedUrl = () => {
    if (isCheckoutPage) {
      // Continue checkout process
      return `/checkout?step=2&id=${courseId}&showSignUp=false`;
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
    <SignUp
      appearance={{
        baseTheme: dark,
        elements: {
          rootBox: "flex w-full items-center justify-center",
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
      signInUrl={signInUrl} // Redirect for "Sign in" link
      forceRedirectUrl={getRedirectedUrl()} // Post sign-up redirect
      routing="hash" // Use hash-based routing
      afterSignOutUrl="/" // Post sign-out redirect
    />
  );
};

export default SignUpComponent;
