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
