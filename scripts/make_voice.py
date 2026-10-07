"""Step 1: script.json -> public/audio/scene-XX.wav (Kokoro, local, free)."""
import json, sys
from pathlib import Path
import numpy as np
import soundfile as sf
from kokoro import KPipeline

ROOT = Path(__file__).resolve().parent.parent
data = json.loads((ROOT / "script.json").read_text(encoding="utf-8"))
out = ROOT / "public" / "audio"
out.mkdir(parents=True, exist_ok=True)

only = {int(a) for a in sys.argv[1:]}  # e.g. python scripts/make_voice.py 3 7  -> redo scenes 3 and 7
pipe = KPipeline(lang_code="a")  # American English
voice = data.get("voice", "am_michael")

for s in data["scenes"]:
    if only and s["id"] not in only:
        continue
    chunks = [np.asarray(a) for _, _, a in pipe(s["narration"], voice=voice, speed=0.95)]
    audio = np.concatenate(chunks)
    path = out / f"scene-{s['id']:02d}.wav"
    sf.write(path, audio, 24000)
    print("wrote", path.name, f"{len(audio)/24000:.1f}s")
