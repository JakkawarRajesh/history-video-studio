import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

type Word = { text: string; start: number; end: number };

export const Captions = ({ words }: { words: Word[] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!words || words.length === 0) return null;
  const t = frame / fps;

  let current = words.findIndex((w) => t >= w.start && t < w.end);
  if (current === -1) current = Math.max(0, words.findIndex((w) => t < w.start) - 1);
  if (t >= words[words.length - 1].end) current = words.length - 1;

  const GROUP = 5;
  const groupStart = Math.floor(current / GROUP) * GROUP;
  const group = words.slice(groupStart, groupStart + GROUP);

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 120 }}>
      <div style={{ display: "flex", gap: 16, fontFamily: "Arial Black, Arial, sans-serif",
        fontSize: 64, fontWeight: 900, textShadow: "0 4px 16px #000, 0 0 4px #000" }}>
        {group.map((w, i) => (
          <span key={groupStart + i} style={{ color: groupStart + i === current ? "#ffd54a" : "#ffffff" }}>
            {w.text}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
