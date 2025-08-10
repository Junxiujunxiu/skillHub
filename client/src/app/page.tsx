/* ---------------------------------------------------------------------------
   Component: Home
   Purpose:
     - Serves as the landing page layout for non-dashboard pages.
     - Displays the main marketing/home content along with a top navbar and footer.
   Imports:
     - NonDashboardNavbar: Navigation bar for public/non-authenticated sections.
     - Landing: Landing page content (note: wrapped in () in the path so it doesn't appear in the URL).
     - Footer: Footer component for global site links/info.
   Layout Flow:
     1. Wraps the entire page in `.nondashboard-layout` for consistent styling.
     2. Renders NonDashboardNavbar at the top.
     3. Main content section contains the Landing page component.
     4. Footer is placed at the bottom.
--------------------------------------------------------------------------- */

import NonDashboardNavbar from "@/components/NonDashBoardNavBar"; // Top navigation for public pages
import Landing from "@/app/(nondashboard)/landing/page"; // Landing content, URL excluded via (nondashboard)
import Footer from "@/components/Footer"; // Footer with site-wide info

export default function Home() {
  return (
    <div className="nondashboard-layout">
      {/* Public-facing navigation */}
      <NonDashboardNavbar />
      {/* Main marketing/landing content */}
      <main className="nondashboard-layout__main">
        <Landing />
      </main>
      {/* Global footer */}
      <Footer />
    </div>
  );
}
