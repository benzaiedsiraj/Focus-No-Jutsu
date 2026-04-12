import React, { useEffect, useState } from 'react';

export const DynamicBackground = ({ isDark }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="fixed inset-0 z-[-2] bg-[#FAF9F6] dark:bg-[#0F1115]"></div>;

  const leaves = Array.from({ length: 25 });
  const sparks = Array.from({ length: 40 });

  return (
    <div className="fixed inset-0 z-[-2] overflow-hidden pointer-events-none w-full h-full transition-colors duration-1000 bg-[#FAF9F6] dark:bg-[#0b0c10]">
      
      {/* ---------------------------------------------------- */}
      {/* LIGHT MODE: Hidden Leaf Village (Konohagakure) Winds */}
      {/* ---------------------------------------------------- */}
      <div className={`absolute inset-0 transition-opacity duration-[1500ms] ${isDark ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/40 to-transparent z-[-1]"></div>
        
        {leaves.map((_, i) => (
          <svg 
            key={`leaf-${i}`}
            style={{ 
              left: `${Math.random() * 120}vw`, 
              top: `-${Math.random() * 20 + 10}vh`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${Math.random() * 10 + 15}s`,
              filter: `blur(${Math.random() * 3}px)`,
              transform: `scale(${Math.random() * 0.7 + 0.4})`
            }}
            className="absolute opacity-0 animate-leaf-fall"
            width="24" height="24" viewBox="0 0 24 24" fill="none"
          >
            <path d="M12 2C7.5 2 4 5.5 4 10C4 16 12 22 12 22C12 22 20 16 20 10C20 5.5 16.5 2 12 2Z" fill="#10B981" opacity="0.25" />
            <path d="M12 4C8.5 4 6 6.5 6 10C6 14.5 12 19 12 19C12 19 18 14.5 18 10C18 6.5 15.5 4 12 4Z" fill="#047857" opacity="0.15" />
            <path d="M12 4V19" stroke="#064E3B" strokeWidth="0.5" strokeLinecap="round" opacity="0.2"/>
          </svg>
        ))}
      </div>

      {/* ---------------------------------------------------- */}
      {/* DARK MODE: Uchiha/Akatsuki Amaterasu Embers          */}
      {/* ---------------------------------------------------- */}
      <div className={`absolute inset-0 transition-opacity duration-[1500ms] ${isDark ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#140808] to-transparent z-[-1]"></div>
        
        {/* Subtle physical horizontal smoke sweeps imitating clouds */}
        <div className="absolute inset-0 mix-blend-screen opacity-10">
            <div className="absolute top-[10%] left-[-100%] w-[150%] h-[20vh] bg-red-600/20 blur-[100px] animate-[slide-right_40s_linear_infinite]"></div>
            <div className="absolute top-[50%] left-[-100%] w-[120%] h-[30vh] bg-red-800/10 blur-[120px] animate-[slide-right_60s_linear_infinite]" style={{ animationDelay: '15s' }}></div>
        </div>

        {sparks.map((_, i) => (
          <div 
            key={`spark-${i}`}
            style={{ 
              left: `${Math.random() * 100}vw`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${Math.random() * 6 + 10}s`,
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              opacity: Math.random() * 0.4 + 0.2
            }}
            className="absolute rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)] opacity-0 animate-spark-rise"
          ></div>
        ))}
      </div>
      
    </div>
  );
};
