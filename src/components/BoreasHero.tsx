import React from 'react';

interface BoreasHeroProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export const BoreasHero: React.FC<BoreasHeroProps> = ({
  className = '',
  size = 'lg',
  animated = true
}) => {
  const sizeMap = {
    sm: 'w-24 h-24',
    md: 'w-36 h-36',
    lg: 'w-48 h-48 sm:w-56 sm:h-56',
    xl: 'w-64 h-64 sm:w-72 sm:h-72'
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${className}`}>
      {/* Background Soft Glow & Wind Aura */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-tr from-sky-300/50 via-cyan-200/40 to-blue-400/50 blur-xl ${
          animated ? 'animate-pulse' : ''
        }`}
      />

      {/* Wind Swirl Orbit Rings */}
      <svg
        className={`absolute inset-0 w-full h-full pointer-events-none opacity-60 ${
          animated ? 'animate-[spin_10s_linear_infinite]' : ''
        }`}
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle
          cx="100"
          cy="100"
          r="86"
          stroke="url(#qWindRing)"
          strokeWidth="2.5"
          strokeDasharray="14 18"
          strokeLinecap="round"
        />
        <circle
          cx="100"
          cy="100"
          r="72"
          stroke="url(#qWindRing2)"
          strokeWidth="1.5"
          strokeDasharray="6 20"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="qWindRing" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" />
            <stop offset="0.5" stopColor="#a5f3fc" stopOpacity="0.2" />
            <stop offset="1" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="qWindRing2" x1="200" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse">
            <stop stopColor="#67e8f9" />
            <stop offset="1" stopColor="#bae6fd" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>

      {/* Super Cute Q-Version Boreas Little Superhero Character */}
      <svg
        viewBox="0 0 200 200"
        className={`relative z-10 w-full h-full drop-shadow-md ${
          animated ? 'animate-[bounce_2.5s_ease-in-out_infinite]' : ''
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="qCapeGrad" x1="60" y1="90" x2="150" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0284c7" />
            <stop offset="0.6" stopColor="#38bdf8" />
            <stop offset="1" stopColor="#7dd3fc" />
          </linearGradient>
          <linearGradient id="qSuitGrad" x1="75" y1="110" x2="125" y2="165" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f0f9ff" />
            <stop offset="1" stopColor="#bae6fd" />
          </linearGradient>
          <linearGradient id="qStarGrad" x1="140" y1="60" x2="175" y2="95" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fef08a" />
            <stop offset="0.5" stopColor="#fde047" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="qGlow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Fluffy Marshmallow Wind Cloud under feet */}
        <g className="opacity-95">
          <ellipse cx="100" cy="172" rx="42" ry="14" fill="#e0f2fe" stroke="#7dd3fc" strokeWidth="2.5" />
          <circle cx="75" cy="168" r="14" fill="#f0f9ff" stroke="#7dd3fc" strokeWidth="2" />
          <circle cx="125" cy="168" r="14" fill="#f0f9ff" stroke="#7dd3fc" strokeWidth="2" />
          <circle cx="100" cy="164" r="18" fill="#ffffff" stroke="#7dd3fc" strokeWidth="2" />
          {/* Cloud face or swirl */}
          <path d="M92 168 Q 100 174 108 168" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="88" cy="166" r="2" fill="#fda4af" />
          <circle cx="112" cy="166" r="2" fill="#fda4af" />
        </g>

        {/* Breeze trail curves */}
        <path d="M25 166 C 10 168 15 178 32 176" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M148 174 C 168 176 185 168 172 160" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />

        {/* Fluttering Cape behind chibi body */}
        <path
          d="M68 108 C 42 120 30 148 20 162 C 38 156 58 152 70 144 C 64 154 75 160 84 152 C 78 136 76 122 76 108 Z"
          fill="url(#qCapeGrad)"
          stroke="#0369a1"
          strokeWidth="2"
        />
        <path
          d="M132 108 C 158 120 170 148 180 162 C 162 156 142 152 130 144 C 136 154 125 160 116 152 C 122 136 124 122 124 108 Z"
          fill="url(#qCapeGrad)"
          stroke="#0369a1"
          strokeWidth="2"
        />

        {/* Chibi Tiny Chubby Body */}
        <ellipse cx="100" cy="132" rx="26" ry="24" fill="url(#qSuitGrad)" stroke="#0284c7" strokeWidth="2.5" />

        {/* Cute Yellow Superhero Belt & Emblem */}
        <path d="M78 140 Q 100 145 122 140" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" fill="none" />
        <circle cx="100" cy="141" r="5" fill="#facc15" stroke="#a16207" strokeWidth="1.2" />

        {/* Boreas Swirl on Chest */}
        <circle cx="100" cy="125" r="9" fill="#ffffff" stroke="#38bdf8" strokeWidth="1.5" />
        <path
          d="M96 125 C 96 121 102 120 103 123 C 104 126 98 127 98 129"
          stroke="#0284c7"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="101" cy="126" r="1.2" fill="#0284c7" />

        {/* Chibi Boots / Feet */}
        <ellipse cx="88" cy="154" rx="7" ry="5" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
        <ellipse cx="112" cy="154" rx="7" ry="5" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />

        {/* Big Chubby Q-Head */}
        <ellipse cx="100" cy="76" rx="36" ry="34" fill="#fffbeb" stroke="#0284c7" strokeWidth="2.5" />

        {/* Breezy Anime Hair Bangs */}
        <path
          d="M66 70 C 66 48 84 42 100 42 C 118 42 134 50 134 72 C 128 62 118 56 102 56 C 88 56 75 63 66 70 Z"
          fill="#0284c7"
        />
        {/* Playful Ahoge / Wind Hair strand on top */}
        <path
          d="M100 42 C 94 28 112 24 116 32 C 112 36 104 38 100 42 Z"
          fill="#38bdf8"
          stroke="#0284c7"
          strokeWidth="1.5"
        />
        <path d="M78 52 C 70 42 84 38 90 45" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />

        {/* Chibi Hero Mask (Soft Cyan / Deep Sky) */}
        <path
          d="M72 74 C 82 67 93 68 100 72 C 107 68 118 67 128 74 C 128 85 118 90 104 86 C 100 85 100 85 96 86 C 82 90 72 85 72 74 Z"
          fill="#0284c7"
        />

        {/* Super Cute Sparkling Big Chibi Eyes */}
        {/* Left Eye */}
        <g>
          <ellipse cx="86" cy="76" rx="7" ry="8" fill="#0f172a" />
          <ellipse cx="88" cy="73.5" rx="3.5" ry="4" fill="#ffffff" />
          <circle cx="84" cy="78" r="1.5" fill="#ffffff" />
          <ellipse cx="87" cy="80.5" rx="4" ry="2" fill="#38bdf8" opacity="0.8" />
        </g>
        {/* Right Eye */}
        <g>
          <ellipse cx="114" cy="76" rx="7" ry="8" fill="#0f172a" />
          <ellipse cx="116" cy="73.5" rx="3.5" ry="4" fill="#ffffff" />
          <circle cx="112" cy="78" r="1.5" fill="#ffffff" />
          <ellipse cx="115" cy="80.5" rx="4" ry="2" fill="#38bdf8" opacity="0.8" />
        </g>

        {/* Rosy Soft Chubby Cheeks (Blushing) */}
        <ellipse cx="73" cy="86" rx="5" ry="3.5" fill="#f472b6" opacity="0.75" />
        <ellipse cx="127" cy="86" rx="5" ry="3.5" fill="#f472b6" opacity="0.75" />

        {/* Open Cute Happy Mouth */}
        <path
          d="M95 86 Q 100 93 105 86 Z"
          fill="#f43f5e"
          stroke="#9f1239"
          strokeWidth="1.2"
        />
        {/* Tiny tooth / tongue highlight */}
        <path d="M97 87 Q 100 85 103 87" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />

        {/* Left Arm Raised Waving / Holding Floating Golden Wind Star */}
        <path
          d="M125 125 C 142 118 152 102 154 90"
          stroke="#0284c7"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="154" cy="89" r="5.5" fill="#fffbeb" stroke="#0284c7" strokeWidth="1.8" />

        {/* Magical Glowing North Wind Star in hand */}
        <g filter="url(#qGlow)">
          <path
            d="M162 74 L 165 83 L 174 86 L 165 89 L 162 98 L 159 89 L 150 86 L 159 83 Z"
            fill="url(#qStarGrad)"
            className="animate-spin"
            style={{ transformOrigin: '162px 86px' }}
          />
          <circle cx="162" cy="86" r="3" fill="#ffffff" />
        </g>

        {/* Right Arm: cute little fist or peace sign */}
        <path
          d="M75 125 C 60 128 52 136 50 144"
          stroke="#0284c7"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="49" cy="145" r="5.5" fill="#fffbeb" stroke="#0284c7" strokeWidth="1.8" />

        {/* Floating Sparkles around chibi hero */}
        <circle cx="36" cy="68" r="2.5" fill="#38bdf8" className="animate-ping" />
        <path d="M142 46 L 144 50 L 148 51.5 L 144 53 L 142 57 L 140 53 L 136 51.5 L 140 50 Z" fill="#facc15" />
        <path d="M50 105 L 51.5 108 L 54.5 109 L 51.5 110 L 50 113 L 48.5 110 L 45.5 109 L 48.5 108 Z" fill="#67e8f9" />
      </svg>
    </div>
  );
};
