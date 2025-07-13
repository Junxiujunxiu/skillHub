"use client";
import AppSidebar from "@/components/AppSidebar";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar"
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({children}: {children: React.ReactNode}) {
    // This is the layout for the dashboard pages that applies to all dashboard pages
    const pathname = usePathname();
    const [courseId, setCourseId] = useState<string | null>(null);
    const {user, isLoaded} = useUser();

    //handle use effect isCoursePage --it is gonna make sense later
    if(!isLoaded) return <Loading />
    if(!user) return <div>Please sign in to access this page.</div>

  return (
    <SidebarProvider>
        {/* this dashboard class will flex the rest code */}
    <div className="dashboard">
        <AppSidebar />
        <div className="dashboard__content">
            {/* chapters sidebar will go if it is a course page */}
         <div className={cn( "dashboard__main")} style={{height: "100vh"}}> 
             <main className="dashboard__body">{children}</main>
         </div>
      </div>
    </div>
    </SidebarProvider>
  );
}
