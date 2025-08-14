import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/* =========================================================
   useIsMobile (Custom Hook)
   - Determines if the current viewport is in "mobile" mode
     based on a defined breakpoint.
   - Breakpoint: < 768px width (default).

   HOW IT WORKS:
   1. Sets up a state variable `isMobile` to track viewport size.
   2. Uses `window.matchMedia` to detect screen width changes.
   3. Adds a listener for responsive changes.
   4. Cleans up the listener on component unmount.
   5. Returns `true` if current width < breakpoint, otherwise `false`.

   USE CASES:
   - Conditionally render mobile vs. desktop components.
   - Apply responsive styles or logic in React components.
   ========================================================= */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // Create a media query list for the breakpoint
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Handler to update state when screen size changes
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Listen for changes and set initial value
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);

    // Cleanup event listener on unmount
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Always return a boolean value (fallback to false if undefined)
  return !!isMobile;
}
