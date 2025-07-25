"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";

/**
 * Custom hook to manage checkout navigation steps.
 * Handles query params, step transitions, and sign-in checks.
 */
export const useCheckoutNavigation = () => {
  // Hooks for routing, query params, and user state
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn } = useUser();

  // Extract query parameters with fallback values
  const courseId = searchParams.get("id") ?? "";
  const checkoutStep = parseInt(searchParams.get("step") ?? "1", 10);

  /**
   * Navigate to a specific checkout step.
   * Ensures step stays within 1–3 and preserves course ID & sign-up flag.
   * We wrap it with useCallback so the function doesn’t get recreated on
   *  every render (unless courseId, isSignedIn, or router changes).
   */
  const navigateToStep = useCallback(
    (step: number) => {
      const newStep = Math.min(Math.max(1, step), 3); // Clamp step between 1 and 3
      const showSignUp = isSignedIn ? "true" : "false";

      router.push(
        `/checkout?step=${newStep}&id=${courseId}&showSignUp=${showSignUp}`,
        { scroll: false }
      );
    },
    [courseId, isSignedIn, router]
  );

  /**
   * Auto-redirect to step 1 if the user is not signed in and tries
   * to access steps beyond the first one.
   */
  useEffect(() => {
    if (isLoaded && !isSignedIn && checkoutStep > 1) {
      navigateToStep(1);
    }
  }, [isLoaded, isSignedIn, checkoutStep, navigateToStep]);

  // Expose current step and navigation function
  return { checkoutStep, navigateToStep };
};

export default useCheckoutNavigation;
