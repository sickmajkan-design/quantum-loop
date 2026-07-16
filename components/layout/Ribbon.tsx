export default function Ribbon() {
  return (
    <div
      id="ribbon"
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-1/2 z-1 h-full w-0.75 opacity-35"
    >
      <div
        className="h-full w-full origin-top scale-y-0"
        style={{
          background:
            "linear-gradient(180deg, transparent, var(--color-gold) 15%, var(--color-gold2) 50%, var(--color-gold) 85%, transparent)",
        }}
      />
    </div>
  );
}
