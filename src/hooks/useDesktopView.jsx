import { useState, useCallback, useEffect } from 'react';

const RESPONSIVE_VIEWPORT = 'width=device-width, initial-scale=1.0';
const DESKTOP_VIEWPORT = 'width=1200, initial-scale=0.35';

/**
 * useDesktopView — Dynamically swaps the viewport meta tag to force a 
 * desktop-width layout on mobile devices.
 * 
 * When toggled ON:  Sets viewport to width=1200, shrinking the full desktop
 *                   layout into the mobile screen.
 * When toggled OFF: Restores the standard responsive viewport.
 * 
 * The state is persisted in sessionStorage so it survives page refreshes
 * within the same session but resets when the browser is closed.
 */
export const useDesktopView = () => {
  const [isDesktopView, setIsDesktopView] = useState(() => {
    return sessionStorage.getItem('force-desktop-view') === 'true';
  });

  const applyViewport = useCallback((forceDesktop) => {
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', forceDesktop ? DESKTOP_VIEWPORT : RESPONSIVE_VIEWPORT);
  }, []);

  // Apply on mount and when state changes
  useEffect(() => {
    applyViewport(isDesktopView);
    sessionStorage.setItem('force-desktop-view', isDesktopView.toString());
  }, [isDesktopView, applyViewport]);

  const toggleDesktopView = useCallback(() => {
    setIsDesktopView(prev => !prev);
  }, []);

  // Only show the toggle on mobile/tablet devices
  const isMobileDevice = typeof window !== 'undefined' && (
    /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 0 && window.innerWidth < 1024)
  );

  return {
    isDesktopView,
    toggleDesktopView,
    isMobileDevice,
  };
};

export default useDesktopView;
