import { useClerk, useUser } from '@clerk/nextjs';// Clerk hooks to get user info and sign out
import { usePathname } from 'next/navigation';// Next.js hook to get the current path
import React from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';// // Custom sidebar components
import { BookOpen, Briefcase, DollarSign, LogOut, PanelLeft, Settings, User } from 'lucide-react';// Icon library
import Loading from './Loading'; // Loading spinner while waiting for user to load
import Image from "next/image";
import { link } from 'fs';
import { cn } from '@/lib/utils';// Utility function to combine class names
import Link from 'next/link';// Link component for navigation


// Component for the application sidebar
const AppSidebar = () => {
    const {user, isLoaded} = useUser();
    const {signOut} = useClerk(); // Function to log user out
    const pathname = usePathname();// Get the current page path
    const { toggleSidebar } = useSidebar();// Control collapsing sidebar

    // Define navigation links for different user roles (student or teacher)
    const navLinks = {
        student: [
            {icon: BookOpen, label: "Courses", href: "/user/courses"},
            {icon: Briefcase, label: "Billing", href: "/user/billing"},
            {icon: User, label: "Profile", href: "/user/profile"},
            {icon: Settings, label: "Settings", href: "/user/settings"},
        ],
        teacher: [
            {icon: BookOpen, label: "Courses", href: "/teacher/courses"},
            {icon: DollarSign, label: "Billing", href: "/teacher/billing"},
            {icon: User, label: "Profile", href: "/teacher/profile"},
            {icon: Settings, label: "Settings", href: "/teacher/settings"},
        ],
    };

    //Show loading spinner while user data is loading;
    if (!isLoaded) return <Loading />;
    // “If the user object doesn't exist (e.g., the user is not logged in), 
    // then stop rendering the rest of the sidebar and instead just show a message saying 
    // 'User not found.' on the screen.”
    if (!user) return <div>User not found.</div>;

    // Determine the user type from public metadata, his value will only be either 'student' or 'teacher'.” 
    //defaulting to "student" if not set
    const userType = (user.publicMetadata.userType as "student" | "teacher") || "student";
    // Select the navigation links based on the user type
    const currentNavLinks = navLinks[userType];

  return( 
    
  <Sidebar
    collapsible="icon"
    style={{ height: "100vh"}}
    className= "bg-customgreys-primarybg border-none shadow-lg"
    >
{/*
  This block of code defines the header section of the sidebar, combining branding and interactive control elements. It does the following:

  - Uses <SidebarHeader> to encapsulate the top section of the sidebar.
  - Contains a <SidebarMenu> that groups header-related items.
  - Within the menu, a single <SidebarMenuItem> holds a <SidebarMenuButton>:
      - The button is set to a large size ("lg").
      - It calls the toggleSidebar() function when clicked, allowing the sidebar to be collapsed or expanded.
      - It applies a hover style with a background change (hover:bg-customgreys-secondarybg) for visual feedback.
  - Inside the button:
      - A div with the class "app-sidebar__logo-container" groups the branding elements.
      - Within this container, another div ("app-sidebar__logo-wrapper") holds:
          - An <Image> component that displays the logo loaded from "/logo.svg", with specified width and height.
          - A <p> element that displays the app title ("Jun").
      - Outside the logo wrapper, a <PanelLeft> icon is included to visually indicate the collapse functionality.
  
  Overall, this section creates a cohesive header that not only brands the app with a logo and title but also provides a user-friendly control (collapse button) for managing the sidebar's visibility.
*/}
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
                                <p className="app-sidebar__title">Jun</p>"
                        </div>
                        <PanelLeft className="app-sidebar__collapse-icon" />
                    </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
     </SidebarHeader> 

        {/*This section renders the main sidebar navigation using SidebarContent.
        It loops through the current user's nav links (student or teacher) and displays them using SidebarMenuItem and SidebarMenuButton.
        Each link includes an icon and label, with styling that highlights the active page based on the current URL.
        An active indicator is also shown beside the selected menu item.*/}
        <SidebarContent>
            <SidebarMenu className="app-sidebar__nav-menu">
                {currentNavLinks.map((link) =>{
                    const isActive = pathname.startsWith(link.href);
                    return(
                        <SidebarMenuItem
                        key={link.href}
                        className={cn(
                            "app-sidebar__nav-item",
                            isActive && "bg-gray-800"
                        )}>
                            <SidebarMenuButton
                            asChild
                            size="lg"
                            className={cn(
                                "app-sidebar__nav-button",
                                !isActive && "text-customgreys-dirtyGrey"
                            )}>
                                <Link href={link.href} className="app-sidebar__nav-link">
                                    <link.icon className={isActive? "text-white-50" : "text-gray-500"}/>
                                    <span 
                                    className={cn(
                                        "app-sidebar__nav-text",
                                        isActive ? "text-white-50" : "text-gray-500")
                                    }>
                                        {link.label}
                                    </span>       
                                </Link>
                            </SidebarMenuButton>
                            {isActive && <div className="app-side-bar__active-indicator"/>}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
         </SidebarContent>  

        {/* 
        This SidebarFooter renders the bottom part of the sidebar,
        containing a single sign-out button. The button is wrapped in
        SidebarMenuItem and SidebarMenuButton (using asChild to allow a custom element).
        When clicked, it calls the signOut() function from Clerk to log the user out.
        It displays a logout icon and the text "Sign out", with styling applied.
        */}
         <SidebarFooter>
            <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <button onClick={() => signOut()} className="app-sidebar__signout">
                        <LogOut className="mr-2 h-6 w-6" />
                        <span>Sign out</span>
                    </button>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarFooter>

  </Sidebar>
  )
}

export default AppSidebar