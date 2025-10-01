// src/components/common/IdleTimeoutPopup.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useIdle } from '@/hooks/useIdle';
import Button from '../ui/Button';

const IDLE_TIMEOUT = 60 * 1000; // 60 seconds

const IdleTimeoutPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isIdle = useIdle(IDLE_TIMEOUT);

  useEffect(() => {
    if (isIdle) {
      setIsOpen(true);
    }
  }, [isIdle]);

  const handleClose = () => {
    setIsOpen(false);
    // The useIdle hook will automatically reset on the next user activity.
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-opacity-50 ">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Are you still there?</h2>
        <p className="text-gray-600 mb-6">You&apos;ve been inactive for a while. We&apos;re here if you need anything!</p>
        <Button onClick={handleClose}>I&apos;m here</Button>
      </div>
    </div>
  );
};

export default IdleTimeoutPopup;