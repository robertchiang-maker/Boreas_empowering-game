import React from 'react';

interface BoreasSkillBagProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showCards?: boolean;
  onClick?: () => void;
}

export const BoreasSkillBag: React.FC<BoreasSkillBagProps> = ({
  className = '',
  size = 'md',
  showCards = true,
  onClick
}) => {
  const sizeMap = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32 sm:w-40 sm:h-40',
    lg: 'w-44 h-44 sm:w-52 sm:h-52'
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95 transition-transform' : ''} ${className}`}
    >
      {/* Background Magic Glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-300/40 via-sky-300/30 to-blue-400/30 blur-xl animate-pulse" />

      {/* Outer Wind Ring */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-50 animate-[spin_16s_linear_infinite]"
        viewBox="0 0 160 160"
        fill="none"
      >
        <circle cx="80" cy="80" r="70" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 14" strokeLinecap="round" />
        <circle cx="80" cy="80" r="58" stroke="#7dd3fc" strokeWidth="1" strokeDasharray="4 16" strokeLinecap="round" />
      </svg>

      {/* Skill Bag Vector */}
      <svg
        viewBox="0 0 160 160"
        className="relative z-10 w-full h-full drop-shadow-lg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bagLeatherGrad" x1="40" y1="50" x2="120" y2="135" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0284c7" />
            <stop offset="0.6" stopColor="#0369a1" />
            <stop offset="1" stopColor="#075985" />
          </linearGradient>
          <linearGradient id="bagFlapGrad" x1="50" y1="45" x2="110" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" />
            <stop offset="1" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="cardGradGold" x1="0" y1="0" x2="40" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fef08a" />
            <stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="cardGradCyan" x1="0" y1="0" x2="40" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e0f2fe" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        {/* Superpower cards poking out of bag top */}
        {showCards && (
          <g>
            {/* Card Left */}
            <rect
              x="42"
              y="22"
              width="24"
              height="38"
              rx="4"
              fill="url(#cardGradCyan)"
              stroke="#0284c7"
              strokeWidth="1.5"
              transform="rotate(-18 54 41)"
              className="drop-shadow-sm"
            />
            {/* Card Right */}
            <rect
              x="94"
              y="22"
              width="24"
              height="38"
              rx="4"
              fill="#c084fc"
              stroke="#7e22ce"
              strokeWidth="1.5"
              transform="rotate(18 106 41)"
              className="drop-shadow-sm"
            />
            {/* Card Center - Golden Special */}
            <rect
              x="68"
              y="16"
              width="25"
              height="40"
              rx="4"
              fill="url(#cardGradGold)"
              stroke="#b45309"
              strokeWidth="1.5"
              className="drop-shadow"
            />
            {/* Wind Swirl on center card */}
            <path
              d="M77 34 C 77 30 84 28 86 32 C 87 35 81 37 81 39"
              stroke="#92400e"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="84" cy="35" r="1.2" fill="#92400e" />
          </g>
        )}

        {/* Bag Base Body */}
        <path
          d="M38 60 C 38 52 46 48 56 48 L 104 48 C 114 48 122 52 122 60 L 126 112 C 126 126 114 136 100 136 L 60 136 C 46 136 34 126 34 112 Z"
          fill="url(#bagLeatherGrad)"
          stroke="#075985"
          strokeWidth="3"
        />

        {/* Side Pouches */}
        <path d="M34 78 C 26 80 26 104 34 108 Z" fill="#0369a1" stroke="#075985" strokeWidth="2" />
        <path d="M126 78 C 134 80 134 104 126 108 Z" fill="#0369a1" stroke="#075985" strokeWidth="2" />

        {/* Front Flap */}
        <path
          d="M42 50 L 118 50 C 120 50 122 54 120 62 L 112 90 C 110 98 100 102 88 102 L 72 102 C 60 102 50 98 48 90 L 40 62 C 38 54 40 50 42 50 Z"
          fill="url(#bagFlapGrad)"
          stroke="#0369a1"
          strokeWidth="2.5"
        />

        {/* Stitching lines */}
        <path d="M48 55 L 112 55" stroke="#bae6fd" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M52 94 C 62 97 98 97 108 94" stroke="#bae6fd" strokeWidth="1" strokeDasharray="3 3" />

        {/* Straps with brass buckles */}
        <rect x="58" y="52" width="7" height="48" rx="2" fill="#0284c7" stroke="#075985" strokeWidth="1" />
        <rect x="95" y="52" width="7" height="48" rx="2" fill="#0284c7" stroke="#075985" strokeWidth="1" />
        <rect x="56.5" y="80" width="10" height="9" rx="2" fill="#facc15" stroke="#a16207" strokeWidth="1.2" />
        <rect x="93.5" y="80" width="10" height="9" rx="2" fill="#facc15" stroke="#a16207" strokeWidth="1.2" />

        {/* Center Boreas Crest Badge */}
        <circle cx="80" cy="82" r="14" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" className="drop-shadow-sm" />
        {/* Swirl Wind Emblem inside badge */}
        <path
          d="M74 82 C 74 76 83 75 85 80 C 87 84 78 86 78 89"
          stroke="#0284c7"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="83" cy="83" r="2" fill="#0284c7" />
        {/* Little star on crest */}
        <path d="M80 73 L 81 76 L 84 76.5 L 81.5 78.5 L 82.5 81.5 L 80 79.5 L 77.5 81.5 L 78.5 78.5 L 76 76.5 L 79 76 Z" fill="#f59e0b" />

        {/* Bottom pocket detail */}
        <rect x="50" y="110" width="60" height="18" rx="4" fill="#0369a1" stroke="#0c4a6e" strokeWidth="1.5" />
        <circle cx="80" cy="119" r="2.5" fill="#facc15" />

        {/* Sparkles / Magic Dust */}
        <circle cx="28" cy="45" r="2" fill="#38bdf8" className="animate-ping" />
        <circle cx="135" cy="50" r="2" fill="#facc15" className="animate-ping" />
        <path d="M125 125 L 127 130 L 132 131 L 127 132 L 125 137 L 123 132 L 118 131 L 123 130 Z" fill="#38bdf8" />
      </svg>
    </div>
  );
};
