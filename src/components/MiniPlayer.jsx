import React from 'react';
import { useTimer } from '../context/TimerContext';

// ──────────────────────────────────────────────
// Inline Mini Sharingan SVG (compact three-tomoe)
// ──────────────────────────────────────────────
const MiniSharingan = ({ isRunning, isBreak }) => {
  const color = isBreak ? '#f97316' : '#dc2626';
  return (
    <svg
      viewBox="0 0 100 100"
      width="36"
      height="36"
      style={{ filter: `drop-shadow(0 0 8px ${color}66)` }}
      className={isRunning ? 'miniplayer-spin' : ''}
    >
      <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="3" opacity="0.25" />
      <circle cx="50" cy="50" r="40" fill={color} opacity="0.1" />
      <circle cx="50" cy="50" r="26" fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
      <circle cx="50" cy="50" r="10" fill={color} />
      {/* Three Tomoe */}
      <g transform="translate(50, 24) rotate(0)">
        <path d="M0 -7 C4 -7 8 -3 8 2 C8 7 5 11 2 15 Q 8 3 0 -7 Z" fill={color} />
        <circle cx="0" cy="0" r="5" fill={color} />
      </g>
      <g transform="translate(27, 63) rotate(-120)">
        <path d="M0 -7 C4 -7 8 -3 8 2 C8 7 5 11 2 15 Q 8 3 0 -7 Z" fill={color} />
        <circle cx="0" cy="0" r="5" fill={color} />
      </g>
      <g transform="translate(73, 63) rotate(120)">
        <path d="M0 -7 C4 -7 8 -3 8 2 C8 7 5 11 2 15 Q 8 3 0 -7 Z" fill={color} />
        <circle cx="0" cy="0" r="5" fill={color} />
      </g>
    </svg>
  );
};

// ──────────────────────────────────────────────
// SVG Icon Components (no lucide dependency in PiP)
// ──────────────────────────────────────────────
const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="6,3 20,12 6,21" />
  </svg>
);

const PauseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <rect x="5" y="3" width="4" height="18" rx="1" />
    <rect x="15" y="3" width="4" height="18" rx="1" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ──────────────────────────────────────────────
// MiniPlayer Card — Glassmorphism Bento Box
// ──────────────────────────────────────────────
const MiniPlayer = ({ onClose, mode = 'inline' }) => {
  const { timeLeft, isRunning, isBreak, formatTime, toggleRunning } = useTimer();
  const accentColor = isBreak ? '#f97316' : '#dc2626';

  return (
    <div
      className="miniplayer-card"
      style={{
        /* Glassmorphism Base */
        background: 'rgba(15, 17, 21, 0.82)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderLeft: `3px solid ${accentColor}`,
        borderRadius: '20px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        width: mode === 'pip' ? '100%' : '300px',
        maxWidth: '340px',
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${accentColor}22, inset 0 1px 0 rgba(255,255,255,0.06)`,
        fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
        color: '#fff',
        userSelect: 'none',
        animation: 'pip-slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transition: 'border-color 0.5s, box-shadow 0.5s',
        boxSizing: 'border-box',
      }}
    >
      {/* Sharingan Icon */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        <MiniSharingan isRunning={isRunning} isBreak={isBreak} />
      </div>

      {/* Time Display */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
        <span
          style={{
            fontSize: '9px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: isBreak ? '#fb923c' : 'rgba(255,255,255,0.4)',
            transition: 'color 0.5s',
          }}
        >
          {isBreak ? 'Ramen Break' : 'Focusing'}
        </span>
        <span
          style={{
            fontSize: '32px',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
            background: `linear-gradient(135deg, #fff 40%, ${accentColor}88)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            transition: 'all 0.3s',
          }}
        >
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* Play / Pause Button */}
        <button
          onClick={toggleRunning}
          aria-label={isRunning ? 'Pause' : 'Play'}
          className="miniplayer-btn"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            background: isRunning
              ? `linear-gradient(135deg, ${accentColor}, ${isBreak ? '#ea580c' : '#b91c1c'})`
              : 'rgba(255,255,255,0.08)',
            boxShadow: isRunning ? `0 4px 16px ${accentColor}44` : 'none',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {isRunning ? <PauseIcon /> : <PlayIcon />}
        </button>

        {/* Close Button */}
        <button
          onClick={() => onClose && onClose()}
          aria-label="Close miniplayer"
          className="miniplayer-btn"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.4)',
            background: 'rgba(255,255,255,0.05)',
            transition: 'all 0.25s',
          }}
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

export default MiniPlayer;
