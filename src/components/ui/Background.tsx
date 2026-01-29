import React from "react";

export const Background: React.FC = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-dark-900">
            <div className="absolute top-0 left-0 w-full h-full bg-animated opacity-60" />

            {/* Animated Blobs */}
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand-500/20 rounded-full blur-[120px] animate-blob mix-blend-screen" />
            <div className="absolute top-[20%] right-[10%] w-[35%] h-[35%] bg-purple-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-screen" />
            <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-brand-400/10 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-screen" />

            {/* Grid Overlay (Optional for tech feel) */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
        </div>
    );
};
