---
name: srt-kurzgesagt-video
description: Turn an SRT subtitle file + voiceover audio into a finished animated explainer video (MP4 with sound effects) in the Kurzgesagt / "In a Nutshell" flat-vector motion-graphics style, using three.js rendered headlessly, no external assets. Uses a dynamic storyboard-driven workflow to synchronize visual metaphors, camera easing, kinetic typography, and procedural SFX to timestamps.
---

# SRT → Kurzgesagt-style Explainer Video (Three.js Engine)

A deterministic motion graphics pipeline: **SRT Subtitles + Voiceover** → **Dynamic Storyboard Planning** → `renderFrame(t)` procedural drawing in Three.js → Headless Playwright/Chromium WebGL frame capture → FFmpeg video encoding → Algorithmic SFX & ambient drone audio synthesis (NumPy) mixed with voiceover.

## What the User Gets

- **Vertical Format** (default 1080×1920, 30 fps, optimized for Shorts/Reels/TikTok/mobile).
- **12–20 Illustrated Scenes** synchronized to subtitle timestamps, each with rich lighting, glows, rim highlights, and ambient particles.
- **Kinetic Subtitles**: Big, punchy single-word text (Anton font) centered at `y ≈ -5.6`, automatically distributed by cadence without audio pop artifacts.
- **Dynamic Camera Moves**: Smooth push-in zoom and pan easing per scene (`cam = [zoom0, zoom1, panX0, panX1, panY0, panY1]`).
- **Rotating Transitions**: 4 automatic non-repeating transition styles (`wipe`, `iris`, `slide`, `flash`).
- **Rich Procedural Soundscape**: Stereo swishes, risers, booms, impact cracks, and an algorithmic ducked drone under narration.

## Standing Design Rules

- **Mandatory Storyboard First**: Never jump straight into code. Always parse the SRT into a complete, dynamic scene storyboard with timestamps and visual metaphors first.
- **Mood**: Serious and dramatic by default (dark navy/purple/crimson backgrounds, soft radial light gradients, glowing rims).
- **Rich Detail**: Avoid flat, unlit geometric shapes. Every scene requires ambient depth (glow behind subjects, rim highlights, shadow beneath figures, and drifting particles/dust).
- **Word Zone Safety**: Keep all critical subject art above `y = -3.8` so kinetic words never occlude the illustration.

---

## Workflow

### 1. Gather Inputs
- Collect the `.srt` subtitle file and voiceover audio track (`.mp3` or `.wav`).
- Confirm dimensions (default: vertical `1080×1920`).
- Read and parse the SRT file completely to map all cue numbers and timestamps.

### 2. Generate the Dynamic Storyboard (Mandatory)
Before writing any Three.js code, produce a full, animated storyboard following `references/storyboard-guide.md`.
- Group cues into 12–20 scenes, **one core concept per scene** (2.5s–6.0s duration).
- Map each scene to a visual metaphor from `references/scene-kit.md` §5 and `references/storyboard-guide.md`.
- Detail the exact micro-animation triggers (`t_reveal`) corresponding to key narration words.
- Present the structured Storyboard to the user for review or confirmation before generating scenes.

### 3. Set Up Work Directory
```bash
S=<path-to-this-skill>/scripts; W=/tmp/video_build
mkdir -p $W && cd $W
cp $S/engine/{core.js,runtime.js,scenes.js,index.html} .
cp <path/to/subtitles.srt> input.srt; cp <path/to/audio.mp3> voice_src
npm install three@0.128.0 @fontsource/anton --no-audit --no-fund
python3 -m playwright install chromium
setsid nohup python3 -m http.server 8765 >/dev/null 2>&1 </dev/null &
```

### 4. Implement `scenes.js`
Translate the approved Storyboard into JavaScript using `core.js` helpers (`bg`, `mesh`, `glow`, `person`, `wave`, `arcs`, `eye`, `dust`, `sine`, `crowd`, `pop`).
- Each scene is registered as `S(cues, cam, build, sfx, [transition])`.
- Ensure all animation within `build` is a **pure function of time `t`** (no state accumulation) so frames remain fully deterministic.

### 5. Preview & Quality Validation
```bash
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 voice_src)
# Generate metadata and low-res frame probe
python3 $S/render.py 360 640 30 0 0.1 /tmp/probe.mp4 $DUR 2>&1 | tail -1
# Generate 6-column contact sheet across key scene timestamps
python3 $S/preview.py sheet.png $DUR <t1> <t2> <t3> ...
```
Inspect the contact sheet to verify:
1. Framing (no elements clipped during camera push-ins).
2. Clean separation from the lower subtitle zone (`y < -3.8`).
3. Distinct color moods across consecutive scenes.

### 6. Full Render + Algorithmic Sound Design + Mux
Run the complete pipeline:
```bash
$S/run_all.sh $W input.srt voice_src 1080 1920 30 [heartbeat_start:end]
```
Or step-by-step:
1. Render silent visual frames: `python3 $S/render.py 1080 1920 30 0 $DUR silent.mp4 $DUR`
2. Synthesize audio mix (SFX + drone + voice): `python3 $S/sfx.py voice_src mix.wav`
3. Combine video & audio: `ffmpeg -i silent.mp4 -i mix.wav -c:v copy -c:a aac -b:a 192k -shortest final.mp4`

### 7. Review & Deliver
- Output final video and a summary contact sheet for review.
- Provide hook title suggestions and caption tags if publishing to TikTok / YouTube Shorts / Reels.

---

## File Reference
- `references/storyboard-guide.md`: Detailed storyboard structure, scene pacing, and visual metaphor guidelines.
- `references/scene-kit.md`: Coordinate system, color palettes, Three.js helper API, transitions, and quality checklist.
- `scripts/engine/`: `core.js` (scene registry & drawing helpers), `runtime.js` (timing, subtitle engine, transitions), `scenes.js` (scene implementations).
- `scripts/`: `preview.py`, `render.py`, `sfx.py`, `run_all.sh`.
