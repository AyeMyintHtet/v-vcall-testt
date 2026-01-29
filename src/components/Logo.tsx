import React from "react";

interface LogoProps {
  className?: string; // Allow custom class for positioning/sizing
  variant?: "full" | "icon"; // Option to show only icon or full logo
}

export const Logo: React.FC<LogoProps> = ({ className = "", variant = "full" }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon Container with Gradient/Shadow */}
      <div className="relative flex items-center justify-center w-10 h-10 bg-gray-800 rounded-xl shadow-lg ring-1 ring-purple-350/30 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-350/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
        
        {/* V-Shape / Camera Icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 text-purple-350"
        >
          {/* Abstract V Shape forming a camera lens feel */}
          <path
            d="M4 8L12 20L20 8"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Top connecting line to make it techy */}
          <path
            d="M4 8H20"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.5"
          />
           {/* Center dot/lens */}
           <circle cx="12" cy="14" r="2" fill="currentColor" />
        </svg>
      </div>

      {/* Text Branding */}
      {variant === "full" && (
        <div className="flex flex-col justify-center">
          <h1 className="text-xl font-bold text-white tracking-tight leading-none font-sans">
            V-VCall
          </h1>
          <span className="text-[10px] text-purple-350 font-semibold tracking-widest uppercase mt-0.5">
            Connect
          </span>
        </div>
      )}
    </div>
  );
};
