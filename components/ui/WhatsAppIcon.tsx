/**
 * WhatsApp glyph, hand-drawn to match lucide-react's stroke style (lucide
 * dropped brand/logo icons from its package — same approach as InstagramIcon).
 */
export default function WhatsAppIcon({ className }: { className?: string }) {
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
      <path d="M12 3a9 9 0 0 0-7.75 13.5L3 21l4.6-1.21A9 9 0 1 0 12 3Z" />
      <path
        d="M8.5 8.5c-.3 1.5.7 3.5 2 4.8 1.3 1.3 3.3 2.3 4.8 2 .5-.1.9-.5 1-1l.2-.8c.1-.4-.1-.8-.4-1l-1.3-.8c-.3-.2-.7-.1-1 .1l-.4.4c-.7-.3-1.4-.8-2-1.4-.6-.6-1.1-1.3-1.4-2l.4-.4c.2-.3.3-.7.1-1l-.8-1.3c-.2-.3-.6-.5-1-.4l-.8.2c-.5.1-.9.5-1 1Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
