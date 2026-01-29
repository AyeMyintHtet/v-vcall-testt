import React from "react";

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = "",
    hoverEffect = false,
}) => {
    return (
        <div
            className={`
        glass-panel rounded-2xl p-6 transition-all duration-300
        ${hoverEffect ? "hover:border-brand-500/30 hover:shadow-brand-500/10 hover:shadow-2xl hover:-translate-y-1" : ""}
        ${className}
      `}
        >
            {children}
        </div>
    );
};
