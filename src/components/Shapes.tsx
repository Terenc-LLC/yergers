export function Square({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" data-testid="shape-square">
      <rect x="15" y="15" width="70" height="70" fill="currentColor" />
    </svg>
  );
}

export function Triangle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" data-testid="shape-triangle">
      <polygon points="50,10 90,90 10,90" fill="currentColor" />
    </svg>
  );
}

export function Circle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" data-testid="shape-circle">
      <circle cx="50" cy="50" r="40" fill="currentColor" />
    </svg>
  );
}

export function Sun({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" data-testid="shape-sun">
      <circle cx="50" cy="50" r="18" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="6" strokeLinecap="round">
        <line x1="50" y1="8" x2="50" y2="24" />
        <line x1="50" y1="76" x2="50" y2="92" />
        <line x1="8" y1="50" x2="24" y2="50" />
        <line x1="76" y1="50" x2="92" y2="50" />
        <line x1="22" y1="22" x2="32" y2="32" />
        <line x1="68" y1="22" x2="78" y2="32" />
        <line x1="22" y1="78" x2="32" y2="68" />
        <line x1="68" y1="78" x2="78" y2="68" />
      </g>
    </svg>
  );
}

// Crescent shape: outer circle minus overlapping inner circle, via a two-arc path.
// Outer circle: center (46,50) r=30. Inner circle: center (61,50) r=26.
// Intersection points calculated at approximately (61,24) and (61,76).
export function Moon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" data-testid="shape-moon">
      <path d="M61,24 A30,30,0,1,0,61,76 A26,26,0,0,1,61,24 Z" fill="currentColor" />
    </svg>
  );
}
