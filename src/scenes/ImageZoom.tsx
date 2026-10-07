import { AbsoluteFill, Img, staticFile, interpolate, Easing, useCurrentFrame, useVideoConfig } from "remotion";

type Props = { image: string; zoom?: "in" | "out" | "pan-left" | "pan-right"; label?: string };

export const ImageZoom = ({ image, zoom = "in", label }: Props) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], { easing: Easing.inOut(Easing.ease) });

  let scale = 1.12, x = 0;
  if (zoom === "in") scale = 1.0 + 0.18 * p;
  if (zoom === "out") scale = 1.18 - 0.18 * p;
  if (zoom === "pan-left") { scale = 1.15; x = 3 - 6 * p; }
  if (zoom === "pan-right") { scale = 1.15; x = -3 + 6 * p; }

  const fadeIn = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateRight: "clamp" });
  const labelOpacity = interpolate(frame, [fps * 0.6, fps * 1.2, fps * 3.5, fps * 4.2], [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fadeIn, overflow: "hidden" }}>
      <Img src={staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover",
        transform: `translateX(${x}%) scale(${scale})` }} />
      {label && (
        <div style={{ position: "absolute", top: 70, left: 90, opacity: labelOpacity, color: "#f3e9d2",
          fontFamily: "Georgia, serif", fontSize: 46, letterSpacing: 2, textShadow: "0 2px 12px #000" }}>
          {label}
        </div>
      )}
    </AbsoluteFill>
  );
};
