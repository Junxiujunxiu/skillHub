import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import React from "react";

/* =========================================================
   Page: CompletionPage
   Purpose:
     - Displays a confirmation page after a successful course purchase.
   Layout:
     - Main wrapper with three sections:
       1. Content: Success icon, heading, and confirmation message.
       2. Support: Link to contact customer support.
       3. Action: Link to navigate to the user's courses.
   Key Elements:
     - Uses `lucide-react` Check icon for success indication.
     - Uses `Button` with `variant="link"` for styled email link.
     - Uses `next/link` for client-side navigation to courses.
   ========================================================= */
const CompletionPage = () => {
  return (
    <div className="completion">
      {/* ---------- Success Message ---------- */}
      <div className="completion__content">
        <div className="completion__icon">
          <Check className="w-16 h-16" />
        </div>
        <h1 className="completion__title">Completed</h1>
        <p className="completion__message">
          You have made a course purchase successfully!
        </p>
      </div>

      {/* ---------- Support Link ---------- */}
      <div className="completion__support">
        <p>
          Need help? Contact our{" "}
          <Button
            variant="link"
            asChild
            className="p-0 m-0 text-primary-700"
          >
            <a href="mailto:support@example.com">Customer Support</a>
          </Button>
          .
        </p>
      </div>

      {/* ---------- Navigation Action ---------- */}
      <div className="completion__action">
        <Link href="user/courses" scroll={false}>
          Go to Courses
        </Link>
      </div>
    </div>
  );
};

export default CompletionPage;
