export function EgyptianPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="egyptian-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          {/* Lotus Flower */}
          <path d="M60 20 L50 40 L40 50 L50 60 L60 50 L70 60 L80 50 L70 40 Z" fill="#c4a24c" opacity="0.3"/>
          {/* Papyrus */}
          <circle cx="30" cy="90" r="8" fill="#2d7a3e" opacity="0.2"/>
          <path d="M30 82 L30 70" stroke="#2d7a3e" strokeWidth="2" opacity="0.2"/>
          {/* Scarab */}
          <ellipse cx="90" cy="30" rx="10" ry="8" fill="#c4a24c" opacity="0.2"/>
          {/* Geometric */}
          <rect x="85" y="85" width="15" height="15" fill="none" stroke="#2d7a3e" strokeWidth="1" opacity="0.3"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#egyptian-pattern)"/>
    </svg>
  );
}

export function PharaohBorder({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 400 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 10 L10 0 L20 10 L30 0 L40 10 L50 0 L60 10 L70 0 L80 10 L90 0 L100 10 L110 0 L120 10 L130 0 L140 10 L150 0 L160 10 L170 0 L180 10 L190 0 L200 10 L210 0 L220 10 L230 0 L240 10 L250 0 L260 10 L270 0 L280 10 L290 0 L300 10 L310 0 L320 10 L330 0 L340 10 L350 0 L360 10 L370 0 L380 10 L390 0 L400 10" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none"/>
      <path d="M0 10 L10 20 L20 10 L30 20 L40 10 L50 20 L60 10 L70 20 L80 10 L90 20 L100 10 L110 20 L120 10 L130 20 L140 10 L150 20 L160 10 L170 20 L180 10 L190 20 L200 10 L210 20 L220 10 L230 20 L240 10 L250 20 L260 10 L270 20 L280 10 L290 20 L300 10 L310 20 L320 10 L330 20 L340 10 L350 20 L360 10 L370 20 L380 10 L390 20 L400 10" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none"/>
    </svg>
  );
}

export function LotusIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Center */}
      <circle cx="50" cy="50" r="8" fill="currentColor"/>
      {/* Petals */}
      <path d="M50 42 Q40 30 35 20 Q40 25 50 30 Z" fill="currentColor" opacity="0.8"/>
      <path d="M50 42 Q60 30 65 20 Q60 25 50 30 Z" fill="currentColor" opacity="0.8"/>
      <path d="M42 50 Q30 40 20 35 Q25 40 30 50 Z" fill="currentColor" opacity="0.7"/>
      <path d="M58 50 Q70 40 80 35 Q75 40 70 50 Z" fill="currentColor" opacity="0.7"/>
      <path d="M50 58 Q40 70 35 80 Q40 75 50 70 Z" fill="currentColor" opacity="0.6"/>
      <path d="M50 58 Q60 70 65 80 Q60 75 50 70 Z" fill="currentColor" opacity="0.6"/>
      <path d="M42 50 Q30 60 20 65 Q25 60 30 50 Z" fill="currentColor" opacity="0.6"/>
      <path d="M58 50 Q70 60 80 65 Q75 60 70 50 Z" fill="currentColor" opacity="0.6"/>
    </svg>
  );
}

export function PyramidIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 10 L90 85 L10 85 Z" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="2"/>
      <path d="M50 10 L70 85" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      <path d="M50 10 L30 85" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      <path d="M20 70 L80 70" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
      <path d="M30 55 L70 55" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
    </svg>
  );
}

export function PapyrusIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="35" y="20" width="30" height="60" rx="2" fill="currentColor" opacity="0.2"/>
      <line x1="40" y1="30" x2="60" y2="30" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
      <line x1="40" y1="40" x2="60" y2="40" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
      <line x1="40" y1="50" x2="60" y2="50" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
      <line x1="40" y1="60" x2="55" y2="60" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
      <line x1="40" y1="70" x2="60" y2="70" stroke="currentColor" strokeWidth="1.5" opacity="0.6"/>
    </svg>
  );
}
