/* golden-ray/frontend/src/hooks/useOfferTimer.ts */
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

const OFFER_DURATION = 15 * 60 * 1000; // 15 min
const COOLDOWN_PERIOD = 2 * 60 * 60 * 1000; // 2 hrs
const EXPIRY_TIMESTAMP_KEY = 'specialOfferExpiryTimestamp';
const COOLDOWN_START_KEY = 'specialOfferCooldownStart';

export const useOfferTimer = () => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isCooldown, setIsCooldown] = useState(false);

  const startOffer = useCallback(() => {
    const existingExpiry = localStorage.getItem(EXPIRY_TIMESTAMP_KEY);
    const existingCooldown = localStorage.getItem(COOLDOWN_START_KEY);

    // Prevent restarting if offer or cooldown already exists
    if (existingExpiry || existingCooldown) return;

    const newExpiryTime = Date.now() + OFFER_DURATION;
    localStorage.setItem(EXPIRY_TIMESTAMP_KEY, String(newExpiryTime));
    setTimeLeft(OFFER_DURATION);
    setIsCooldown(false);
  }, []);

  useEffect(() => {
    const checkOfferState = () => {
      const expiryStr = localStorage.getItem(EXPIRY_TIMESTAMP_KEY);
      const cooldownStr = localStorage.getItem(COOLDOWN_START_KEY);

      if (expiryStr) {
        const expiry = parseInt(expiryStr, 10);
        const remaining = expiry - Date.now();
        if (remaining > 0) {
          setTimeLeft(remaining);
          setIsCooldown(false);
        } else {
          // Offer expired — start cooldown if not started yet
          localStorage.removeItem(EXPIRY_TIMESTAMP_KEY);
          if (!cooldownStr) {
            localStorage.setItem(COOLDOWN_START_KEY, String(Date.now()));
          }
        }
      } else if (cooldownStr) {
        const cooldownStart = parseInt(cooldownStr, 10);
        const elapsed = Date.now() - cooldownStart;
        if (elapsed < COOLDOWN_PERIOD) {
          setTimeLeft(0);
          setIsCooldown(true);
        } else {
          // Cooldown over — reset everything
          localStorage.removeItem(COOLDOWN_START_KEY);
          setTimeLeft(null);
          setIsCooldown(false);
        }
      } else {
        setTimeLeft(null);
        setIsCooldown(false);
      }
    };

    // Initial check
    checkOfferState();

    const interval = setInterval(() => {
      checkOfferState();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = useMemo(() => {
    if (timeLeft === null || timeLeft <= 0) return '00:00';
    const minutes = Math.floor(timeLeft / 1000 / 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }, [timeLeft]);

  return {
    timeLeft,
    formattedTime,
    startOffer,
    isOfferActive: timeLeft !== null && timeLeft > 0,
    isCooldown,
  };
};
