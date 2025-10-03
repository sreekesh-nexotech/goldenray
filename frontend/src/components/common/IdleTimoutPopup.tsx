/* golden-ray/frontend/src/components/common/IdleTimeoutPopup.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { useIdle } from '@/hooks/useIdle';
import Button from '../ui/Button';
import { useOfferTimer } from '@/hooks/userOfferTimer';

const IDLE_TIMEOUT = 60 * 1000;

const IdleTimeoutPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isIdle = useIdle(IDLE_TIMEOUT);
  const { formattedTime, startOffer,  isCooldown } = useOfferTimer();

  useEffect(() => {
    if (isIdle) {
      // Start offer only if no active offer or cooldown
      startOffer();
      setIsOpen(true);
    }
  }, [isIdle, startOffer]);

  const handleClaimOffer = () => {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleClose = () => setIsOpen(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-lg shadow-2xl p-4 md:p-6 max-w-md w-full text-left flex flex-col">
        <button onClick={handleClose} className="cursor-pointer absolute top-2 right-2 text-gray-400 hover:text-gray-600" aria-label="Close popup" >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> 
          </svg>
        </button>

        {!isCooldown ? (
          <>
            <div className="bg-teal-100 text-center text-teal-800 border border-teal-200 rounded-full px-4 py-2 text-sm md:text-base mt-5 mb-4">
              Hurry - offer ends in <span className="font-bold">{formattedTime}</span>!
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              Special offer: Get an instant <span className="text-[#123532]">₹5,000</span> installation discount!
            </h2>
            <Button onClick={handleClaimOffer} className="w-full md:w-auto">
              Claim This Offer
            </Button>
          </>
        ) : (
          <div className="text-center mt-8 mb-6 flex flex-col items-center gap-5">
            <p className="text-lg font-medium text-gray-700">
              Are you there? <br></br>Exciting offers are coming soon!
            </p>
            <Button onClick={handleClaimOffer} className="w-full md:w-auto">
              Connect With Us
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IdleTimeoutPopup;
