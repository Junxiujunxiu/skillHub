import SignInComponent from "@/components/Signin";

/* =========================================================================
   Page Component: Sign In Page
   Purpose:
     - Serves as the sign-in route/page for the application.
     - Renders the `SignInComponent` which handles user authentication UI.
   Routing:
     - This file is typically placed in the `app` or `pages` directory
       so the framework (e.g., Next.js) automatically treats it as a route.
   Usage:
     - Navigating to this page's URL (e.g., /sign-in) displays the sign-in form.
   ========================================================================= */
export default function Page() {
  return <SignInComponent />;
}
