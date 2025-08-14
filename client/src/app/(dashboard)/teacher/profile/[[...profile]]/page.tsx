import Header from "@/components/Header";
import React from "react";
import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

/* =========================================================
   Page: TeacherProfilePage
   Purpose:
     - Displays the authenticated teacher's profile using Clerk's
       <UserProfile /> component.
     - Includes a page header and a themed Clerk profile widget.
   Notes:
     - Uses Clerk's "path" routing mode so the widget is bound to
       /teacher/profile.
     - Applies a dark base theme with custom element styles.
   ========================================================= */
const TeacherProfilePage = () => {
  return (
    <>
      {/* Page header */}
      <Header title="Profile" subtitle="View your profile" />

      {/* Clerk User Profile widget */}
      <UserProfile
        path="/teacher/profile"   // Route path for this profile page
        routing="path"            // Use path-based routing
        appearance={{
          baseTheme: dark,        // Dark theme from @clerk/themes
          elements: {
            // Tailwind classes injected into Clerk elements
            scrollBox: "bg-customgreys-darkGrey",
            // Example style override for the sidebar/navbar area
            navbar: {
              "& > div:nth-child(1)": {
                background: "none",
              },
            },
          },
        }}
      />
    </>
  );
};

export default TeacherProfilePage;
