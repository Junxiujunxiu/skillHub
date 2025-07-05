"use client";

import { SignIn, useUser } from '@clerk/nextjs';
import React from 'react'
import { dark } from '@clerk/themes';
import { useSearchParams } from 'next/navigation';

const SignInComponent = () => {
  /* Check if the user is on the checkout page by seeing if showSignUp exists 
  // in the URL. If yes, build a sign-up link that keeps their course and step 
  // info. If not, just send them to the normal sign-up page.*/
  const { user } = useUser();
  const searchParams = useSearchParams();
  const isCheckoutPage = searchParams.get("showSignUp") !== null;
  const courseId = searchParams.get("id");

  // If the user is on the checkout page, build a sign-up link that keeps their course and step info
  const signUpUrl = isCheckoutPage ? `/checkout?step=1&id=${courseId}&showSignUp=true`: "/signup";

  //get url to redirect the user after signing in
const getRedirectedUrl = () => {
  if(isCheckoutPage){
    return `/checkout?step=2&id=${courseId}`
  }

  //extract user type from metadata and check if the user is a teacher then redirect them to the teacher dashboard
  const userType = user?.publicMetadata?.userType as string;
  if(userType === "teacher"){
    return "/teacher/courses";
  }
  //If the user is not on the checkout page and not a teacher, they are redirected to this url
  return "user/courses";
};
  return <SignIn 
          appearance={{
            baseTheme: dark,
            elements:{
              rootBox: "flex justify-center items-center py-5",
              cardBox: "shadow-none",
              card: "bg-customgreys-secondarybg w-full shadow-none",
              footer: {
                background: "#25262F",
                padding: "0rem 2.5rem",
                "& > div > div:nth-child(1)":{
                  background: "#25262F",
                },
              },
              formFieldLabel: "text-white-50 font-normal",
              formButtonPrimary: "bg-primary-700 text-white-100 hover:bg-primary-600 !shadow-none",
              formFieldInput: "bg-customgreys-primarybg text-white-50 !shadow-none",
              footerActionLink: "text-primary-750 hover:text-primary-600"
            },
          }}
          //when the user clicks on the sign up button, they are redirected to the sign up page with this URL
          signUpUrl={signUpUrl}
          //after successful sign in, the user is redirected to this URL
          forceRedirectUrl={getRedirectedUrl()}
          //tells clerk to use the hash routing strategy
          routing="hash"
          //user is redirected to the home page after signing out
          afterSignOutUrl="/"
  />
}

export default SignInComponent;