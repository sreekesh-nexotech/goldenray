// src/components/common/FloatingChatButton.tsx
'use client';

import React from 'react';

const FloatingChatButton = () => {
  return (
    <button
      disabled
      title="Chat feature is coming soon!"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-3 bg-[#F7BA41] text-black font-semibold rounded-lg hover:bg-[#e6a73a] transition-colors duration-200 cursor-not-allowed opacity-90"
    >
      {/* Chat Icon SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
      
      {/* Text Content */}
      <div className="text-left">
        <span className="block text-base leading-tight">Chat with us</span>
        <span className="block text-xs font-normal opacity-75 leading-tight">(Coming Soon)</span>
      </div>
    </button>
  );
};

export default FloatingChatButton;