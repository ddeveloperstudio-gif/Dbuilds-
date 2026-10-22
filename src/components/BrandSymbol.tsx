import React from 'react';

interface BrandSymbolProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const BrandSymbol: React.FC<BrandSymbolProps> = ({
  className = '',
  size = 32,
  glow = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-lg blur-md bg-[#63B3FF]/25 pointer-events-none transition-opacity duration-300"
          aria-hidden="true"
        />
      )}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="dbuildsGrad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#63B3FF" />
            <stop offset="100%" stopColor="#65F4E8" />
          </linearGradient>
          <linearGradient id="doorwayGrad" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#63B3FF" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Outer orbital boundary / Letter D spine */}
        <path
          d="M12 8H25C34.3888 8 42 15.1634 42 24C42 32.8366 34.3888 40 25 40H12V8Z"
          stroke="url(#dbuildsGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Inner digital doorway portal */}
        <path
          d="M18 16H23C27.4183 16 31 19.5817 31 24C31 28.4183 27.4183 32 23 32H18V16Z"
          stroke="url(#doorwayGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central luminous focal node */}
        <circle cx="21" cy="24" r="2.5" fill="#65F4E8" />
      </svg>
    </div>
  );
};
