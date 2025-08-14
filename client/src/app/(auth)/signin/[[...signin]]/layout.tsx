import React from "react";

/* =========================================================================
   Component: Layout
   Purpose:
     - Serves as a wrapper layout for authentication-related pages (e.g., login, register).
     - Provides a consistent structure and styling for all child content.
   Props:
     - children (React.ReactNode): The page content to be rendered inside the layout.
   Usage:
     <Layout>
       <LoginForm />
     </Layout>
   ========================================================================= */
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="auth-layout">
      {/* Main content area for authentication pages */}
      <main className="auth-layout__main">{children}</main>
    </div>
  );
};

export default Layout;
