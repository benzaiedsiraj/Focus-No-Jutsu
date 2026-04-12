import React, { useState, useEffect } from 'react';
import { Moon, Sun, Play, Pause, RotateCcw, AlertTriangle, Scroll, Flame, Target, ChevronDown, LogOut, Clock } from 'lucide-react';
import { SharinganGraphic } from './components/SharinganGraphic';
import { DynamicBackground } from './components/DynamicBackground';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// -------------------------------------------------------------------------------------------------
// AUTHENTICATION PORTAL (Ninja Academy Login/Register)
// -------------------------------------------------------------------------------------------------
const NinjaAcademyLoginContent = ({ setToken, isDark, setIsDark }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [dynamic404Prompt, setDynamic404Prompt] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || (isRegister && !email)) return setError("Fill in all credentials.");
    
    setError('');
    setDynamic404Prompt(false);
    setLoading(true);
    
    const endpoint = isRegister ? '/api/register' : '/api/login';
    const payload = isRegister ? { username, email, password } : { username, password };
    
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);
        setToken(data.token);
      } else {
        if (!isRegister && res.status === 404) {
           setDynamic404Prompt(true);
        } else {
           setError(data.message);
        }
      }
    } catch (err) {
      setError('Connection to Academy failed. Server offline.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 transition-colors duration-1000 relative overflow-hidden bg-transparent">
      <DynamicBackground isDark={isDark} />

      {/* Ambient Red Glow mapped behind the Card specifically */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] md:w-[90vw] md:h-[90vw] max-w-2xl max-h-2xl rounded-full blur-[140px] opacity-20 dark:opacity-40 pointer-events-none transition-all duration-[2000ms] bg-red-600 animate-[spin_60s_linear_infinite] z-[-1]`}></div>
      
      <div className="relative w-full max-w-md bg-white/70 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl dark:shadow-[0_20px_60px_rgb(0,0,0,0.5)] border border-white/50 dark:border-slate-700/50 p-8 md:p-10 flex flex-col items-center animate-slide-up animate-float-slow duration-1000 z-10">
        <button onClick={() => setIsDark(!isDark)} className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-red-500 hover:rotate-180 transition-all duration-500">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-[3px] border-red-600 flex items-center justify-center mb-5 md:mb-6 shadow-[0_0_20px_rgba(220,38,38,0.5)] group overflow-hidden bg-slate-900">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-600 animate-pulse group-hover:scale-125 group-hover:bg-red-500 transition-transform group-hover:animate-[spin_4s_linear_infinite]"></div>
        </div>

        <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight mb-1 transition-all duration-300">Ninja Academy</h2>
        <p className="text-xs md:text-sm font-semibold tracking-wide text-slate-500 uppercase mb-6 md:mb-8 text-center transition-all">
          {isRegister ? 'Enroll as a new student' : 'Authenticate your chakra'}
        </p>

        {dynamic404Prompt && (
          <div className="w-full bg-red-500/10 dark:bg-red-500/5 border border-red-500/30 text-red-600 dark:text-red-400 rounded-2xl p-5 mb-6 text-center animate-slide-up shadow-sm">
            <p className="font-bold text-sm mb-4 leading-relaxed tracking-wide">Ninja not found in the academy.<br/>Please sign up first.</p>
            <button 
              type="button" 
              onClick={() => { setIsRegister(true); setDynamic404Prompt(false); setError(''); }} 
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/30 hover:shadow-red-500/50 hover:-translate-y-1 active:scale-[0.98] text-white font-black text-sm tracking-wide transition-all duration-300"
            >
              Switch to Sign Up
            </button>
          </div>
        )}

        {error && <div className="w-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-bold px-4 py-3 rounded-xl mb-6 text-center animate-slide-up">{error}</div>}

        {!dynamic404Prompt && (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div className="relative group">
              <input 
                type="text" placeholder={isRegister ? "Ninja Alias (Username)" : "Ninja Alias or Email"} value={username} onChange={e => setUsername(e.target.value)}
                className="w-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-4 py-3.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 group-hover:border-red-400/50 focus:-translate-y-1 focus:shadow-[0_10px_30px_rgb(220,38,38,0.1)] transition-all duration-300 font-bold placeholder:font-medium placeholder:text-slate-400"
              />
            </div>
            
            {isRegister && (
              <div className="relative group animate-slide-up">
                <input 
                  type="email" placeholder="Shinobi Network Email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-4 py-3.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 group-hover:border-red-400/50 focus:-translate-y-1 focus:shadow-[0_10px_30px_rgb(220,38,38,0.1)] transition-all duration-300 font-bold placeholder:font-medium placeholder:text-slate-400"
                />
              </div>
            )}
            
            <div className="relative group">
              <input 
                type="password" placeholder="Passcode (Min 6 chars)" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 rounded-xl px-4 py-3.5 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 group-hover:border-red-400/50 focus:-translate-y-1 focus:shadow-[0_10px_30px_rgb(220,38,38,0.1)] transition-all duration-300 font-bold placeholder:font-medium placeholder:text-slate-400"
              />
            </div>
            
            <button disabled={loading} type="submit" className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-[0_5px_15px_rgba(220,38,38,0.25)] hover:shadow-[0_15px_30px_rgba(220,38,38,0.4)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] transition-all duration-300 mt-2 tracking-wide group overflow-hidden relative">
              <span className="relative z-10 flex justify-center items-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div> : null}
                {loading ? 'Channeling Chakra...' : (isRegister ? 'Establish Contract' : 'Break Seal (Login)')}
              </span>
            </button>
          </form>
        )}

        <button onClick={() => { setIsRegister(!isRegister); setError(''); setDynamic404Prompt(false); }} className="mt-8 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500 transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-red-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 z-10">
          {isRegister ? "Already enrolled? Break seal instead." : "No contract? Enroll natively."}
        </button>
      </div>

      <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[0.65rem] font-black tracking-[0.2em] uppercase text-slate-400/60 dark:text-zinc-500/50 hover:text-red-500/80 transition-colors duration-500 z-10 select-none text-center w-full">
        Designed & Built by Siraj Benzaied 2026
      </footer>

    </div>
  );
};


// -------------------------------------------------------------------------------------------------
// MAIN DASHBOARD APP PORTAL
// -------------------------------------------------------------------------------------------------
function App() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const activeUser = localStorage.getItem('username') || 'Ninja';

  const [showResetModal, setShowResetModal] = useState(false);
  const [sessions, setSessions] = useState([]);

  const [taskName, setTaskName] = useState('');
  const [missionRank, setMissionRank] = useState('D-Rank');
  const [streak, setStreak] = useState(0);
  const ranks = ['D-Rank', 'C-Rank', 'B-Rank', 'A-Rank', 'S-Rank'];

  const RAMEN_TIME = 300;     // 5 minute break 
  const timeOptions = [
    { label: '1 Min (Quick Test)', value: 60 },
    { label: '5 Min (Genin)', value: 300 },
    { label: '15 Min (Chunin)', value: 900 },
    { label: '25 Min (Jonin)', value: 1500 },
    { label: '60 Min (Kage)', value: 3600 },
  ];

  const [trainingTime, setTrainingTime] = useState(60); 

  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  const currentTotal = isBreak ? RAMEN_TIME : trainingTime;
  const percentage = timeLeft / currentTotal;
  let graphicStage = 0;
  
  if (isBreak) graphicStage = 3; 
  else {
    if (percentage <= 0.25) graphicStage = 3;      
    else if (percentage <= 0.50) graphicStage = 2; 
    else if (percentage <= 0.75) graphicStage = 1; 
    else graphicStage = 0;                         
  }

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && isSystemDark)) setIsDark(true);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    if (!isRunning && !isBreak) {
      setTimeLeft(trainingTime);
    }
  }, [trainingTime, isRunning, isBreak]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setSessions([]);
    setStreak(0);
  };

  const calculateStreak = (sessionsData) => {
    if (!sessionsData || sessionsData.length === 0) return 0;
    const dates = sessionsData.map(s => {
      const d = new Date(s.createdAt);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    });
    const uniqueDates = [...new Set(dates)].sort((a,b) => b - a);
    const today = new Date();
    const todayTime = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const yesterdayTime = todayTime - 86400000;
    
    let currentStreak = 0;
    let expectedTime = todayTime;
    if (uniqueDates[0] === todayTime) {
       currentStreak = 1;
       expectedTime = todayTime - 86400000;
    } else if (uniqueDates[0] === yesterdayTime) {
       currentStreak = 1;
       expectedTime = yesterdayTime - 86400000;
    } else return 0; 
    for (let i = 1; i < uniqueDates.length; i++) {
       if (uniqueDates[i] === expectedTime) { currentStreak++; expectedTime -= 86400000; } 
       else break;
    }
    return currentStreak;
  };

  const fetchSessions = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
         setSessions(data.data);
         setStreak(calculateStreak(data.data));
      }
    } catch (err) { }
  };

  useEffect(() => { if (token) fetchSessions(); }, [token]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => { setTimeLeft(time => time - 1); }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (!isBreak) {
        const saveSession = async () => {
          if (!token) return;
          try {
             await fetch(`${API_BASE_URL}/api/sessions`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ plantType: 'Mangekyou Awakening', missionName: taskName.trim() === '' ? 'Uncategorized Training' : taskName, missionRank: missionRank })
            });
            fetchSessions();
          } catch (err) { }
        };
        saveSession();
        setIsBreak(true); setTimeLeft(RAMEN_TIME);
      } else {
        setIsBreak(false); setTimeLeft(trainingTime);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, token, taskName, missionRank, trainingTime]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getRankColors = (rank) => {
    switch(rank) {
      case 'S-Rank': return 'text-red-600 dark:text-red-500 border-red-500/50 bg-red-50/80 dark:bg-red-950/40 hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] md:col-span-2 aspect-auto';
      case 'A-Rank': return 'text-orange-500 border-orange-500/50 bg-orange-50/80 dark:bg-orange-950/30 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:border-orange-500';
      case 'B-Rank': return 'text-purple-600 dark:text-purple-400 border-purple-500/40 bg-purple-50/80 dark:bg-purple-900/20 hover:border-purple-500/60 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]';
      case 'C-Rank': return 'text-blue-500 border-blue-500/30 bg-blue-50/80 dark:bg-blue-900/20 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]';
      case 'D-Rank': return 'text-emerald-500 border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-900/20 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]';
      default: return 'text-slate-500 border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/50 hover:shadow-lg';
    }
  };

  if (!token) return <NinjaAcademyLoginContent setToken={setToken} isDark={isDark} setIsDark={setIsDark} />;

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-500 ease-in-out selection:bg-red-500/20 relative overflow-hidden bg-transparent">
      
      {/* GLOBAL BACKGROUND INJECTION LAYER */}
      <DynamicBackground isDark={isDark} />

      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowResetModal(false)}></div>
          <div className="relative w-full max-w-sm bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 border border-white/20 dark:border-slate-800 flex flex-col items-center text-center gap-6 animate-slide-up duration-500">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-red-600 shadow-inner animate-[spin_3s_linear_infinite]">
                <AlertTriangle size={32} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-slate-800 dark:text-zinc-100 mb-2">Abandon Mission?</h3>
                <p className="text-[0.93rem] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  Your chakra is still flowing! If you retreat now, your jutsu progress will be scattered to the wind.
                </p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button onClick={() => { setShowResetModal(false); setIsRunning(true); }} className="flex-[1.2] py-3.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all font-semibold duration-300 hover:-translate-y-1">
                  Keep Focusing
                </button>
                <button onClick={() => { setShowResetModal(false); setIsRunning(false); setTimeLeft(isBreak ? RAMEN_TIME : trainingTime); }} className="flex-1 py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-[0_5px_15px_rgba(220,38,38,0.3)] hover:shadow-[0_15px_30px_rgba(220,38,38,0.5)] hover:-translate-y-1 active:scale-[0.93] transition-all font-semibold tracking-wide duration-300">
                  Retreat
                </button>
              </div>
          </div>
        </div>
      )}

      <header className="p-6 md:px-8 md:pt-10 md:pb-6 flex justify-between items-center w-full max-w-6xl mx-auto z-10 relative">
        <h1 className={`text-2xl font-black tracking-tight text-slate-800 dark:text-slate-50 flex items-center gap-3 group select-none transition-all duration-700 transform ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <div className="relative flex items-center justify-center">
            <div className={`absolute inset-0 blur-md opacity-40 dark:opacity-60 rounded-full group-hover:scale-[1.5] group-hover:opacity-100 animate-pulse-glow transition-all duration-700 ${isBreak ? 'bg-orange-500' : 'bg-red-600'}`}></div>
            <span className={`relative w-4 h-4 rounded-full border-[2.5px] border-white dark:border-zinc-950 group-hover:animate-[spin_4s_linear_infinite] transition-colors duration-500 ${isBreak ? 'bg-orange-500' : 'bg-red-600'}`}></span>
          </div>
          Focus No Jutsu
        </h1>
        
        <div className={`flex items-center gap-3 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
          <span className="hidden sm:inline-block font-bold text-slate-500 px-2 tracking-wide uppercase text-sm border-r border-slate-300 dark:border-slate-700 mr-1 opacity-70 hover:opacity-100 transition-opacity">
            Ninja: <span className="text-red-500">{activeUser}</span>
          </span>
          <button onClick={handleLogout} className="p-3 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-md text-slate-500 dark:text-slate-400 hover:text-red-500 transition-all duration-300 border border-white/40 dark:border-slate-700/50 hover:bg-white hover:shadow-[0_5px_20px_rgba(220,38,38,0.15)] hover:-translate-y-1 active:scale-95">
            <LogOut size={20} strokeWidth={2.5} />
          </button>
          <button onClick={() => setIsDark(!isDark)} className="p-3 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-md text-slate-500 dark:text-slate-400 hover:text-red-500 transition-all duration-300 border border-white/40 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 hover:shadow-[0_5px_20px_rgba(255,255,255,0.1)] hover:-translate-y-1 hover:rotate-12 active:scale-95">
            {isDark ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col p-4 md:p-6 w-full max-w-6xl mx-auto mb-16 z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 w-full relative">
          
          <div className={`absolute top-10 left-10 right-10 bottom-10 blur-[120px] opacity-[0.03] dark:opacity-[0.07] z-[-1] pointer-events-none transition-colors duration-[2000ms] ${isBreak ? 'bg-orange-600' : 'bg-red-600'}`}></div>

          <section className={`lg:col-span-8 relative group w-full transition-all duration-700 delay-[150ms] ease-out transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className={`absolute -inset-[1px] blur-xl opacity-0 xl:group-hover:opacity-40 transition-all duration-1000 rounded-[2.5rem] bg-gradient-to-br ${isBreak ? 'from-orange-500/20 to-transparent' : 'from-red-600/30 to-transparent'}`}></div>
            
            <div className="relative h-full min-h-[460px] p-8 md:p-14 bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-white/60 dark:border-slate-700/50 flex flex-col items-center justify-center gap-6 md:gap-8 z-10 transition-all duration-700 hover:bg-white/80 dark:hover:bg-slate-900/60 animate-float">
              
              <div className={`text-sm font-black tracking-widest uppercase transition-colors duration-500 ${isBreak ? 'text-orange-500 animate-bounce' : 'text-slate-400 dark:text-slate-500'}`}>
                {isBreak ? 'Ichiraku Ramen Time' : 'Focus Mode Active'}
              </div>

              <div className="relative flex justify-center items-center w-full group-hover:scale-[1.02] transition-transform duration-700">
                <div className={`absolute w-32 h-32 md:w-44 md:h-44 rounded-full blur-2xl opacity-10 dark:opacity-20 transition-all duration-[2000ms] ${isRunning && !isBreak && 'animate-pulse opacity-40 dark:opacity-50'} ${isBreak ? 'bg-orange-500' : 'bg-red-600'}`}></div>
                <div className={`${isRunning ? 'animate-[spin_60s_linear_infinite]' : ''} transition-all duration-1000`}>
                  <SharinganGraphic stage={graphicStage} isBreak={isBreak} />
                </div>
              </div>

              <div className={`text-[6rem] md:text-[8rem] mt-[-10px] font-black tracking-tighter tabular-nums drop-shadow-sm leading-none flex items-center justify-center select-none transition-colors duration-500 hover:scale-105 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {formatTime(timeLeft)}
              </div>

              <div className="flex gap-4 w-full max-w-[280px] justify-center mt-2 group-hover:-translate-y-2 transition-transform duration-700">
                <button 
                  onClick={() => setIsRunning(!isRunning)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4.5 px-6 rounded-2xl shadow-xl hover:scale-105 hover:-translate-y-1 active:scale-[0.96] transition-all duration-300 ease-out font-bold tracking-wide text-[1.05rem] text-white ${isBreak ? "bg-orange-500 hover:bg-orange-400 shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:shadow-[0_15px_40px_rgba(249,115,22,0.5)]" : "bg-red-600 hover:bg-red-500 shadow-[0_10px_30px_rgba(220,38,38,0.3)] hover:shadow-[0_15px_40px_rgba(220,38,38,0.5)]"}`}
                >
                  {isRunning ? <><Pause className="animate-pulse" size={20} fill="currentColor" /> Pause</> : <><Play size={20} fill="currentColor" className="hover:animate-pulse" /> {isBreak ? 'Eat Ramen' : 'Begin'}</>}
                </button>
                
                <button 
                  onClick={() => {
                    if (isRunning) { setIsRunning(false); setShowResetModal(true); }
                    else if (timeLeft < currentTotal) setShowResetModal(true);
                  }}
                  className="flex-none p-4.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-slate-700 hover:text-red-500 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/50 shadow-sm hover:shadow-[0_10px_20px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)] hover:scale-110 hover:-translate-y-1 hover:-rotate-12 active:scale-90 transition-all duration-300 border border-white/60 dark:border-slate-700/50"
                >
                  <RotateCcw size={22} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </section>

          <div className="lg:col-span-4 flex flex-col gap-5 md:gap-6 w-full">
            
            <section className={`bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/60 dark:border-slate-700/50 flex items-center justify-between p-6 md:p-8 rounded-[2rem] shadow-lg dark:shadow-[0_10px_40px_rgb(0,0,0,0.3)] hover:-translate-y-2 hover:shadow-xl transition-all duration-700 delay-300 transform group cursor-default ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold tracking-widest text-slate-400 uppercase transition-colors group-hover:text-slate-500">Ninja Way</span>
                <span className="text-xl font-bold text-slate-800 dark:text-white">Daily Streak</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/80 p-3 px-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 transition-colors group-hover:border-orange-500/30">
                <Flame className={`transition-all duration-500 ${streak > 0 ? 'text-orange-500 fill-orange-500/20 animate-pulse' : 'text-slate-400'} group-hover:scale-125`} size={24} />
                <span className={`text-2xl font-black tabular-nums transition-colors duration-500 ${streak > 0 ? 'text-orange-500 ' : 'text-slate-400'} group-hover:scale-110`}>{streak}</span>
              </div>
            </section>

            <section className={`flex-1 bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/60 dark:border-slate-700/50 p-6 md:p-8 rounded-[2rem] shadow-lg dark:shadow-[0_10px_40px_rgb(0,0,0,0.3)] flex flex-col gap-5 transition-all duration-700 delay-500 transform hover:-translate-y-1 hover:shadow-xl ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
              <div className="flex items-center gap-3 text-slate-800 dark:text-white pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
                <Target className="text-red-500 hover:rotate-180 transition-transform duration-700" size={20} />
                <h3 className="font-bold text-lg tracking-tight">Mission Desk</h3>
              </div>
              
              <div className="flex flex-col gap-2.5 mt-1 group">
                <label className="text-[0.7rem] font-black text-slate-500 uppercase tracking-wider transition-colors group-focus-within:text-red-500">Focus Objective</label>
                <input 
                  type="text"
                  placeholder="e.g. Master React Hooks"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 focus:-translate-y-1 focus:shadow-md transition-all duration-300 font-medium text-sm"
                />
              </div>

              <div className="flex gap-4 flex-grow justify-end mt-1">
                <div className="flex flex-col gap-2.5 flex-1 group">
                  <label className="text-[0.7rem] font-black text-slate-500 uppercase tracking-wider transition-colors group-focus-within:text-red-500">Rank</label>
                  <div className="relative hover:scale-[1.03] focus-within:-translate-y-1 focus-within:shadow-md transition-all duration-300 rounded-xl">
                    <select 
                      value={missionRank}
                      onChange={(e) => setMissionRank(e.target.value)}
                      className="w-full appearance-none bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-slate-800 dark:text-white font-bold text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all pr-8 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      {ranks.map(r => <option key={r} value={r} className="font-bold">{r}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:rotate-180 transition-transform duration-300" size={16} strokeWidth={3} />
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 flex-1 group">
                  <label className="text-[0.7rem] font-black text-slate-500 uppercase tracking-wider transition-colors group-focus-within:text-red-500">Time</label>
                  <div className="relative hover:scale-[1.03] focus-within:-translate-y-1 focus-within:shadow-md transition-all duration-300 rounded-xl">
                    <select 
                      value={trainingTime}
                      onChange={(e) => setTrainingTime(Number(e.target.value))}
                      disabled={isRunning || isBreak}
                      className="w-full appearance-none bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-slate-800 dark:text-white font-bold text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all pr-8 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      {timeOptions.map(opt => <option key={opt.value} value={opt.value} className="font-bold">{opt.label}</option>)}
                    </select>
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:animate-[spin_2s_linear_infinite]" size={16} strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </section>

          </div>

          <section className={`lg:col-span-12 bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl border border-white/60 dark:border-slate-700/50 p-6 md:p-8 rounded-[2.5rem] shadow-lg dark:shadow-[0_10px_40px_rgb(0,0,0,0.3)] flex flex-col gap-6 transition-all duration-700 delay-[700ms] transform hover:-translate-y-1 hover:shadow-xl ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <Scroll className="text-slate-800 dark:text-slate-200 group-hover:-rotate-12 group-hover:scale-110 transition-transform duration-500" size={24} />
                <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-200 group-hover:tracking-wide transition-all duration-500">
                  Jutsu Library
                </h2>
              </div>
              <span className="text-sm font-bold tracking-wide text-white bg-slate-800 border border-slate-700/50 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.1)] group-hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] group-hover:bg-red-600 transition-all duration-500">
                {sessions.length} Completed
              </span>
            </div>
            
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4 p-6 rounded-[2rem] border-[1.5px] border-dashed border-slate-300/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 min-h-[160px] content-start">
              
              {sessions.map((session, index) => {
                const rankTheme = getRankColors(session.missionRank || 'Unranked');
                return (
                  <div 
                    key={session._id || index}
                    style={{ animationDelay: `${index * 80}ms` }}
                    className={`aspect-square rounded-[1.25rem] border flex flex-col items-center justify-center hover:-translate-y-2 hover:scale-[1.12] hover:rotate-3 hover:z-10 transition-all duration-300 cursor-default group relative overflow-hidden animate-slide-up opacity-0 shadow-sm ${rankTheme}`}
                    title={`${session.missionRank || 'Unranked'} Mission: ${session.missionName || 'Uncategorized Training'}`}
                  >
                    <div className="absolute top-1.5 right-2 text-[0.6rem] font-black opacity-30 select-none pointer-events-none group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                      {session.missionRank?.split('-')[0] || ''}
                    </div>
                    <Scroll className="opacity-80 group-hover:opacity-100 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-500" strokeWidth={2} size={30} />
                  </div>
                );
              })}
              
              {sessions.length === 0 && (
                <div className="col-span-full pt-4 pb-2 text-center flex flex-col justify-center items-center gap-2 opacity-50">
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest animate-pulse">
                    No scrolls written. Break a seal!
                  </span>
                </div>
              )}

            </div>
          </section>

        </div>
      </main>

      <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[0.65rem] font-black tracking-[0.2em] uppercase text-slate-400/80 dark:text-zinc-500/80 hover:text-red-500 transition-colors duration-500 z-10 select-none text-center w-full shadow-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        Designed & Built by Siraj Benzaied 2026
      </footer>

    </div>
  );
}

export default App;
