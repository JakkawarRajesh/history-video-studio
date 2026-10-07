"""Step 3: script.json + audio + captions -> src/timeline.json (what Remotion renders)."""
import json
from pathlib import Path
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
data = json.loads((ROOT / "script.json").read_text(encoding="utf-8"))
fps = data.get("fps", 30)
PAD = 0.5  # seconds of breathing room after each line

scenes, cursor = [], 0
for s in data["scenes"]:
    wav = ROOT / "public" / "audio" / f"scene-{s['id']:02d}.wav"
    info = sf.info(wav)
    frames = round((info.duration + PAD) * fps)
    cap = ROOT / "public" / "captions" / f"scene-{s['id']:02d}.json"
    words = json.loads(cap.read_text(encoding="utf-8")) if cap.exists() else []
    scenes.append({"id": s["id"], "from": cursor, "durationInFrames": frames,
                   "audio": f"audio/scene-{s['id']:02d}.wav",
                   "visual": s["visual"], "words": words})
    cursor += frames

out = {"fps": fps, "width": 1920, "height": 1080, "total": cursor, "scenes": scenes}
(ROOT / "src" / "timeline.json").write_text(json.dumps(out, indent=1), encoding="utf-8")
print(f"timeline: {len(scenes)} scenes, {cursor/fps:.1f}s")
