import React from 'react';

interface LCNovaLogoProps {
  className?: string;
  size?: number | string;
}

export const LCNovaLogo: React.FC<LCNovaLogoProps> = ({ className = 'w-10 h-10', size = 40 }) => {
  return (
    <svg
      viewBox="0 0 500 580"
      width={size}
      height={size}
      className={`select-none shrink-0 drop-shadow-md ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Outer Teal Gradient */}
        <linearGradient id="pinBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00C4D4" />
          <stop offset="50%" stopColor="#00A2B8" />
          <stop offset="100%" stopColor="#008094" />
        </linearGradient>

        {/* Warm Golden Sun Gradient */}
        <linearGradient id="sunGlow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFC837" />
          <stop offset="100%" stopColor="#F99F1B" />
        </linearGradient>

        {/* Waves Gradients */}
        <linearGradient id="waveCyanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>

        <linearGradient id="waveTealGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        <linearGradient id="waveDeepGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0F4C6E" />
          <stop offset="100%" stopColor="#0A364F" />
        </linearGradient>

        {/* Inner Clip Path (Pin Interior) */}
        <clipPath id="lcNovaBadgeClip">
          <path d="M 250 30 C 365 30 455 120 455 235 C 455 330 370 435 250 535 C 130 435 45 330 45 235 C 45 120 135 30 250 30 Z" />
        </clipPath>
      </defs>

      {/* Outer Teardrop Map Pin Border */}
      <path
        d="M 250 10 C 380 10 480 110 480 238 C 480 348 385 460 250 568 C 115 460 20 348 20 238 C 20 110 120 10 250 10 Z"
        fill="url(#pinBorderGrad)"
      />

      {/* Inner Badge Base (Cream Background) */}
      <path
        d="M 250 30 C 365 30 455 120 455 235 C 455 330 370 435 250 535 C 130 435 45 330 45 235 C 45 120 135 30 250 30 Z"
        fill="#FAF9F5"
      />

      {/* Clipped Artwork */}
      <g clipPath="url(#lcNovaBadgeClip)">
        {/* Golden Sun */}
        <circle cx="260" cy="120" r="62" fill="url(#sunGlow)" />

        {/* City Skyline Silhouettes (Deep Navy #0A364F) */}
        {/* Building 1 (Left Block) */}
        <rect x="200" y="215" width="36" height="60" fill="#0A364F" />

        {/* Building 2 (House with Gabled Roof) */}
        <path d="M 230 255 L 230 180 L 255 160 L 280 180 L 280 255 Z" fill="#0A364F" />
        <rect x="249" y="190" width="8" height="12" rx="1" fill="#FFFFFF" />

        {/* Building 3 (Tall Modern High-Rise with Windows) */}
        <rect x="288" y="122" width="62" height="145" rx="3" fill="#0A364F" />
        <g fill="#FFFFFF" opacity="0.95">
          <rect x="303" y="142" width="8" height="11" rx="1" />
          <rect x="318" y="142" width="8" height="11" rx="1" />
          <rect x="333" y="142" width="8" height="11" rx="1" />

          <rect x="303" y="165" width="8" height="11" rx="1" />
          <rect x="318" y="165" width="8" height="11" rx="1" />
          <rect x="333" y="165" width="8" height="11" rx="1" />

          <rect x="303" y="188" width="8" height="11" rx="1" />
          <rect x="318" y="188" width="8" height="11" rx="1" />
          <rect x="333" y="188" width="8" height="11" rx="1" />
        </g>

        {/* Building 4 (Right Medium Block) */}
        <rect x="358" y="195" width="40" height="75" fill="#0A364F" />

        {/* Coastline Shoreline Mound */}
        <path d="M 30 270 C 130 245 280 250 470 280 L 470 330 L 30 330 Z" fill="#0A364F" />

        {/* Palm Tree on Island (Deep Navy) */}
        <path d="M 132 258 C 136 215 152 165 174 135 C 168 135 156 180 148 258 Z" fill="#0A364F" />
        <path d="M 172 135 C 145 110 110 120 95 150 C 115 145 140 145 172 135 Z" fill="#0A364F" />
        <path d="M 172 135 C 130 130 100 160 110 195 C 122 170 145 155 172 135 Z" fill="#0A364F" />
        <path d="M 172 135 C 195 105 230 115 240 140 C 220 135 195 138 172 135 Z" fill="#0A364F" />
        <path d="M 172 135 C 200 135 225 155 222 185 C 210 165 190 152 172 135 Z" fill="#0A364F" />
        <path d="M 172 135 C 150 145 130 175 140 205 C 148 185 158 165 172 135 Z" fill="#0A364F" />

        {/* White Crest 1 */}
        <path d="M 30 285 C 120 260 260 305 470 280 L 470 300 C 260 325 120 280 30 305 Z" fill="#FFFFFF" />

        {/* Ocean Wave Layer 1 */}
        <path d="M 30 300 C 130 275 250 325 470 295 L 470 375 C 260 410 130 355 30 380 Z" fill="url(#waveCyanGrad)" />

        {/* White Crest 2 */}
        <path d="M 80 338 C 170 320 260 355 430 325 L 415 338 C 255 368 165 333 80 352 Z" fill="#FFFFFF" />

        {/* Ocean Wave Layer 2 */}
        <path d="M 30 370 C 150 345 270 395 470 365 L 470 445 C 270 480 150 425 30 450 Z" fill="url(#waveTeALGrad)" />

        {/* White Crest 3 */}
        <path d="M 110 405 C 200 388 290 423 410 395 L 395 408 C 285 436 195 401 110 418 Z" fill="#FFFFFF" />

        {/* Ocean Wave Layer 3 (Deep Bottom) */}
        <path d="M 30 435 C 160 410 270 460 470 430 L 470 560 L 30 560 Z" fill="url(#waveDeepGrad)" />
      </g>
    </svg>
  );
};
