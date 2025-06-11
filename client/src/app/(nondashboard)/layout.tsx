import NonDashboardNavbar from "@/components/NonDashBoardNavBar"
import Footer from "@/components/Footer";

export default function Layout({children}: {children: React.ReactNode}) {
    // This is the layout for the non-dashboard pages
  return (
    <div className="nondashboard-layout">
      <NonDashboardNavbar />
      <main className="nondashboard-layout__main">
        {children}
        {/* <Landing /> */}
      </main>
      <Footer />
    </div>

  );
}
