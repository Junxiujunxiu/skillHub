"use client";

import { Bell, BookOpen } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

/* =========================================================
   NonDashBoardNavBar Component
   - Displays the top navigation bar for non-dashboard pages
   - Includes:
       1. Brand name (link to homepage)
       2. Search bar
       3. Notification button
       4. Conditional rendering based on authentication:
           - SignedIn: Show Clerk UserButton
           - SignedOut: Show login/signup buttons
   ========================================================= */
const NonDashBoardNavBar = () => {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.userType as "student" | "teacher";

  return (
    <nav className="nondashboard-navbar">
      <div className="nondashboard-navbar__container">

        {/* ---------- Left Section: Brand & Search ---------- */}
        <div className="nondashboard-navbar__search">

          {/* Brand name (logo/text link to homepage) */}
          <Link href="/" className="nondashboard-navbar__brand" scroll={false}>
            BrandName
          </Link>

          {/* Search bar with icon */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Link href="/search" className="nondashboard-navbar__search-input" scroll={false}>
                <span className="hidden sm:inline">Search Courses</span>
                <span className="sm:hidden">Search</span>
              </Link>
              <BookOpen className="nondashboard-navbar__search-icon size={18}" />
            </div>
          </div>
        </div>

        {/* ---------- Right Section: Notifications & Auth ---------- */}
        <div className="nondashboard-navbar__actions">

          {/* Notification button with indicator */}
          <button className="nondashboard-navbar__notification-button">
            <span className="nondashboard-navbar__notification-indicator"></span>
            <Bell className="nondashboard-navbar__notification-icon" />
          </button>

          {/* When user is signed in: Show Clerk UserButton */}
          <SignedIn>
            <UserButton
              appearance={{
                baseTheme: dark,
                elements: {
                  userButtonOuterIdentifier: "text-customgreys-dirtyGrey",
                  userButtonBox: "scale-90 sm:scale-100"
                }
              }}
              showName={true}
              userProfileMode="navigation"
              userProfileUrl={
                userRole === "teacher" ? "/teacher/profile" : "/user/profile"
              }
            />
          </SignedIn>

          {/* When user is signed out: Show login/signup links */}
          <SignedOut>
            <Link href="/signin" className="nondashboard-navbar__auth-button--login" scroll={false}>
              Log in
            </Link>
            <Link href="/signup" className="nondashboard-navbar__auth-button--signup" scroll={false}>
              Sign up
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default NonDashBoardNavBar;
