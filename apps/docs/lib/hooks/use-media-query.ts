"use client";

import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  // Default to false for server-side rendering
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query);
      
      // Set the initial value
      setMatches(media.matches);

      // Define a callback function
      const listener = () => {
        setMatches(media.matches);
      };

      // Add the callback as a listener
      media.addEventListener("change", listener);

      // Remove the listener when component unmounts
      return () => {
        media.removeEventListener("change", listener);
      };
    }
  }, [query]);

  return matches;
}
