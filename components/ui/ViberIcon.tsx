/**
 * Viber glyph, hand-drawn to match lucide-react's stroke style (lucide
 * dropped brand/logo icons from its package — same approach as InstagramIcon).
 */
export default function ViberIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3c-5 0-8 3-8 7.5 0 3 1.6 5.4 4.2 6.8-.1.9-.4 2.1-1 3.2 1.7-.3 3.1-1 4-1.7.3 0 .5.1.8.1 5 0 8-3 8-7.4S17 3 12 3Z" />
      <path
        d="M9 8.7c-.3 1.4.6 3.2 1.8 4.4 1.2 1.2 3 2.1 4.4 1.8.5-.1.8-.5.9-1l.2-.7c.1-.4-.1-.8-.4-1l-1.2-.7c-.3-.2-.7-.1-.9.1l-.4.4c-.6-.3-1.2-.7-1.8-1.3-.5-.5-.9-1.1-1.3-1.8l.4-.4c.2-.3.3-.6.1-.9l-.7-1.2c-.2-.3-.6-.5-1-.4l-.7.2c-.5.1-.9.4-1 .9Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
