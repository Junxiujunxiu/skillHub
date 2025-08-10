import { Loader2 } from 'lucide-react'
import React from 'react'

/* =========================================================
   Loading Component
   - Displays a loading spinner with accompanying text
   - Used to indicate ongoing processes or data fetching
   - Layout: Loading label, spinner icon, and message text
   ========================================================= */
const Loading = () => {
  return (
    <div className="loading">

      {/* ---------- Loading Label ---------- */}
      Loading

      {/* ---------- Spinner Icon ---------- */}
      <Loader2 className="loading__spinner" />

      {/* ---------- Additional Loading Text ---------- */}
      <span className="loading__text">Please wait...</span>
      
    </div>
  )
}

export default Loading
