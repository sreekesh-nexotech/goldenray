import { ReactNode } from "react";

interface ButtonProps {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function Button({ onClick, children, className = "", disabled = false }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-8 py-3 bg-[#F7BA41] text-white font-semibold rounded-lg hover:bg-[#e6a73a] transition-colors duration-200 ${
        disabled ? "opacity-50 cursor-not-allowed hover:bg-[#F7BA41]" : ""
      } ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}