import React from 'react';

const Seed = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* Ground base indicator */}
    <path d="M35 85 L65 85" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
    {/* Minimalist seed shape resting smoothly */}
    <path d="M50 82 C55 82, 58 75, 58 68 C58 60, 50 50, 50 50 C50 50, 42 60, 42 68 C42 75, 45 82, 50 82 Z" fill="currentColor" />
  </svg>
);

const Sprout = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* Ground base */}
    <path d="M25 85 L75 85" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    {/* Delicate growing stem */}
    <path d="M50 85 Q 48 65, 55 50" stroke="currentColor" fill="none" strokeWidth="4" strokeLinecap="round" />
    {/* Sprouting leaf */}
    <path d="M55 50 C 65 50, 75 42, 68 32 C 60 22, 55 50, 55 50 Z" fill="currentColor" />
  </svg>
);

const Plant = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* Ground base */}
    <path d="M25 85 L75 85" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    {/* Solid growing stem */}
    <path d="M50 85 Q 46 60, 50 35" stroke="currentColor" fill="none" strokeWidth="4" strokeLinecap="round" />
    {/* Right prominent leaf */}
    <path d="M50 65 C 65 60, 80 50, 70 40 C 60 30, 50 65, 50 65 Z" fill="currentColor" />
    {/* Left secondary leaf */}
    <path d="M48 55 C 38 52, 28 42, 36 32 C 45 22, 48 55, 48 55 Z" fill="currentColor" />
  </svg>
);

const Flower = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* Ground base */}
    <path d="M25 85 L75 85" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    {/* Tall graceful stem */}
    <path d="M50 85 Q 46 60, 50 32" stroke="currentColor" fill="none" strokeWidth="4" strokeLinecap="round" />
    {/* Right leaf */}
    <path d="M50 65 C 65 60, 75 52, 68 42 C 60 32, 50 65, 50 65 Z" fill="currentColor" opacity="0.9" />
    {/* Left leaf */}
    <path d="M48 55 C 35 50, 25 40, 32 30 C 40 20, 48 55, 48 55 Z" fill="currentColor" opacity="0.9" />
    
    {/* Radiant Flower blooming structure */}
    {/* Inner core */}
    <circle cx="50" cy="22" r="6" fill="#fbbf24" stroke="currentColor" strokeWidth="1.5" />
    
    {/* Elegant symmetrical petals */}
    {/* Top left */}
    <path d="M46 17 C42 5, 50 0, 50 0 C50 0, 55 8, 52 17" fill="currentColor" />
    {/* Top right */}
    <path d="M56 20 C68 12, 72 20, 72 20 C72 20, 62 25, 56 20" fill="currentColor" opacity="0.85" />
    {/* Bottom right */}
    <path d="M55 26 C65 35, 58 42, 58 42 C58 42, 52 35, 55 26" fill="currentColor" opacity="0.85" />
    {/* Bottom left */}
    <path d="M45 26 C35 35, 42 42, 42 42 C42 42, 48 35, 45 26" fill="currentColor" />
    {/* Mid left */}
    <path d="M44 20 C32 12, 28 20, 28 20 C28 20, 38 25, 44 20" fill="currentColor" opacity="0.9" />
  </svg>
);

export const PlantGraphic = ({ stage }) => {
  // Enhanced transitioning and aesthetic dropping shadow for premium feeling
  const baseClasses = "w-24 h-24 md:w-32 md:h-32 text-emerald-600 dark:text-emerald-400 drop-shadow-[0_4px_12px_rgba(16,185,129,0.3)] dark:drop-shadow-[0_4px_16px_rgba(52,211,153,0.3)] transition-all duration-1000 ease-in-out transform";
  
  return (
    <div className="flex justify-center items-center w-full h-32 md:h-40 relative">
      {/* Absolute positioning makes crossfading easier, but we'll conditionally render nicely */}
      <div className={`absolute transition-all duration-[1500ms] ${stage === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
        <Seed className={`${baseClasses} translate-y-4`} />
      </div>
      <div className={`absolute transition-all duration-[1500ms] ${stage === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}>
        <Sprout className={baseClasses} />
      </div>
      <div className={`absolute transition-all duration-[1500ms] ${stage === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}>
        <Plant className={baseClasses} />
      </div>
      <div className={`absolute transition-all duration-[1500ms] ${stage === 3 ? 'opacity-100 scale-110 drop-shadow-[0_0_25px_rgba(16,185,129,0.5)]' : 'opacity-0 scale-75 pointer-events-none'}`}>
        <Flower className={baseClasses} />
      </div>
    </div>
  );
};
