import { useState, useEffect } from "react";

interface FadeTransitionProps {
  children: React.ReactNode;
  loading: boolean;
  skeleton: React.ReactNode;
  delay?: number;
}

export function FadeTransition({
  children,
  loading,
  skeleton,
  delay = 100,
}: FadeTransitionProps) {
  const [showContent, setShowContent] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(loading);

  useEffect(() => {
    if (!loading && !showContent) {
      // Start showing content after a small delay for smoother transition
      const timer = setTimeout(() => {
        setShowContent(true);
        // Hide skeleton after content starts fading in
        setTimeout(() => setShowSkeleton(false), 150);
      }, delay);

      return () => clearTimeout(timer);
    } else if (loading) {
      setShowContent(false);
      setShowSkeleton(true);
    }
  }, [loading, showContent, delay]);

  return (
    <div className="relative">
      {/* Skeleton Layer */}
      {showSkeleton && (
        <div
          className={`transition-opacity duration-300 ${
            showContent ? "opacity-0" : "opacity-100"
          }`}
        >
          {skeleton}
        </div>
      )}

      {/* Content Layer */}
      {!loading && (
        <div
          className={`transition-opacity duration-300 ${
            showSkeleton ? "absolute inset-0" : ""
          } ${showContent ? "opacity-100" : "opacity-0"}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
