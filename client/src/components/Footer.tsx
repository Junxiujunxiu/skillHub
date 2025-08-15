import Link from 'next/link'
import React from 'react'

/* =========================================================
   Footer Component
   - Displays the site’s footer content
   - Shows copyright notice
   - Renders navigation links (About, Privacy policy, etc.)
   ========================================================= */
const Footer = () => {
  return (
    <div className="footer">
      
      {/* ---------- Copyright Section ---------- */}
      <p>&copy; 2025 Jun. All Rights Reserved.</p>

      {/* ---------- Footer Links ---------- */}
      <div className="footer__links">
        {/* Map through static list of link names */}
        {["About", "Privacy policy", "Licensing", "Contact"].map((item) => (
          <Link
            key={item} // Unique key for React
            href={`/${item.toLowerCase().replace(" ", "-")}`} // Convert label to lowercase & replace space with hyphen
            className="footer__link"
            scroll={false}
          >
            {item}
          </Link>
        ))}
      </div>

    </div>
  )
}

export default Footer
