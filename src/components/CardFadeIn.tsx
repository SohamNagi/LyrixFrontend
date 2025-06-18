import { useState, useEffect } from "react";

interface CardFadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function CardFadeIn({
  children,
  delay = 0,
  className = "",
}: CardFadeInProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {children}
    </div>
  );
}
