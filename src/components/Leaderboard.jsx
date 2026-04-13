import React from 'react';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

export const Leaderboard = ({ data = [], activeUser, isDark }) => {
  // Safe extraction for Podium parsing
  const first = data[0];
  const second = data[1];
  const third = data[2];
  
  const rest = data.slice(3, 10);

  // Helper to render a Podium Block
  const PodiumBlock = ({ user, place, height, colors, ring }) => {
    if (!user) return <div className={`w-24 ${height} opacity-10 flex-none`}></div>; // Placeholder if not enough users
    
    const isMe = user.username === activeUser;
    
    return (
      <div className={`relative flex flex-col items-center justify-end z-10 ${place === 1 ? 'order-2 z-20' : place === 2 ? 'order-1' : 'order-3'}`}>
        <div className="absolute -top-10 flex flex-col items-center gap-1 z-30">
          {place === 1 ? <Crown className="text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)] animate-pulse" size={32} /> : 
           place === 2 ? <Medal className="text-slate-400 drop-shadow-[0_0_8px_rgba(148,163,184,0.6)]" size={26} /> : 
                         <Award className="text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]" size={24} />}
          <span className={`text-xs font-black truncate max-w-[80px] drop-shadow-md ${isMe ? 'text-red-500' : (isDark ? 'text-white' : 'text-slate-800')}`}>
            {user.username}
          </span>
          <span className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest">{user.totalSessions} Sess</span>
        </div>
        
        <div className={`w-20 md:w-24 ${height} ${colors} rounded-t-2xl flex items-start justify-center pt-3 shadow-[0_0_30px_rgba(0,0,0,0.1)] relative overflow-hidden transition-all duration-500 hover:brightness-110 ${isMe ? `ring-2 ring-offset-2 ${ring} ring-offset-transparent shadow-[0_0_40px_currentColor] animate-pulse` : ''}`}>
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
          <span className="text-4xl font-black text-white/40 mix-blend-overlay drop-shadow-sm">{place}</span>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/60 dark:border-slate-700/50 rounded-[2.5rem] shadow-lg dark:shadow-[0_10px_40px_rgb(0,0,0,0.3)] flex flex-col transition-all duration-700 hover:-translate-y-1 hover:shadow-xl w-full h-full overflow-hidden relative">
      
      {/* Header */}
      <div className="flex items-center gap-3 text-slate-800 dark:text-white p-6 md:p-8 pb-4 z-10 border-b border-slate-200/50 dark:border-slate-800/50">
        <Trophy className="text-yellow-500 group-hover:rotate-12 transition-transform duration-700 drop-shadow-sm" size={24} />
        <h3 className="font-black text-xl tracking-tight uppercase">Chunin Exams Global Top 10</h3>
      </div>

      {/* Podium Section */}
      <div className="flex-none pt-20 pb-4 px-4 flex justify-center items-end gap-2 md:gap-4 border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/20">
        <PodiumBlock user={second} place={2} height="h-28 md:h-32" colors="bg-gradient-to-b from-slate-400 to-slate-600" ring="ring-slate-400" />
        <PodiumBlock user={first} place={1} height="h-40 md:h-44" colors="bg-gradient-to-b from-yellow-500 via-orange-500 to-red-600" ring="ring-yellow-500" />
        <PodiumBlock user={third} place={3} height="h-20 md:h-24" colors="bg-gradient-to-b from-amber-600 to-orange-800" ring="ring-amber-600" />
      </div>

      {/* Scrollable Rest of the Pack */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 custom-scrollbar flex flex-col gap-3">
        {rest.length > 0 ? rest.map((user, idx) => {
          const rank = idx + 4;
          const isMe = user.username === activeUser;
          return (
            <div 
              key={`${user.username}-${rank}`} 
              className={`flex items-center justify-between p-3.5 px-5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border transition-all duration-300 transform hover:-translate-y-1 hover:translate-x-1 hover:shadow-md ${isMe ? 'border-red-500 ring-1 ring-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.2)] bg-red-50/30 dark:bg-red-950/30' : 'border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600'}`}
            >
              <div className="flex items-center gap-4">
                <span className="w-6 text-center font-black text-slate-400 dark:text-slate-500">{rank}</span>
                <span className={`font-bold text-sm tracking-wide ${isMe ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
                  {user.username} {isMe && <span className="text-[0.6rem] ml-2 px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400">YOU</span>}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-black uppercase text-slate-400">{user.totalSessions} Sess</span>
                <span className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 min-w-[3rem] text-center">
                  {user.totalHours?.toFixed(1)}h
                </span>
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-6 text-slate-400 text-sm font-bold animate-pulse">Waiting for more participants...</div>
        )}
      </div>

    </section>
  );
};
