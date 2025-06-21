"use client";

import { useState } from "react";
import Button from "../ui/Button";

interface QuotePopupProps {
  onClose: () => void;
}

export default function QuotePopup({ onClose }: QuotePopupProps) {
  const [name, setName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!whatsappNumber.trim()) {
      newErrors.whatsappNumber = "WhatsApp number is required.";
    } else if (!/^\d{10}$/.test(whatsappNumber.replace(/\s/g, ""))) {
      newErrors.whatsappNumber = "Please enter a valid 10-digit WhatsApp number.";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Quote submitted:", { name, whatsappNumber, email });
      // Add your submission logic here (e.g., API call)
      onClose(); // Close the popup after submission
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 flex items-center justify-center z-50">
        
        <div className="bg-white px-10 pb-10 rounded-2xl shadow-lg w-full max-w-md">
            <div className="flex items-end justify-end">
                <button
                    onClick={onClose}
                    className="mt-4 text-gray-500 hover:text-gray-700"
                    >
                    Close
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 pt-8">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
                </label>
                <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your first name"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
                <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">
                WhatsApp Number
                </label>
                <input
                id="whatsappNumber"
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="e.g., 9145785412"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                {errors.whatsappNumber && <p className="mt-1 text-sm text-red-600">{errors.whatsappNumber}</p>}
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
                </label>
                <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., user@test.com"
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <Button onClick={handleSubmit} className="w-full">Get Detailed Quote</Button>
            </form>
            
        </div>
    </div>
  );
}