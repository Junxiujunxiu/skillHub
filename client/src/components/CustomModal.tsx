import React from "react";

/* =========================================================
   CustomModal Component
   - A reusable modal wrapper
   - Shows children content in a centered overlay
   - Closes when clicking the dark overlay
   - Does not render anything when `isOpen` is false
   ========================================================= */
const CustomModal = ({ isOpen, onClose, children }: CustomFixedModalProps) => {
  /* ---------- Conditional render ----------
     If `isOpen` is false, return null so nothing is rendered. */
  if (!isOpen) return null;

  /* ---------- Render modal ----------
     1. Overlay (click to close)
     2. Content container
     3. Inner wrapper for passed children
  */
  return (
    <>
      {/* Overlay: dark transparent background, closes modal on click */}
      <div className="custom-modal__overlay" onClick={onClose} />

      {/* Modal content wrapper */}
      <div className="custom-modal__content">
        {/* Inner content area where children are rendered */}
        <div className="custom-modal__inner">{children}</div>
      </div>
    </>
  );
};

export default CustomModal;
