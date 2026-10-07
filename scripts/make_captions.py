"""Step 2: audio -> word-level timings in public/captions/scene-XX.json (Whisper, local, free)."""
import json, sys
from pathlib import Path
import numpy as np
import soundfile as sf
from faster_whisper import WhisperModel


def load_16k_mono(path):
    """Read the wav ourselves (no PyAV) and resample to the 16 kHz mono float32 Whisper expects."""
    audio, sr = sf.read(str(path), dtype="float32")
    if audio.ndim > 1:
        audio = audio.mean(axis=1)
    if sr != 16000:
        n = int(round(len(audio) * 16000 / sr))
        audio = np.interp(np.linspace(0, len(audio) - 1, n), np.arange(len(audio)), audio).astype("float32")
    return audio

ROOT = Path(__file__).resolve().parent.parent
data = json.loads((ROOT / "script.json").read_text(encoding="utf-8"))
cap_dir = ROOT / "public" / "captions"
cap_dir.mkdir(parents=True, exist_ok=True)

only = {int(a) for a in sys.argv[1:]}
model = WhisperModel("small", device="cpu", compute_type="int8")

for s in data["scenes"]:
    if only and s["id"] not in only:
        continue
    wav = ROOT / "public" / "audio" / f"scene-{s['id']:02d}.wav"
    segments, _ = model.transcribe(load_16k_mono(wav), word_timestamps=True, language="en")
    words = [{"text": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)}
             for seg in segments for w in seg.words]
    (cap_dir / f"scene-{s['id']:02d}.json").write_text(json.dumps(words, indent=1), encoding="utf-8")
    print("wrote captions for scene", s["id"], f"({len(words)} words)")
