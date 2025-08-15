/* ---------------------------------------------------------------------------
   Component: AppSidebar
   Purpose:
     - Renders the main application sidebar with navigation links, branding,
       and user session controls.
     - Adapts navigation items based on the logged-in user's role (student or teacher).

   Behavior:
     - Displays different sets of navigation links for students and teachers.
     - Highlights the active menu item based on the current page's path.
     - Includes a collapsible header section with branding (logo & title).
     - Shows a footer section with a "Sign out" button.
     - If user data is still loading, shows a loading spinner.
     - If no user is found, displays a "User not found." message.

   Props:
     - None (uses hooks to get user and navigation context).

   Hooks & Dependencies:
     - useUser, useClerk (from @clerk/nextjs) for authentication data & sign out.
     - usePathname (Next.js) for detecting current route.
     - useSidebar (custom hook) for toggling sidebar collapse.
     - cn (utility) for conditional className building.
     - next/image for optimized logo rendering.
     - lucide-react icons for navigation visuals.
     - Custom UI components: Sidebar, SidebarHeader, SidebarContent, SidebarFooter,
       SidebarMenu, SidebarMenuItem, SidebarMenuButton.

   Navigation Structure:
     - Student Links:
         * Courses
         * Billing
         * Profile
         * Settings
     - Teacher Links:
         * Courses
         * Billing
         * Profile
         * Settings
     (Icons vary per item, imported from lucide-react.)

   Layout:
     1. SidebarHeader:
        - Collapse button + logo + app title.
     2. SidebarContent:
        - Dynamic navigation links for current user type.
        - Active item styled with background highlight & active indicator.
     3. SidebarFooter:
        - Sign out button triggers Clerk's signOut().

--------------------------------------------------------------------------- */

import { useClerk, useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  BookOpen,
  Briefcase,
  DollarSign,
  LogOut,
  PanelLeft,
  Settings,
  User,
} from 'lucide-react';
import Loading from './Loading';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const AppSidebar = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  const navLinks = {
    student: [
      { icon: BookOpen, label: 'Courses', href: '/user/courses' },
      { icon: Briefcase, label: 'Billing', href: '/user/billing' },
      { icon: User, label: 'Profile', href: '/user/profile' },
      { icon: Settings, label: 'Settings', href: '/user/settings' },
    ],
    teacher: [
      { icon: BookOpen, label: 'Courses', href: '/teacher/courses' },
      { icon: DollarSign, label: 'Billing', href: '/teacher/billing' },
      { icon: User, label: 'Profile', href: '/teacher/profile' },
      { icon: Settings, label: 'Settings', href: '/teacher/settings' },
    ],
  };

  if (!isLoaded) return <Loading />;
  if (!user) return <div>User not found.</div>;

  const userType =
    (user.publicMetadata.userType as 'student' | 'teacher') || 'student';
  const currentNavLinks = navLinks[userType];

  return (
    <Sidebar
      collapsible="icon"
      style={{ height: '100vh' }}
      className="bg-customgreys-primarybg border-none shadow-lg"
    >
      {/* Header: Logo + Title + Collapse Button */}
      <SidebarHeader>
        <SidebarMenu className="app-sidebar__menu">
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={() => toggleSidebar()}
              className="group hover:bg-customgreys-secondarybg"
            >
              <div className="app-sidebar__logo-container group">
                <div className="app-sidebar__logo-wrapper">
                  <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={25}
                    height={20}
                    className="app-sidebar__log"
                  />
                  <p className="app-sidebar__title">Jun</p>
                </div>
                <PanelLeft className="app-sidebar__collapse-icon" />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation Links */}
      <SidebarContent>
        <SidebarMenu className="app-sidebar__nav-menu">
          {currentNavLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <SidebarMenuItem
                key={link.href}
                className={cn(
                  'app-sidebar__nav-item',
                  isActive && 'bg-gray-800'
                )}
              >
                <SidebarMenuButton
                  asChild
                  size="lg"
                  className={cn(
                    'app-sidebar__nav-button',
                    !isActive && 'text-customgreys-dirtyGrey'
                  )}
                >
                  <Link href={link.href} className="app-sidebar__nav-link" scroll={false}>
                    <link.icon
                      className={isActive ? 'text-white-50' : 'text-gray-500'}
                    />
                    <span
                      className={cn(
                        'app-sidebar__nav-text',
                        isActive ? 'text-white-50' : 'text-gray-500'
                      )}
                    >
                      {link.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
                {isActive && <div className="app-side-bar__active-indicator" />}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer: Sign Out */}
      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <button
              onClick={() => signOut()}
              className="app-sidebar__signout"
            >
              <LogOut className="mr-2 h-6 w-6" />
              <span>Sign out</span>
            </button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
