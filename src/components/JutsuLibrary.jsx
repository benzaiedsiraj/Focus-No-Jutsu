import React from 'react';

// ──────────────────────────────────────────────
// Dynamic Seal SVG — changes complexity by rank
// ──────────────────────────────────────────────
const SealIcon = ({ rank, size = 28 }) => {
  const isS = rank === 'S-Rank';
  const isA = rank === 'A-Rank';
  const isHigh = isS || isA;
  
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="jutsu-seal-icon">
      {/* Outer ring */}
      <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.3" />
      {/* Inner ring */}
      <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      {/* Center dot */}
      <circle cx="50" cy="50" r="6" fill="currentColor" opacity="0.9" />
      {/* Cross hairs */}
      <line x1="50" y1="18" x2="50" y2="82" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <line x1="18" y1="50" x2="82" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      {/* Kanji-style marks for higher ranks */}
      {isHigh && (
        <>
          <line x1="35" y1="35" x2="65" y2="65" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
          <line x1="65" y1="35" x2="35" y2="65" stroke="currentColor" strokeWidth="1.5" opacity="0.35" />
        </>
      )}
      {isS && (
        <>
          <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" strokeDasharray="4 3" />
          <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        </>
      )}
      {/* Corner tomoe marks */}
      <circle cx="50" cy="18" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="50" cy="82" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="18" cy="50" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="82" cy="50" r="3" fill="currentColor" opacity="0.5" />
    </svg>
  );
};

// ──────────────────────────────────────────────
// Clock icon (inline SVG to avoid lucide in isolation)
// ──────────────────────────────────────────────
const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// ──────────────────────────────────────────────
// Rank tier calculation from duration (seconds)
// ──────────────────────────────────────────────
const getScrollTier = (durationSeconds) => {
  const mins = durationSeconds / 60;
  if (mins >= 50) return 'S';
  if (mins >= 25) return 'B';
  return 'D';
};

// ──────────────────────────────────────────────
// Format helpers
// ──────────────────────────────────────────────
const formatDuration = (seconds) => {
  const m = Math.floor(seconds / 60);
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const rm = m % 60;
    return rm > 0 ? `${h}h ${rm}m` : `${h}h`;
  }
  return `${m}m`;
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatDateVertical = (dateStr) => {
  const d = new Date(dateStr);
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = d.getDate();
  return { month, day };
};

// ──────────────────────────────────────────────
// JUTSU SCROLL — Single scroll item
// ──────────────────────────────────────────────
const JutsuScroll = ({ session, index }) => {
  const tier = getScrollTier(session.duration || 0);
  const rank = session.missionRank || 'Unranked';
  const { month, day } = formatDateVertical(session.createdAt);
  
  // Tier-based CSS class
  const tierClass = 
    tier === 'S' ? 'jutsu-scroll--s-rank' :
    tier === 'B' ? 'jutsu-scroll--b-rank' :
    'jutsu-scroll--d-rank';

  return (
    <div
      className={`jutsu-scroll ${tierClass}`}
      style={{ animationDelay: `${index * 60}ms` }}
      title={`${rank}: ${session.missionName || 'Uncategorized Training'}`}
    >
      {/* ── SEALED STATE (visible when collapsed) ── */}
      <div className="jutsu-scroll__sealed">
        {/* Top decoration line */}
        <div className="jutsu-scroll__edge jutsu-scroll__edge--top"></div>
        
        {/* Vertical date */}
        <div className="jutsu-scroll__date-vertical">
          <span className="jutsu-scroll__date-month">{month}</span>
          <span className="jutsu-scroll__date-day">{day}</span>
        </div>
        
        {/* Seal icon */}
        <div className="jutsu-scroll__seal">
          <SealIcon rank={rank} size={26} />
        </div>
        
        {/* Rank badge */}
        <div className="jutsu-scroll__rank-badge">
          {rank.split('-')[0]}
        </div>
        
        {/* Bottom decoration line */}
        <div className="jutsu-scroll__edge jutsu-scroll__edge--bottom"></div>
      </div>

      {/* ── UNROLLED STATE (fades in on hover) ── */}
      <div className="jutsu-scroll__content">
        <div className="jutsu-scroll__content-inner">
          {/* Seal (smaller, inline) */}
          <div className="jutsu-scroll__content-seal">
            <SealIcon rank={rank} size={22} />
          </div>

          {/* Mission details */}
          <div className="jutsu-scroll__details">
            <span className="jutsu-scroll__mission-name">
              {session.missionName || 'Uncategorized Training'}
            </span>
            <div className="jutsu-scroll__meta">
              <span className="jutsu-scroll__meta-rank">{rank}</span>
              <span className="jutsu-scroll__meta-sep">•</span>
              <ClockIcon />
              <span>{formatDuration(session.duration || 0)}</span>
              <span className="jutsu-scroll__meta-sep">•</span>
              <span>{formatDate(session.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────────
// JUTSU LIBRARY — Container with scroll items
// ──────────────────────────────────────────────
export const JutsuLibrary = ({ sessions, mounted }) => {
  return (
    <section className={`lg:col-span-8 bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/60 dark:border-slate-700/50 p-6 md:p-8 rounded-[2.5rem] shadow-lg dark:shadow-[0_10px_40px_rgb(0,0,0,0.3)] flex flex-col gap-6 transition-all duration-700 delay-[700ms] transform hover:-translate-y-1 hover:shadow-xl ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between group">
        <div className="flex items-center gap-3">
          <svg className="text-slate-800 dark:text-slate-200 group-hover:-rotate-12 group-hover:scale-110 transition-transform duration-500" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-200 group-hover:tracking-wide transition-all duration-500">
            Jutsu Library
          </h2>
        </div>
        <span className="text-sm font-bold tracking-wide text-white bg-slate-800 border border-slate-700/50 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] group-hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] group-hover:bg-red-600 transition-all duration-500">
          {sessions.length} Completed
        </span>
      </div>

      {/* Scroll Container */}
      <div className="jutsu-library__grid">
        {sessions.map((session, index) => (
          <JutsuScroll key={session._id || index} session={session} index={index} />
        ))}

        {sessions.length === 0 && (
          <div className="jutsu-library__empty">
            <span>No scrolls written. Break a seal!</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default JutsuLibrary;
