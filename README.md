<div align="center">

<img src="assets/logo.svg" alt="Logo" width="170" height="170" />

# 🪐 Kurzgesagt Motion Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Three.js](https://img.shields.io/badge/Three.js-r128-black.svg)](https://threejs.org/)
[![Playwright](https://img.shields.io/badge/Render-Playwright-orange.svg)](https://playwright.dev/)

Turn an **SRT subtitle file** and a **voiceover track** into a finished, high-quality animated explainer video in the dynamic 2D vector motion graphics style.

</div>

---

## 🎬 How It Works

1. **AI Storyboard Director**: Analyzes subtitle timestamps and generates a scene-by-scene visual script with color palettes, visual metaphors, camera easing, and SFX cues.
2. **Three.js Canvas Engine**: Renders procedural vector scenes with parallax backgrounds, rim lights, glows, and kinetic typography.
3. **Headless Chromium Pipeline**: Playwright records deterministic 1080×1920 frames at 30 fps via software WebGL (SwiftShader).
4. **Procedural SFX & Mux**: NumPy generates dynamic risers, booms, swishes, and ducked background drone audio, merged with the voiceover track via FFmpeg.

---

## 📁 Repository Structure

```text
├── assets/
│   └── logo.svg                     # Vector logo
├── skills/
│   └── srt-kurzgesagt-video/
│       ├── SKILL.md                 # Agent instructions & prompt workflow
│       ├── references/
│       │   ├── scene-kit.md         # API, coordinates, helper functions, palettes
│       │   └── storyboard-guide.md  # Storyboard structure and visual metaphors
│       └── scripts/
│           ├── engine/              # Three.js runtime, core components, HTML shell
│           ├── preview.py           # Generates contact sheet previews
│           ├── render.py            # Playwright headless renderer
│           ├── sfx.py               # Algorithmic SFX & ambient drone synthesis
│           └── run_all.sh           # End-to-end automation script
├── plugin.json                      # Antigravity / Gemini CLI plugin manifest
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **FFmpeg** & **FFprobe** installed on system PATH

### Installation
```bash
git clone https://github.com/AnosDevX/-Kurzgesagt-Motion-Engine.git
cd -Kurzgesagt-Motion-Engine
npm install three@0.128.0 @fontsource/anton
pip install playwright numpy
python -m playwright install chromium
```

### Usage

1. **Provide your assets**: Place your `voiceover.mp3` and `subtitles.srt` into your working folder.
2. **Ask your AI Agent**:
   > *"Using the kurzgesagt-motion skill, create an animated video from `subtitles.srt` and `voiceover.mp3`. First draft a complete animated storyboard, wait for my feedback, and then render."*
3. **Preview & Render**:
   - Preview contact sheet: `python scripts/preview.py sheet.png <duration> <t1> <t2> ...`
   - Full render: `bash scripts/run_all.sh . subtitles.srt voiceover.mp3 1080 1920 30`

---

## 🎨 Visual Philosophy
- **Rich 2D Detail**: Multi-layered glows, rim lighting, particles/dust, and vignette.
- **Kinetic Typography**: Large, one-word-at-a-time Anton subtitles timed to voice cadence.
- **Smooth Transitions**: 4 rotating transition styles (wipe, slide, iris, flash) with tailored stereo audio swishes.
