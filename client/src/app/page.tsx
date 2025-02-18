import NonDashboardNavbar from "@/components/NonDashBoardNavBar"
import Landing from "@/app/(nondashboard)/landing/page" // use () to remove it from url

export default function Home() {
  return (
    <div className="nondashboard-layout">
      <NonDashboardNavbar />
      <main className="nondashboard-layout__main">
        <Landing />
      </main>
    </div>

  );
}
