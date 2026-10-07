import { Composition } from "remotion";
import { Main } from "./Main";
import timeline from "./timeline.json";

export const Root = () => (
  <Composition
    id="Main"
    component={Main}
    durationInFrames={Math.max(timeline.total, 30)}
    fps={timeline.fps}
    width={timeline.width}
    height={timeline.height}
  />
);
