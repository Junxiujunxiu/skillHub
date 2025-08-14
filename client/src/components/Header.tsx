import React from 'react'

/* =========================================================
   Header Component
   - Displays a main title and optional subtitle
   - Supports an optional right-side element (e.g., button, icon)
   - Layout: Title & subtitle on the left, rightElement on the right
   ========================================================= */
const Header = ({ title, subtitle, rightElement }: HeaderProps) => {
  return (
    <div className="header">

      {/* ---------- Left Section: Title & Subtitle ---------- */}
      <div>
        <h1 className="header__title">{title}</h1>
        <p className="header__subtitle">{subtitle}</p>
      </div>

      {/* ---------- Right Section: Optional Element ---------- */}
      {rightElement && <div>{rightElement}</div>}
      
    </div>
  )
}

export default Header
