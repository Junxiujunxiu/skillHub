/* =========================================================
   Component: Layout (Non-Dashboard)
   Purpose:
     - Provides a shared layout for all non-dashboard pages.
     - Includes a top navigation bar and footer around the main content.
   Props:
     - children: React nodes representing the page’s main content.
   Structure:
     - NonDashboardNavbar (Header)
     - Main content area
     - Footer
   ========================================================= */

   import NonDashboardNavbar from "@/components/NonDashBoardNavBar"; // Navbar for public/non-dashboard pages
   import Footer from "@/components/Footer"; // Global footer component
   import React from "react";
   
   /* =========================================================
      Functional Component
      ========================================================= */
   export default function Layout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <div className="nondashboard-layout">
         {/* ---------- Header (Navbar) ---------- */}
         <NonDashboardNavbar />
   
         {/* ---------- Main Content ---------- */}
         <main className="nondashboard-layout__main">
           {children}
           {/* Example placeholder for potential landing page */}
           {/* <Landing /> */}
         </main>
   
         {/* ---------- Footer ---------- */}
         <Footer />
       </div>
     );
   }
   