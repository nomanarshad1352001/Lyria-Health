/** Lyria Health logomark — a calm aperture/pulse in a forest disc. */
export default function Mark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="var(--color-forest)" />
      <path
        d="M8 20.5c2.2-6.5 4.4-9.7 6.2-9.7 3.4 0 2.1 9.2 5.2 9.2 1.5 0 2.9-3.1 4.4-7"
        fill="none"
        stroke="var(--color-cream)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="23.4" cy="12.4" r="1.6" fill="var(--color-gold)" />
    </svg>
  );
}
