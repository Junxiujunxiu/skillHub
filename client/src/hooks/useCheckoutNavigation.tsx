"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";

/* ================================
   useCheckoutNavigation Hook
   -------------------------------
   PURPOSE:
   - Manages navigation between steps in a checkout process.
   - Reads and updates query parameters for `step` and `id`.
   - Restricts access to certain steps based on sign-in state.

   FEATURES:
   1. Reads current step and course ID from URL.
   2. Provides a `navigateToStep` function to update step & query params.
   3. Prevents unauthenticated users from accessing steps beyond step 1.
   4. Clamps step navigation between 1 and 3.

   RETURNS:
   - checkoutStep (number): The current checkout step (1–3).
   - navigateToStep (fn): Function to change steps.

   USAGE:
   const { checkoutStep, navigateToStep } = useCheckoutNavigation();
   navigateToStep(2); // move to step 2
   ================================ */
export const useCheckoutNavigation = () => {
  /* ---------- Hooks ---------- */
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn } = useUser();

  /* ---------- Query Params ---------- */
  const courseId = searchParams.get("id") ?? "";
  const checkoutStep = parseInt(searchParams.get("step") ?? "1", 10);

  /* ---------- Navigation Function ---------- */
  const navigateToStep = useCallback(
    (step: number) => {
      const newStep = Math.min(Math.max(1, step), 3);
      const showSignUp = isSignedIn ? "true" : "false";

      router.push(
        `/checkout?step=${newStep}&id=${courseId}&showSignUp=${showSignUp}`,
        { scroll: false }
      );
    },
    [courseId, isSignedIn, router]
  );

  /* ---------- Auth Check ---------- */
  useEffect(() => {
    if (isLoaded && !isSignedIn && checkoutStep > 1) {
      navigateToStep(1);
    }
  }, [isLoaded, isSignedIn, checkoutStep, navigateToStep]);

  /* ---------- Return API ---------- */
  return { checkoutStep, navigateToStep };
};

export default useCheckoutNavigation;
