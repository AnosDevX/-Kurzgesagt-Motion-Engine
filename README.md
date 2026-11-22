# Kurzgesagt Motion Studio

Transform subtitle files (SRT) and voiceover tracks into stylized, dynamic, flat-vector animated explainer videos in the iconic **Kurzgesagt / "In a Nutshell"** visual aesthetic.

## Architecture & Workflow

```text
[SRT Subtitles + Voiceover Audio]
                │
                ▼
  [Phase 1: Dynamic Storyboard]
   • Narrative cue mapping & timestamps
   • Visual metaphors & scene staging
   • Dynamic camera push/pan easing
   • Micro-animation & reveal timings
   • Procedural SFX triggers
                │
                ▼
   [Phase 2: Three.js Execution]
   • Procedural 2D vector animation (core.js, scenes.js)
   • Rich layered lighting (glows, rims, shadows, dust)
   • Kinetic typography engine (Anton font)
                │
                ▼
   [Phase 3: Headless Playwright Render & Audio Mux]
   • Deterministic 1080×1920 WebGL frame capture
   • Procedural audio synthesis (swishes, risers, ducked drone)
   • Final MP4 encoding with FFmpeg
```

## Included Components

- **Dynamic Storyboard Guide**: [references/storyboard-guide.md](file:///C:/Users/devx/.gemini/config/plugins/srt-kurzgesagt-video/skills/srt-kurzgesagt-video/references/storyboard-guide.md)
- **Scene Kit & Three.js Reference**: [references/scene-kit.md](file:///C:/Users/devx/.gemini/config/plugins/srt-kurzgesagt-video/skills/srt-kurzgesagt-video/references/scene-kit.md)
- **Animation & Render Engine**:
  - `scripts/engine/core.js`: Vector scene registry, lighting helpers, and procedural shapes.
  - `scripts/engine/runtime.js`: Subtitle synchronization, word timing, and rotating transitions.
  - `scripts/render.py`: Headless Playwright video renderer.
  - `scripts/preview.py`: High-speed contact-sheet generator.
  - `scripts/sfx.py`: Algorithmic sound effects and ambient drone synthesis.
  - `scripts/run_all.sh`: End-to-end batch generation script.

## Getting Started

1. Place your `voiceover.mp3` (or `.wav`) and `subtitles.srt` in your project folder.
2. Direct the agent:
   > *"Using the kurzgesagt-motion skill, create a video from subtitles.srt and voiceover.mp3. Generate a dynamic storyboard first."*
3. Review and approve the storyboard timestamps and visual concepts.
4. The agent writes `scenes.js`, validates previews, and renders the final `1080×1920` MP4.
