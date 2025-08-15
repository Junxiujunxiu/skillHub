"use client";

import { Bell, BookOpen } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

/* =========================================================
   NavBar Component
   - Displays the top navigation bar for the dashboard
   - Includes:
       1. Sidebar trigger (mobile view)
       2. Search bar with dynamic styling for course pages
       3. Notification button
       4. User profile button (Clerk)
   - Props:
       - isCoursePage (boolean): changes search bar background
   ========================================================= */
const NavBar = ({ isCoursePage }: { isCoursePage: boolean }) => {
  const { user } = useUser();
  const userRole = user?.publicMetadata?.userType as "student" | "teacher";

  return (
    <nav className="dashboard-navbar">
      <div className="dashboard-navbar__container">

        {/* ---------- Left Section: Sidebar & Search ---------- */}
        <div className="dashboard-navbar__search">

          {/* Sidebar trigger button (mobile only) */}
          <div className="md:hidden">
            <SidebarTrigger className="dashboard-navbar__sidebar-trigger" />
          </div>

          {/* Search bar with icon */}
          <div className="flex items-center gap-4">
            <div className="relative group">

              {/* Search link with conditional background for course pages */}
              <Link
                href="/search"
                className={cn("dashboard-navbar__search-input", {
                  "!bg-customgreys-secondarybg": isCoursePage
                })}
                scroll={false}
              >
                <span className="hidden sm:inline">Search Courses</span>
                <span className="sm:hidden">Search</span>
              </Link>

              {/* Search icon */}
              <BookOpen className="dashboard-navbar__search-icon size={18}" />
            </div>
          </div>
        </div>

        {/* ---------- Right Section: Notifications & Profile ---------- */}
        <div className="dashboard-navbar__actions">

          {/* Notification button with indicator */}
          <button className="nondashboard-navbar__notification-button">
            <span className="nondashboard-navbar__notification-indicator"></span>
            <Bell className="nondashboard-navbar__notification-icon" />
          </button>

          {/* User profile button (Clerk) */}
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
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
