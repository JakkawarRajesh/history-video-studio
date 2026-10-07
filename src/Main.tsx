import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import timeline from "./timeline.json";
import { ImageZoom } from "./scenes/ImageZoom";
import { Captions } from "./Captions";
import { Overlay } from "./Overlay";

export const Main = () => (
  <AbsoluteFill style={{ backgroundColor: "#0b0b0b" }}>
    {timeline.scenes.map((s: any) => (
      <Sequence key={s.id} from={s.from} durationInFrames={s.durationInFrames}>
        {/* Add more scene types here: MapRoute, QuoteCard, DateTitle, Timeline... */}
        <ImageZoom {...s.visual} />
        <Audio src={staticFile(s.audio)} />
        <Captions words={s.words} />
      </Sequence>
    ))}
    <Overlay />
  </AbsoluteFill>
);
