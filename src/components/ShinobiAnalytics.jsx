import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GraduationCap, Swords, Shield, Crown, Star, Activity } from 'lucide-react';

export const ShinobiAnalytics = ({ stats, isDark }) => {
  const { allTimeHours = 0, weeklyData = [] } = stats || {};

  const getRankInfo = (hours) => {
    if (hours < 5) return { title: 'Academy Student', icon: GraduationCap, color: 'text-emerald-500', glow: 'shadow-emerald-500/50' };
    if (hours < 20) return { title: 'Genin', icon: Swords, color: 'text-blue-500', glow: 'shadow-blue-500/50' };
    if (hours < 50) return { title: 'Chunin', icon: Shield, color: 'text-purple-500', glow: 'shadow-purple-500/50' };
    if (hours < 100) return { title: 'Jonin', icon: Crown, color: 'text-orange-500', glow: 'shadow-orange-500/50' };
    return { title: 'Kage', icon: Star, color: 'text-red-600', glow: 'shadow-red-600/50' };
  };

  const rank = getRankInfo(allTimeHours);
  const RankIcon = rank.icon;

  const barColor = isDark ? '#dc2626' : '#f97316';
  const barHoverColor = isDark ? '#f87171' : '#fb923c';

  return (
    <section className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/60 dark:border-slate-700/50 p-6 md:p-8 rounded-[2rem] shadow-lg dark:shadow-[0_10px_40px_rgb(0,0,0,0.3)] flex flex-col gap-6 transition-all duration-700 hover:-translate-y-1 hover:shadow-xl w-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-3 text-slate-800 dark:text-white">
          <Activity className="text-red-500 hover:rotate-12 transition-transform duration-700" size={24} />
          <h3 className="font-black text-xl tracking-tight">Shinobi Analytics</h3>
        </div>
        
        {/* Rank Display */}
        <div className="flex items-center gap-3 group cursor-default">
          <div className="flex flex-col items-end">
            <span className="text-[0.65rem] font-black text-slate-500 uppercase tracking-widest transition-colors group-hover:text-amber-500">Current Rank</span>
            <span className={`text-lg font-black tracking-wide ${rank.color} drop-shadow-[0_0_8px_currentColor]`}>{rank.title}</span>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 shadow-lg ${rank.glow} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
            <RankIcon className={rank.color} size={24} strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Focus Time Graph */}
      <div className="flex-1 min-h-[220px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: isDark ? '#94a3b8' : '#64748b' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: isDark ? '#94a3b8' : '#64748b' }} />
            <Tooltip 
              cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
              contentStyle={{ borderRadius: '1rem', border: 'none', backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', color: isDark ? '#fff' : '#1e293b', fontWeight: 'bold' }}
              labelStyle={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '4px' }}
              formatter={(value) => [`${value} mins`, 'Focus Time']}
            />
            <Bar dataKey="minutes" radius={[6, 6, 0, 0]} maxBarSize={40}>
              {weeklyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.minutes > 0 ? barColor : (isDark ? '#334155' : '#cbd5e1')} className="hover:opacity-80 transition-opacity duration-300 cursor-pointer" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Summary */}
      <div className="flex justify-between items-center bg-slate-100/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="flex flex-col">
          <span className="text-[0.7rem] font-black text-slate-500 uppercase tracking-widest">Total Focused</span>
          <span className="text-xl font-black text-slate-800 dark:text-white tabular-nums">{allTimeHours.toFixed(1)} <span className="text-sm font-bold text-slate-500">Hrs</span></span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[0.7rem] font-black text-slate-500 uppercase tracking-widest">7-Day Peak</span>
          <span className="text-xl font-black text-slate-800 dark:text-white tabular-nums">
             {Math.max(0, ...weeklyData.map(d => d.minutes))} <span className="text-sm font-bold text-slate-500">Mins</span>
          </span>
        </div>
      </div>
    </section>
  );
};
