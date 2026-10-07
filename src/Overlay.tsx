import { AbsoluteFill, useCurrentFrame } from "remotion";

/** Global cinematic look: vignette + film grain. Applied over every scene. */
export const Overlay = () => {
  const frame = useCurrentFrame();
  const seed = frame % 4; // grain "flickers" a few times per second
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.09, mixBlendMode: "overlay" }}>
        <filter id={`n${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed={seed} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#n${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};
