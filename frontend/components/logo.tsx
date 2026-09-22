import React from "react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  withText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", size = "md", withText = true }) => {
  const sizeMap = {
    sm: { img: "h-8", text: "text-base" },
    md: { img: "h-11", text: "text-xl" },
    lg: { img: "h-16", text: "text-2xl" },
    xl: { img: "h-24", text: "text-4xl" },
  };

  const currentSize = sizeMap[size];

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group cursor-pointer ${className}`}>
      {/* Official Uploaded SKILL X CHANGE Logo Image */}
      <img
        src="/logo.png"
        alt="SKILL X CHANGE Logo"
        className={`${currentSize.img} w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-xs`}
      />
    </Link>
  );
};
