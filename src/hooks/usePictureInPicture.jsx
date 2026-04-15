import { useState, useRef, useCallback, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { TimerProvider } from '../context/TimerContext';
import MiniPlayer from '../components/MiniPlayer';

/**
 * Custom hook for managing the Document Picture-in-Picture window lifecycle.
 * 
 * When PiP is supported:  Opens a real always-on-top browser window with the MiniPlayer.
 * When PiP is not supported: Sets a flag so the parent can render an in-tab draggable fallback.
 * 
 * IMPORTANT: The PiP window mounts its own React root, but shares the same TimerContext values
 *            via a "bridged" TimerProvider that receives the live state from the main app.
 */
export const usePictureInPicture = (timerContextValue) => {
  const isPipSupported = typeof window !== 'undefined' && 'documentPictureInPicture' in window;
  const [isPipOpen, setIsPipOpen] = useState(false);
  const pipWindowRef = useRef(null);
  const pipRootRef = useRef(null);

  // Render (or re-render) the MiniPlayer inside the PiP window whenever context values change
  const renderPipContent = useCallback((pipWindow, contextValue) => {
    if (!pipRootRef.current) return;
    const closePipFn = () => {
      if (pipWindow && !pipWindow.closed) pipWindow.close();
    };
    pipRootRef.current.render(
      <BridgedTimerProvider value={contextValue}>
        <PipBody>
          <MiniPlayer onClose={closePipFn} mode="pip" />
        </PipBody>
      </BridgedTimerProvider>
    );
  }, []);

  // Re-render PiP content when timer context values change
  useEffect(() => {
    if (isPipOpen && pipWindowRef.current && !pipWindowRef.current.closed && pipRootRef.current) {
      renderPipContent(pipWindowRef.current, timerContextValue);
    }
  }, [timerContextValue, isPipOpen, renderPipContent]);

  const openPip = useCallback(async () => {
    if (!isPipSupported) {
      // Fallback: just toggle the inline overlay on
      setIsPipOpen(true);
      return;
    }

    // If already open, focus it
    if (pipWindowRef.current && !pipWindowRef.current.closed) {
      pipWindowRef.current.focus();
      return;
    }

    try {
      const pipWindow = await window.documentPictureInPicture.requestWindow({
        width: 340,
        height: 110,
      });

      pipWindowRef.current = pipWindow;

      // Inject minimal styles into the PiP window
      const style = pipWindow.document.createElement('style');
      style.textContent = getPipStyles();
      pipWindow.document.head.appendChild(style);

      // Add Inter font
      const fontLink = pipWindow.document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap';
      pipWindow.document.head.appendChild(fontLink);

      // Create React root
      const container = pipWindow.document.createElement('div');
      container.id = 'pip-root';
      pipWindow.document.body.appendChild(container);
      pipRootRef.current = createRoot(container);

      // Initial render
      renderPipContent(pipWindow, timerContextValue);
      setIsPipOpen(true);

      // Cleanup on PiP window close
      pipWindow.addEventListener('pagehide', () => {
        if (pipRootRef.current) {
          pipRootRef.current.unmount();
          pipRootRef.current = null;
        }
        pipWindowRef.current = null;
        setIsPipOpen(false);
      });
    } catch (err) {
      console.error('Failed to open PiP window:', err);
      // If user dismissed the PiP prompt, fall back to inline
      setIsPipOpen(true);
    }
  }, [isPipSupported, timerContextValue, renderPipContent]);

  const closePip = useCallback(() => {
    if (pipWindowRef.current && !pipWindowRef.current.closed) {
      pipWindowRef.current.close();
    }
    setIsPipOpen(false);
  }, []);

  return { isPipSupported, isPipOpen, openPip, closePip };
};

// ──────────────────────────────────────────────
// BridgedTimerProvider — passes values from the
// main app's TimerContext into the PiP window's
// isolated React tree without creating a new timer
// ──────────────────────────────────────────────
import TimerContext from '../context/TimerContext';

const BridgedTimerProvider = ({ value, children }) => (
  <TimerContext.Provider value={value}>
    {children}
  </TimerContext.Provider>
);

// ──────────────────────────────────────────────
// PiP Window Body Wrapper
// ──────────────────────────────────────────────
const PipBody = ({ children }) => (
  <div
    style={{
      margin: 0,
      padding: '8px',
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);

// ──────────────────────────────────────────────
// Styles injected into the PiP window
// ──────────────────────────────────────────────
function getPipStyles() {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #pip-root {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #0a0b0e;
      font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
    }

    @keyframes pip-slide-in {
      0% { transform: translateY(8px) scale(0.96); opacity: 0; }
      100% { transform: translateY(0) scale(1); opacity: 1; }
    }

    @keyframes miniplayer-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .miniplayer-spin {
      animation: miniplayer-spin 8s linear infinite;
    }

    .miniplayer-btn:hover {
      transform: scale(1.1);
      background: rgba(255,255,255,0.15) !important;
    }
    .miniplayer-btn:active {
      transform: scale(0.92);
    }
  `;
}

export default usePictureInPicture;
