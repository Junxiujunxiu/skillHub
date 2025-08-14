import SignUpComponent from "@/components/SignUp";

/* =========================================================================
   Page Component: Sign Up Page
   Purpose:
     - Serves as the registration route/page for the application.
     - Displays the `SignUpComponent` inside a full-height flex container.
   Layout:
     - Uses Tailwind classes:
         - min-h-screen → full viewport height
         - flex → enables flexbox layout for centering/alignment.
   Routing:
     - Placed in the `app` or `pages` directory so the framework (e.g., Next.js)
       automatically treats it as a route.
   Usage:
     - Navigating to this page's URL (e.g., /sign-up) displays the registration form.
   ========================================================================= */
export default function Page() {
  return (
    <div className="min-h-screen flex">
      <SignUpComponent />
    </div>
  );
}
