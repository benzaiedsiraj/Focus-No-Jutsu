import React, { useState, useEffect, useRef, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ──────────────────────────────────────────────
// Spinning Sharingan loader SVG
// ──────────────────────────────────────────────
const SharinganSpinner = () => (
  <svg viewBox="0 0 100 100" width="32" height="32" className="kakashi-spinner">
    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(220,38,38,0.3)" strokeWidth="3" />
    <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(220,38,38,0.5)" strokeWidth="2" />
    <circle cx="50" cy="50" r="8" fill="rgba(220,38,38,0.9)" />
    {/* Three tomoe */}
    {[0, 120, 240].map((angle) => (
      <g key={angle} transform={`rotate(${angle} 50 50)`}>
        <circle cx="50" cy="22" r="5" fill="rgba(220,38,38,0.8)" />
        <path d="M50 22 Q55 30 50 36" fill="none" stroke="rgba(220,38,38,0.6)" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    ))}
  </svg>
);

// ──────────────────────────────────────────────
// Send icon
// ──────────────────────────────────────────────
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

// ──────────────────────────────────────────────
// Typing effect hook
// ──────────────────────────────────────────────
const useTypingEffect = (text, speed = 18) => {
  const [displayed, setDisplayed] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayed('');
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    setDisplayed('');
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayed, isTyping };
};

// ──────────────────────────────────────────────
// KAKASHI ADVISOR COMPONENT
// ──────────────────────────────────────────────
const KakashiAdvisor = ({ token, isDark }) => {
  const [task, setTask] = useState('');
  const [advice, setAdvice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResponse, setShowResponse] = useState(false);
  const inputRef = useRef(null);
  const responseRef = useRef(null);

  const { displayed, isTyping } = useTypingEffect(advice, 16);

  // Auto-scroll response container as text types
  useEffect(() => {
    if (responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [displayed]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const trimmed = task.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError('');
    setAdvice('');
    setShowResponse(false);

    try {
      const res = await fetch(`${API_BASE_URL}/api/advisor/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ task: trimmed }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Kakashi-sensei is unavailable.');
      }

      setAdvice(data.advice);
      setShowResponse(true);
    } catch (err) {
      setError(err.message);
      setShowResponse(true);
    } finally {
      setLoading(false);
    }
  }, [task, token, loading]);

  const handleClear = () => {
    setTask('');
    setAdvice('');
    setError('');
    setShowResponse(false);
    inputRef.current?.focus();
  };

  return (
    <section className="kakashi-advisor">
      {/* Header */}
      <div className="kakashi-advisor__header">
        <div className="kakashi-advisor__title-group">
          <div className="kakashi-advisor__avatar-container">
            <img
              src="/kakashi-avatar.png"
              alt="Kakashi Hatake"
              className="kakashi-advisor__avatar"
            />
            <div className="kakashi-advisor__avatar-ring"></div>
          </div>
          <div>
            <h3 className="kakashi-advisor__title">Kakashi Advisor</h3>
            <p className="kakashi-advisor__subtitle">
              {loading ? 'Weaving hand signs...' : 'Task breakdown sensei'}
            </p>
          </div>
        </div>
        {showResponse && (
          <button onClick={handleClear} className="kakashi-advisor__clear-btn" title="New question">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Input Form */}
      {!showResponse && (
        <form onSubmit={handleSubmit} className="kakashi-advisor__form">
          <div className="kakashi-advisor__input-wrap">
            <input
              ref={inputRef}
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="What are you struggling to focus on?"
              maxLength={500}
              disabled={loading}
              className="kakashi-advisor__input"
            />
            <button
              type="submit"
              disabled={loading || !task.trim()}
              className="kakashi-advisor__send-btn"
            >
              {loading ? <SharinganSpinner /> : <SendIcon />}
            </button>
          </div>

          {/* Weaving Signs loader */}
          {loading && (
            <div className="kakashi-advisor__loading">
              <SharinganSpinner />
              <span className="kakashi-advisor__loading-text">
                Weaving Signs
                <span className="kakashi-advisor__dots">
                  <span>.</span><span>.</span><span>.</span>
                </span>
              </span>
            </div>
          )}
        </form>
      )}

      {/* Response Display */}
      {showResponse && (
        <div className="kakashi-advisor__response" ref={responseRef}>
          {error ? (
            <div className="kakashi-advisor__error">
              <span>⚠️</span> {error}
            </div>
          ) : (
            <div className="kakashi-advisor__advice">
              {/* Kakashi's avatar + bubble */}
              <div className="kakashi-advisor__bubble-row">
                <img
                  src="/kakashi-avatar.png"
                  alt="Kakashi"
                  className="kakashi-advisor__bubble-avatar"
                />
                <div className="kakashi-advisor__bubble">
                  <pre className="kakashi-advisor__bubble-text">{displayed}</pre>
                  {isTyping && <span className="kakashi-advisor__cursor">▋</span>}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default KakashiAdvisor;
