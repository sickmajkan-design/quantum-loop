"use client";

import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

// Logical dimensions of the sign cuboid (px). Faces are positioned from these.
const W = 300;
const H = 176;
const D = 46;
const halfW = W / 2;
const halfH = H / 2;
const halfD = D / 2;

const face = (style: CSSProperties): CSSProperties => ({
  position: "absolute",
  backfaceVisibility: "hidden",
  ...style,
});

export default function SignageScene({
  rowRef,
}: {
  rowRef: RefObject<HTMLDivElement | null>;
}) {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !rowRef.current || !boxRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        boxRef.current,
        { rotateY: 18, rotateX: -6 },
        {
          rotateY: -198,
          rotateX: -6,
          ease: "none",
          scrollTrigger: {
            trigger: rowRef.current,
            start: "top top+=90",
            end: "+=650",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        }
      );
    }, rowRef);

    return () => ctx.revert();
  }, [rowRef]);

  return (
    <div
      className="flex h-full w-full items-center justify-center"
      style={{ perspective: "1200px" }}
      aria-hidden="true"
    >
      <div className="scale-[0.72] sm:scale-90 lg:scale-100">
        <div
          ref={boxRef}
          className="relative motion-reduce:![transform:rotateY(24deg)_rotateX(-6deg)]"
          style={{
            width: W,
            height: H,
            transformStyle: "preserve-3d",
            transform: "rotateY(18deg) rotateX(-6deg)",
          }}
        >
          {/* FRONT — the illuminated advertisement face */}
          <div
            className="sign-face-front"
            style={face({
              inset: 0,
              transform: `translateZ(${halfD}px)`,
              borderRadius: 10,
              border: "2px solid rgba(201,162,39,0.55)",
              background:
                "radial-gradient(120% 130% at 50% 20%, #1a1a1a 0%, #0d0d0d 70%)",
              boxShadow:
                "inset 0 0 34px rgba(201,162,39,0.28), 0 0 30px rgba(201,162,39,0.18)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              overflow: "hidden",
            })}
          >
            <span
              className="font-display"
              style={{
                fontSize: 34,
                letterSpacing: "0.04em",
                lineHeight: 1,
                color: "#F5F2EA",
                textShadow: "0 0 10px rgba(255,255,255,0.25)",
              }}
            >
              QUANTUM
              <span
                style={{
                  color: "#E5C158",
                  textShadow:
                    "0 0 8px rgba(229,193,88,0.9), 0 0 22px rgba(201,162,39,0.6)",
                }}
              >
                LOOP
              </span>
            </span>
            <span
              style={{
                fontSize: 9,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#C9A227",
              }}
            >
              Reklame · 3D slova · Folije
            </span>
          </div>

          {/* BACK — aluminium backing with mounting frame */}
          <div
            style={face({
              inset: 0,
              transform: `rotateY(180deg) translateZ(${halfD}px)`,
              borderRadius: 10,
              background:
                "repeating-linear-gradient(90deg, #171717 0 14px, #131313 14px 28px)",
              border: "2px solid #222",
              boxShadow: "inset 0 0 26px rgba(0,0,0,0.6)",
            })}
          >
            <div
              style={{
                position: "absolute",
                inset: "18% 10%",
                border: "2px solid rgba(201,162,39,0.18)",
                borderRadius: 6,
              }}
            />
          </div>

          {/* RIGHT edge (depth) */}
          <div
            style={face({
              top: 0,
              left: halfW - halfD,
              width: D,
              height: H,
              transform: `rotateY(90deg) translateZ(${halfW}px)`,
              background: "linear-gradient(#3a3226, #17140d)",
              borderTop: "1px solid rgba(229,193,88,0.35)",
              borderBottom: "1px solid rgba(0,0,0,0.6)",
            })}
          />

          {/* LEFT edge (depth) */}
          <div
            style={face({
              top: 0,
              left: halfW - halfD,
              width: D,
              height: H,
              transform: `rotateY(-90deg) translateZ(${halfW}px)`,
              background: "linear-gradient(#17140d, #3a3226)",
              borderTop: "1px solid rgba(229,193,88,0.35)",
              borderBottom: "1px solid rgba(0,0,0,0.6)",
            })}
          />

          {/* TOP edge */}
          <div
            style={face({
              top: halfH - halfD,
              left: 0,
              width: W,
              height: D,
              transform: `rotateX(90deg) translateZ(${halfH}px)`,
              background: "linear-gradient(#4a4130, #2a2419)",
            })}
          />

          {/* BOTTOM edge */}
          <div
            style={face({
              top: halfH - halfD,
              left: 0,
              width: W,
              height: D,
              transform: `rotateX(-90deg) translateZ(${halfH}px)`,
              background: "linear-gradient(#2a2419, #4a4130)",
            })}
          />
        </div>

        {/* soft floor glow */}
        <div
          style={{
            width: W * 0.8,
            height: 22,
            margin: "26px auto 0",
            borderRadius: "50%",
            background:
              "radial-gradient(closest-side, rgba(201,162,39,0.28), transparent)",
            filter: "blur(4px)",
          }}
        />
      </div>
    </div>
  );
}
