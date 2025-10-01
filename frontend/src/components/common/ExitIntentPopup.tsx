// src/components/common/ExitIntentPopup.tsx
'use client';

import React, { useState, useEffect } from 'react';

const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Prevent this from running on mobile devices
    if (window.innerWidth < 768) {
      return;
    }

    const handleMouseOut = (e: MouseEvent) => {
      // Trigger if mouse leaves the top of the viewport
      if (e.clientY <= 0) {
        const hasBeenShown = sessionStorage.getItem('exitIntentShown');
        if (!hasBeenShown) {
          setIsOpen(true);
          sessionStorage.setItem('exitIntentShown', 'true');
        }
      }
    };

    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000093] bg-opacity-60">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Wait, don&apos;t go!</h2>
        <p className="text-gray-600 mb-6">
          Before you leave, would you like a free consultation on your solar needs?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleClose}
            className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
          >
            No, thanks
          </button>
          <button
             onClick={() => {
                // You can redirect to contact page or open another modal
                window.location.href = '/#booking'; // Example: scrolls to booking section
                handleClose();
             }}
            className="cursor-pointer px-8 py-3 bg-[#F7BA41] text-black font-semibold rounded-lg hover:bg-[#e6a73a] transition-colors duration-200"
          >
            Book a Free Consultation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentPopup;