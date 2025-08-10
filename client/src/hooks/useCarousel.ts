import { useState, useEffect } from "react";

interface UseCarouselProps {
  totalImages: number; // Total number of images in the carousel
  interval?: number;   // Time in ms between automatic transitions (default: 5000ms)
}

/* =========================================================
   useCarousel (Custom Hook)
   - Manages the current image index for an auto-playing carousel.
   - Cycles through images at a given time interval.

   PARAMETERS:
   - totalImages (number): Total number of images to loop through.
   - interval (number, optional): Time delay in milliseconds 
     before switching to the next image (default: 5000ms).

   HOW IT WORKS:
   1. Initializes `currentImage` state to track the active image index.
   2. Uses `useEffect` with `setInterval` to update the index 
      at the specified interval.
   3. Wraps index updates using modulo (%) to loop back to the start.
   4. Cleans up the interval on component unmount.

   RETURNS:
   - currentImage (number): The index of the currently displayed image.

   USE CASES:
   - Image sliders
   - Testimonial carousels
   - Auto-rotating banners
   ========================================================= */
export const useCarousel = ({ totalImages, interval = 5000 }: UseCarouselProps) => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    // Create an interval to cycle through images
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % totalImages);
    }, interval);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [totalImages, interval]);

  return currentImage;
};
