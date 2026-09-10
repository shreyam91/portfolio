"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * JourneyLoader — "The Journey Begins"
 *
 * A short (~2.8s), purely visual intro that opens Shreyam's story as a journey
 * across a dark canvas:
 *
 *   ●─────────────────○────⊘────○─────────────────◉
 *   START            learning …            NOW
 *
 * A single glowing point appears, a thin route draws ahead of it through a
 * few quiet waypoints (learning → experimenting → building), and it arrives
 * at a lit destination, which triggers the homepage reveal.
 *
 * Deliberately NOT a loading indicator: no percentages, no "Loading…", no
 * progress bar, no status text. It reads as the first tiny chapter of the
 * story, then gets out of the way (~2.8s, shorter for returning visitors and
 * near-instant under prefers-reduced-motion).
 *
 * Implementation notes:
 *   - One framer-motion MotionValue drives everything (0→1), kept in perfect
 *     sync: the route draws via SVG `pathLength`, the glowing traveler moves
 *     via CSS `offset-path` + `offsetDistance`, waypoints light up as it
 *     passes their progress thresholds, and the destination brightens on
 *     arrival. GPU-friendly transforms and opacity only.
 *   - The route adapts: horizontal on ≥640px, vertical on mobile.
 *   - The canvas is intentionally dark (cinematic) and resolves into the
 *     user's chosen site theme on reveal.
 */

const EASE: [number, number, number, number] = [0.45, 0, 0.3, 1];

// Geometry per orientation. `d` (path) and `offsetPath` refer to the same
// line so the traveler always sits exactly on the drawn route.
const DESKTOP = {
  viewBox: "0 0 800 220",
  d: "M 70 170 C 150 160 200 100 280 115 C 360 130 350 195 445 185 C 540 175 540 85 630 100 C 700 110 685 150 745 150",
  start: { x: 70, y: 170 },
  end: { x: 745, y: 150 },
  labelStart: { x: 70, y: 212 },
  labelEnd: { x: 745, y: 185 },
  stages: [
    { x: 237, y: 122, label: "learning" },
    { x: 415, y: 197, label: "experimenting" },
    { x: 588, y: 103, label: "building" },
  ],
};

const MOBILE = {
  viewBox: "0 0 240 560",
  d: "M 120 64 C 70 128 190 168 120 224 C 60 275 180 320 120 378 C 78 424 168 466 120 520",
  start: { x: 120, y: 64 },
  end: { x: 120, y: 520 },
  labelStart: { x: 120, y: 44 },
  labelEnd: { x: 120, y: 550 },
  stages: [
    { x: 108, y: 190, label: "learning" },
    { x: 150, y: 300, label: "experimenting" },
    { x: 105, y: 428, label: "building" },
  ],
};

function getReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export default function JourneyLoader({ onFinish }: { onFinish: () => void }) {
  const [reduced] = useState(getReducedMotion);
  const [short, setShort] = useState(false); // returning visitor this session
  const [mobile, setMobile] = useState(false);
  const [started, setStarted] = useState(false);
  const [arrived, setArrived] = useState(false);

  const progress = useMotionValue(0);
  const pulse = useMotionValue(0);

  const isFull = !short && !reduced;
  const G = mobile ? MOBILE : DESKTOP;

  // Traveler sits on the route tip — same line as `d`, so it never drifts.
  const travelerDist = useTransform(
    progress,
    (v) => `${(v * 100).toFixed(2)}%`,
  );
  const travelerOpacity = useTransform(progress, [0, 0.02, 1], [0, 1, 1]);

  // Destination: dim until the traveler nears, then lights up.
  const destOpacity = useTransform(progress, [0.9, 1], [0.25, 1]);
  const destScale = useTransform(progress, [0.9, 1], [0.85, 1.1]);

  // Waypoints brighten as the traveler passes each one.
  const w1 = useTransform(progress, [0.26, 0.32], [0.12, 1]);
  const w2 = useTransform(progress, [0.52, 0.58], [0.12, 1]);
  const w3 = useTransform(progress, [0.76, 0.82], [0.12, 1]);
  // Stage labels drift in even more faintly.
  const l1 = useTransform(progress, [0.26, 0.4], [0, 0.45]);
  const l2 = useTransform(progress, [0.52, 0.66], [0, 0.45]);
  const l3 = useTransform(progress, [0.76, 0.9], [0, 0.45]);

  const stageOpacities = [w1, w2, w3];
  const labelOpacities = [l1, l2, l3];

  // START label recedes once the journey is underway.
  const startLabelOpacity = useTransform(progress, [0, 0.1], [1, 0.45]);

  // Arrival pulse ring.
  const ringOpacity = useTransform(pulse, [0, 0.7, 1], [0.55, 0.15, 0]);
  const ringScale = useTransform(pulse, [0, 1], [0.4, 2.4]);

  // Returning visitors: mark the first full intro, then go short next time.
  useEffect(() => {
    let seen = false;
    try {
      if (window.sessionStorage.getItem("welcome_seen") === "1") {
        seen = true;
      } else {
        window.sessionStorage.setItem("welcome_seen", "1");
      }
    } catch {
      /* storage disabled — full intro each load */
    }
    setShort(seen);
  }, []);

  // Responsive orientation.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Timeline driver — deterministic ≈2.8s full, ≈0.5s short, ≈0.3s reduced.
  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(() => !cancelled && fn(), ms));
    };

    if (isFull) {
      wait(60, () => setStarted(true));
      wait(300, () => {
        animate(progress, 1, { duration: 1.95, ease: EASE });
      });
      wait(2240, () => setArrived(true));
      wait(2780, onFinish);
    } else {
      wait(40, () => setStarted(true));
      wait(80, () => {
        animate(progress, 1, {
          duration: reduced ? 40 : 220,
          ease: "linear",
        });
      });
      wait(170, () => setArrived(true));
      wait(reduced ? 240 : 420, onFinish);
    }

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      progress.stop();
      pulse.stop();
    };
  }, [isFull, reduced, onFinish, progress, pulse]);

  useEffect(() => {
    if (arrived) animate(pulse, 1, { duration: 1, ease: "easeOut" });
  }, [arrived, pulse]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#0a0a0a] text-[#fcfcfc]"
      initial={{ opacity: 1 }}
      exit={{
        y: "-100%",
        opacity: 0,
        transition: { duration: reduced ? 0.2 : 0.7, ease: [0.76, 0, 0.24, 1] },
      }}
      aria-label="The Journey Begins"
    >
      {/* Subtle depth on the dark canvas */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0f172a]/60 opacity-70 blur-[140px]" />
        <div className="welcome-grain opacity-[0.04]" />
      </div>

      <motion.svg
        viewBox={G.viewBox}
        className={
          mobile
            ? "relative z-10 h-[64vh] w-auto"
            : "relative z-10 w-[min(80vw,720px)]"
        }
        fill="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: started ? 1 : 0 }}
        transition={{ duration: started ? 0.6 : 0.1, ease: "easeOut" }}
        role="img"
        aria-label="A journey from start to now, passing through learning, experimenting, and building"
      >
        <defs>
          <filter id="jl-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Faint planned route */}
        <path
          d={G.d}
          stroke="rgba(148,163,184,0.16)"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Traveled route draws ahead as the point moves */}
        <motion.path
          d={G.d}
          stroke="#3b82f6"
          strokeWidth="1.4"
          strokeLinecap="round"
          style={{ pathLength: progress }}
        />

        {/* Start marker */}
        <circle
          cx={G.start.x}
          cy={G.start.y}
          r="2.5"
          fill="rgba(148,163,184,0.5)"
        />

        {/* Waypoints light as the traveler passes */}
        {G.stages.map((s, i) => (
          <g key={s.label}>
            <motion.circle
              cx={s.x}
              cy={s.y}
              r="3"
              fill="#3b82f6"
              style={{ opacity: stageOpacities[i] }}
            />
            <motion.text
              x={s.x}
              y={s.y - 16}
              textAnchor="middle"
              fontSize="9"
              fill="rgba(226,232,240,0.6)"
              fontFamily="var(--font-geist-mono), monospace"
              letterSpacing="0.2em"
              style={{ opacity: labelOpacities[i] }}
            >
              {s.label}
            </motion.text>
          </g>
        ))}

        {/* Destination */}
        <motion.g
          style={{
            opacity: destOpacity,
            transformOrigin: `${G.end.x}px ${G.end.y}px`,
          }}
        >
          <motion.circle
            cx={G.end.x}
            cy={G.end.y}
            r="7"
            fill="#3b82f6"
            style={{ scale: destScale }}
            filter="url(#jl-glow)"
          />
          <motion.circle
            cx={G.end.x}
            cy={G.end.y}
            r="7"
            fill="#ffffff"
            opacity="0.9"
            style={{ scale: destScale }}
          />
          <motion.circle
            cx={G.end.x}
            cy={G.end.y}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.5"
            style={{
              opacity: ringOpacity,
              scale: ringScale,
              transformOrigin: `${G.end.x}px ${G.end.y}px`,
            }}
          />
        </motion.g>

        {/* The glowing traveler on the route tip */}
        <motion.circle
          r="3.6"
          fill="#60a5fa"
          style={{
            offsetPath: `path("${G.d}")`,
            offsetDistance: travelerDist,
            offsetRotate: "0deg",
            opacity: travelerOpacity,
            scale: destScale,
          }}
          filter="url(#jl-glow)"
        />

        {/* START label — faint, recedes once the journey begins */}
        <motion.text
          x={G.labelStart.x}
          y={G.labelStart.y}
          textAnchor="middle"
          fontSize="9"
          fill="rgba(148,163,184,0.55)"
          fontFamily="var(--font-geist-mono), monospace"
          letterSpacing="0.25em"
          style={{ opacity: startLabelOpacity }}
        >
          START
        </motion.text>

        {/* NOW label — emerges on arrival */}
        <motion.text
          x={G.labelEnd.x}
          y={G.labelEnd.y}
          textAnchor="middle"
          fontSize="11"
          fill="#fcfcfc"
          fontFamily="var(--font-geist-mono), monospace"
          letterSpacing="0.3em"
          style={{ opacity: destOpacity }}
        >
          NOW
        </motion.text>
      </motion.svg>
    </motion.div>
  );
}
