export function Octagon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" data-testid="shape-octagon">
      <polygon points="30,10 70,10 90,30 90,70 70,90 30,90 10,70 10,30" fill="currentColor" />
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
