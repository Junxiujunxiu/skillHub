import React from "react";

/* =========================================================
   CustomModal Component
   - A generic, reusable modal wrapper for displaying any content
   - Features:
       1. Full-screen dark overlay
       2. Centered modal content
       3. Closes when clicking outside the modal (overlay)
       4. Does not render when `isOpen` is false
   ========================================================= */
const CustomModal = ({ isOpen, onClose, children }: CustomFixedModalProps) => {
  // ---------------------------------------------------------
  // Conditional Rendering
  // ---------------------------------------------------------
  // If modal state is closed, return null to prevent unnecessary render
  if (!isOpen) return null;

  // ---------------------------------------------------------
  // Render Modal Layout
  // ---------------------------------------------------------
  // Structure:
  // 1. Overlay (dark transparent layer that closes modal on click)
  // 2. Content wrapper (centers modal in viewport)
  // 3. Inner container for dynamic child components
  return (
    <>
      {/* Dark background overlay */}
      <div className="custom-modal__overlay" onClick={onClose} />

      {/* Modal container */}
      <div className="custom-modal__content">
        {/* Slot for child components passed to modal */}
        <div className="custom-modal__inner">{children}</div>
      </div>
    </>
  );
};

export default CustomModal;
