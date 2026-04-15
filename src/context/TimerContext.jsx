import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const TimerContext = createContext(null);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const RAMEN_TIME = 300; // 5 minute break

export const TimerProvider = ({ children, token, trainingTime, taskName, missionRank, onTimerComplete, onBreakComplete, onFetchSessions }) => {
  const [timeLeft, setTimeLeft] = useState(trainingTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  // Refs to keep the latest callback/prop values accessible inside setInterval closures
  const onTimerCompleteRef = useRef(onTimerComplete);
  const onBreakCompleteRef = useRef(onBreakComplete);
  const tokenRef = useRef(token);
  const taskNameRef = useRef(taskName);
  const missionRankRef = useRef(missionRank);
  const trainingTimeRef = useRef(trainingTime);

  useEffect(() => { onTimerCompleteRef.current = onTimerComplete; }, [onTimerComplete]);
  useEffect(() => { onBreakCompleteRef.current = onBreakComplete; }, [onBreakComplete]);
  useEffect(() => { tokenRef.current = token; }, [token]);
  useEffect(() => { taskNameRef.current = taskName; }, [taskName]);
  useEffect(() => { missionRankRef.current = missionRank; }, [missionRank]);
  useEffect(() => { trainingTimeRef.current = trainingTime; }, [trainingTime]);

  // Sync timeLeft when trainingTime prop changes (user picked a new duration)
  const prevTrainingTimeRef = useRef(trainingTime);
  useEffect(() => {
    if (prevTrainingTimeRef.current !== trainingTime) {
      prevTrainingTimeRef.current = trainingTime;
      if (!isRunning && !isBreak) {
        setTimeLeft(trainingTime);
      }
    }
  }, [trainingTime]);

  // ---- CORE TIMER INTERVAL ----
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => { setTimeLeft(t => t - 1); }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);

      if (!isBreak) {
        // Focus session completed -> fire callback for sounds/session save
        if (onTimerCompleteRef.current) onTimerCompleteRef.current();

        // Save session to API
        const saveSession = async () => {
          if (!tokenRef.current) return;
          try {
            await fetch(`${API_BASE_URL}/api/sessions`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenRef.current}` },
              body: JSON.stringify({
                plantType: 'Mangekyou Awakening',
                missionName: taskNameRef.current.trim() === '' ? 'Uncategorized Training' : taskNameRef.current,
                missionRank: missionRankRef.current,
                duration: trainingTimeRef.current
              })
            });
            if (onFetchSessions) onFetchSessions();
          } catch (err) { /* network error silenced */ }
        };
        saveSession();
        setIsBreak(true);
        setTimeLeft(RAMEN_TIME);
      } else {
        // Break completed -> return to focus mode
        if (onBreakCompleteRef.current) onBreakCompleteRef.current();
        setIsBreak(false);
        setTimeLeft(trainingTimeRef.current);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak]);

  const toggleRunning = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(isBreak ? RAMEN_TIME : trainingTimeRef.current);
  }, [isBreak]);

  const skipBreak = useCallback(() => {
    setIsBreak(false);
    setIsRunning(false);
    setTimeLeft(trainingTimeRef.current);
  }, []);

  const formatTime = useCallback((seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }, []);

  const currentTotal = isBreak ? RAMEN_TIME : trainingTime;
  const percentage = timeLeft / currentTotal;

  const value = {
    timeLeft,
    isRunning,
    isBreak,
    trainingTime,
    currentTotal,
    percentage,
    RAMEN_TIME,
    toggleRunning,
    resetTimer,
    skipBreak,
    formatTime,
    setIsRunning,
    setIsBreak,
    setTimeLeft,
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimer must be used within a TimerProvider');
  return ctx;
};

export default TimerContext;
