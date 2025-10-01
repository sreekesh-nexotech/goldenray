// src/hooks/useIdle.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to detect user inactivity.
 * @param timeout - The inactivity time in milliseconds.
 * @returns {boolean} - Returns true if the user is idle, false otherwise.
 */
export const useIdle = (timeout: number): boolean => {
  const [isIdle, setIsIdle] = useState(false);

  const handleIdle = useCallback(() => {
    setIsIdle(true);
  }, []);

  const resetTimer = useCallback(() => {
    setIsIdle(false);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const startTimer = () => {
      timer = setTimeout(handleIdle, timeout);
    };

    const handleActivity = () => {
      resetTimer();
      clearTimeout(timer);
      startTimer();
    };

    // Events that signal user activity
    const activityEvents = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'];

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    startTimer();

    // Cleanup function
    return () => {
      clearTimeout(timer);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [timeout, handleIdle, resetTimer]);

  return isIdle;
};