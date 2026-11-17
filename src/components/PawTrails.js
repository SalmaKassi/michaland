// Decorative, non-interactive paw prints. Inline SVG keeps the effect local and
// avoids any external image request. Each print follows its own slow curved path.

// Home: a single cat walking across the hero.
const HERO_PRINTS = [
  { size: 34, top: "20%", left: "6%", duration: 23, delay: -4, arc: -28, rotate: -18, drift: 128, alpha: 0.07 },
  { size: 26, top: "46%", left: "13%", duration: 19, delay: -11, arc: 22, rotate: 12, drift: 104, alpha: 0.05 },
  { size: 40, top: "68%", left: "3%", duration: 27, delay: -17, arc: -18, rotate: -8, drift: 146, alpha: 0.09 },
  { size: 24, top: "33%", left: "28%", duration: 21, delay: -8, arc: 26, rotate: 21, drift: 96, alpha: 0.06 },
  { size: 30, top: "78%", left: "22%", duration: 25, delay: -21, arc: -24, rotate: -14, drift: 118, alpha: 0.08 },
];

// Login: a quiet mixed trail of cat, dog and bird tracks. The first three are
// kept on small screens; the last one sits to the right of the card on desktop.
const AUTH_PRINTS = [
  { type: "cat", size: 34, top: "18%", left: "5%", duration: 26, delay: -4, arc: -30, rotate: -18, drift: 132, alpha: 0.07 },
  { type: "dog", size: 40, top: "44%", left: "12%", duration: 28, delay: -12, arc: 24, rotate: 10, drift: 112, alpha: 0.06 },
  { type: "bird", size: 26, top: "69%", left: "4%", duration: 24, delay: -18, arc: -20, rotate: -8, drift: 150, alpha: 0.08 },
  { type: "cat", size: 26, top: "33%", left: "27%", duration: 27, delay: -9, arc: 28, rotate: 20, drift: 98, alpha: 0.05 },
  { type: "bird", size: 22, top: "79%", left: "21%", duration: 23, delay: -15, arc: -26, rotate: -14, drift: 122, alpha: 0.07 },
  { type: "dog", size: 32, top: "24%", left: "82%", duration: 30, delay: -21, arc: -22, rotate: 12, drift: 110, alpha: 0.05 },
];

function CatPrint({ outline = false }) {
  const ink = outline
    ? { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinejoin: "round" }
    : { fill: "currentColor" };

  return (
    <svg viewBox="0 0 64 64" focusable="false" aria-hidden="true" {...ink}>
      <ellipse cx="32" cy="42" rx="13" ry="11" />
      <ellipse cx="14" cy="26" rx="7" ry="9" transform="rotate(-24 14 26)" />
      <ellipse cx="26" cy="15" rx="7" ry="9" transform="rotate(-10 26 15)" />
      <ellipse cx="40" cy="15" rx="7" ry="9" transform="rotate(10 40 15)" />
      <ellipse cx="51" cy="26" rx="7" ry="9" transform="rotate(24 51 26)" />
    </svg>
  );
}

function DogPrint() {
  return (
    <svg
      viewBox="0 0 64 64"
      focusable="false"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M32 37c-9.5 0-16 5.2-16 11.4 0 4.8 5.4 7.6 11.8 8.4 2.8.3 5.6.3 8.4 0 6.4-.8 11.8-3.6 11.8-8.4C48 42.2 41.5 37 32 37Z" />
      <ellipse cx="11" cy="27" rx="6.4" ry="8.2" transform="rotate(-22 11 27)" />
      <ellipse cx="22.5" cy="14.5" rx="6.4" ry="8.4" transform="rotate(-8 22.5 14.5)" />
      <ellipse cx="41.5" cy="14.5" rx="6.4" ry="8.4" transform="rotate(8 41.5 14.5)" />
      <ellipse cx="53" cy="27" rx="6.4" ry="8.2" transform="rotate(22 53 27)" />
      <path d="M7.5 18.5 6 14M20 7.5 19.4 3M44 7.5 44.6 3M56.5 18.5 58 14" />
    </svg>
  );
}

function BirdPrint() {
  return (
    <svg
      viewBox="0 0 64 64"
      focusable="false"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M32 40c-4-9-10-16-17-22M32 40c0-9 0-18 0-28M32 40c4-9 10-16 17-22M32 40c-1 5-2 9-4 13" />
      <circle cx="32" cy="40" r="2.2" />
    </svg>
  );
}

function Motif({ type, variant }) {
  if (variant !== "auth") return <CatPrint />;
  if (type === "dog") return <DogPrint />;
  if (type === "bird") return <BirdPrint />;
  return <CatPrint outline />;
}

export default function PawTrails({ variant = "hero" }) {
  const prints = variant === "auth" ? AUTH_PRINTS : HERO_PRINTS;

  return (
    <div className={`paw-field paw-field--${variant}`} aria-hidden="true">
      {prints.map((paw, index) => (
        <span
          key={index}
          className="paw-trail"
          data-motif={paw.type || "cat"}
          style={{
            "--paw-size": `${paw.size}px`,
            "--paw-top": paw.top,
            "--paw-left": paw.left,
            "--paw-duration": `${paw.duration}s`,
            "--paw-delay": `${paw.delay}s`,
            "--paw-arc": `${paw.arc}px`,
            "--paw-rotate": `${paw.rotate}deg`,
            "--paw-drift": `${paw.drift}px`,
            "--paw-alpha": paw.alpha,
          }}
        >
          <span className="paw-trail__path">
            <span className="paw-trail__arc">
              <span className="paw-trail__mark">
                <Motif type={paw.type} variant={variant} />
              </span>
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}
