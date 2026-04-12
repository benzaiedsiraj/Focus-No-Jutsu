import React from 'react';

// Common base sharingan shape (Outer ring, inner pupil)
const BaseSharingan = ({ children, className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* Outer eye boundary */}
    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.2" />
    {/* Retina Base */}
    <circle cx="50" cy="50" r="40" fill="currentColor" opacity="0.08" />
    {/* Inner pupil */}
    <circle cx="50" cy="50" r="10" fill="currentColor" />
    {/* Tomoe Ring Connector */}
    <circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    {children}
  </svg>
);

// Individual Tomoe SVG grouping
const Tomoe = ({ x, y, rotation }) => (
  <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
    <path d="M0 -7 C4 -7 8 -3 8 2 C8 7 5 11 2 15 Q 8 3 0 -7 Z" fill="currentColor" />
    <circle cx="0" cy="0" r="5" fill="currentColor" />
  </g>
);

const OneTomoe = ({ className }) => (
  <BaseSharingan className={className}>
    <Tomoe x="50" y="24" rotation="0" />
  </BaseSharingan>
);

const TwoTomoe = ({ className }) => (
  <BaseSharingan className={className}>
    <Tomoe x="50" y="24" rotation="0" />
    <Tomoe x="50" y="76" rotation="180" />
  </BaseSharingan>
);

const ThreeTomoe = ({ className }) => (
  <BaseSharingan className={className}>
    <Tomoe x="50" y="24" rotation="0" />
    <Tomoe x="27" y="63" rotation="-120" />
    <Tomoe x="73" y="63" rotation="120" />
  </BaseSharingan>
);

// Itachi Mangekyou SVG bespoke geometric pinwheel
const Mangekyou = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className}>
    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.2" />
    <circle cx="50" cy="50" r="40" fill="currentColor" opacity="0.15" />
    
    {/* Interlocking triangular pinwheels */}
    <path d="M50 50 L50 15 C38 15 35 30 50 50 Z" fill="currentColor" />
    <path d="M50 50 L18 68 C22 78 35 76 50 50 Z" fill="currentColor" />
    <path d="M50 50 L82 68 C78 78 65 76 50 50 Z" fill="currentColor" />
    
    {/* Inner connected core structure */}
    <circle cx="50" cy="50" r="9" fill="transparent" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="4" fill="currentColor" />
    
    {/* Aesthetic geometric connecting arcs */}
    <path d="M50 25 L28 64 L72 64 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" opacity="0.6" />
  </svg>
);

export const SharinganGraphic = ({ stage, isBreak }) => {
  // Dynamically swap the color scheme based on training vs break logic
  const colorMode = isBreak 
    ? "text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]" // Konoha Orange
    : "text-red-600 dark:text-red-500 drop-shadow-[0_0_15px_rgba(220,38,38,0.4)] dark:drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]"; // Uchiha Red
    
  const baseClasses = `w-28 h-28 md:w-36 md:h-36 transition-all duration-1000 ease-in-out transform ${colorMode}`;
  
  return (
    <div className="flex justify-center items-center w-full h-36 md:h-44 relative">
      <div className={`absolute transition-all duration-[1500ms] ${stage === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}>
        <OneTomoe className={baseClasses} />
      </div>
      <div className={`absolute transition-all duration-[1500ms] ${stage === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}>
        <TwoTomoe className={baseClasses} />
      </div>
      <div className={`absolute transition-all duration-[1500ms] ${stage === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}>
        <ThreeTomoe className={baseClasses} />
      </div>
      
      {/* Activate intense subtle pulse scaling & slow spin on Mangekyou unlock */}
      <div className={`absolute transition-all duration-[1500ms] ${stage === 3 ? 'opacity-100 scale-110 drop-shadow-[0_0_25px_rgba(220,38,38,0.8)]' : 'opacity-0 scale-75 pointer-events-none'}`}>
        <Mangekyou className={`${baseClasses} animate-[spin_12s_linear_infinite]`} />
      </div>
    </div>
  );
};
