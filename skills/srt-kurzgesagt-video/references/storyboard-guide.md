# Dynamic Storyboard Guide for Kurzgesagt Explainer Videos

Before writing any Three.js code in `scenes.js`, the AI must construct a complete, timestamped, dynamic storyboard. This guarantees that visuals, emotional beats, narration cues, and camera movements remain synchronized.

---

## 1. Storyboarding Principles

1. **One Idea Per Scene (2.5s – 6.0s)**:
   - Group 1 to 3 related subtitle cues into a single cohesive scene.
   - Avoid frantic cuts under 2s unless building rapid montage intensity.
   - Never let a scene exceed 7s without a progressive visual reveal or camera change.

2. **Temporal Alignment**:
   - Every scene starts and ends on precise timestamps derived from the SRT cues.
   - Scenes transition at the silence midpoint between dialogue cues.
   - Pinpoint the exact second (`t_reveal`) where a punchline, key noun, or emotional shift occurs in the narration.

3. **Visual Depth & Layering**:
   - **Background**: Ambient radial gradient + parallax elements (nebula, mountains, bokeh, light rays) moving slower than foreground.
   - **Midground (Subject)**: Characters, anatomical cutaways, scientific apparatus, geometric metaphors.
   - **Foreground & Lighting**: Soft multi-layer glows, rim highlights, rising particles/dust, ground shadows.
   - **Subtitles Zone**: Keep crucial graphics above `y = -3.8` so kinetic subtitles (`y ≈ -5.6`) never overlap artwork.

4. **Dynamic Motion (Everything moves)**:
   - **Camera Push/Drift**: E.g., `cam = [1.0, 1.15, 0, 0, 0, 0]` creates subtle forward tension.
   - **Continuous Ambient Life**: Drifting dust, pulsing sound waves, floating bubbles, blinking eyes, sine-wave oscillation.
   - **Event-Driven Reveals**: Elements popping in with overshoot (`pop()`), groups fading (`fadeG()`), or shapes morphing/cracking at key moments.

---

## 2. Metaphor & Concept Mapping

| Conceptual Beat | Visual Metaphor & Archetypes | Recommended Colors |
| :--- | :--- | :--- |
| **Internal vs External Reality** | Split head / bust; glowing silhouette inside mind vs dull exterior | Gold `GD` & Cyan `CY` vs Grey-Blue `GR` |
| **Exposure / Judgment / Anxiety** | Giant spotlight cone, multiple watchful almond eyes looking at lone figure | Deep Navy `N`, Crimson `RD`, stark White |
| **Disconnection / Paradox** | Chasm / abyss separating two cliffs, floating `≠` or `?` glyphs | Dark Purple, Orange `OR`, Cyan `CY` |
| **Audio / Speech / Voice** | Glowing waveform equalizer bars, radiating concentric sound arcs | Cyan `CY`, Soft Cream `CR` |
| **Trapped / Inevitable** | Heavy padlock, slider gauges that spring back when pulled, iron cages | Charcoal Grey, Danger Red `RD` |
| **Fragile Belief / Illusion** | Translucent glowing bubble that shatters into floating shards | Translucent Cyan `CY`, White highlight |
| **Time Passing / Evolution** | Orbiting celestial bodies, sliding ruler ticks, expanding shockwaves | Gold `GD`, Amber, Midnight Blue |
| **Reflection / Self-Honesty** | Ornate mirror frame with cross-fading, morphing reflections | Silver Grey, Deep Teal, Gold `GD` |

---

## 3. Standard Storyboard Markdown Schema

When presenting the storyboard to the user, format each scene using this structured specification:

```markdown
### Scene [Number]: "[Scene Title]"
- **Time Range**: `[MM:SS.mmm → MM:SS.mmm]` (Duration: `X.X`s)
- **SRT Cue IDs**: `[Cue #, Cue #]`
- **Voiceover Lines**: *"Exact transcription of subtitle text for this scene."*
- **Visual Metaphor**: Description of central objects, characters, and spatial layout.
- **Palette & Mood**:
  - Background: Center color → Mid color → Edge color (e.g., `#2b103c` → `#12091f` → `#05020a`)
  - Accent colors: Primary subject color + highlight rim color
- **Camera Dynamic**: E.g., Push-in `cam = [1.0, 1.14, 0, 0, 0, 0]` + punch-in on entry.
- **Micro-Animations & Keyframes**:
  - `t = 0.0s`: Transition enters (`wipe` / `slide` / `iris` / `flash`). Background ambient dust begins drifting.
  - `t = 1.8s` (on word "[Word]"): Main character turns head; sound wave bars spike.
  - `t = 3.2s`: Question glyph pops in with overshoot.
- **SFX & Sound Cues**:
  - Transition: Soft directional swish.
  - Beat event: `riser` at `t = 1.2s`, gentle `boom` at `t = 2.8s`.
```

---

## 4. Quality Checklist for Storyboard Approval

- [ ] Does every subtitle line from the SRT have an assigned scene?
- [ ] Are scene durations between 2.5s and 6.0s (no rushed or stagnant scenes)?
- [ ] Does consecutive scene color mood provide visual variety (e.g., dark navy -> deep purple -> warm crimson)?
- [ ] Are all transition types varied (wipe, iris, slide, flash without back-to-back repeats)?
- [ ] Does each scene have at least one moving ambient element (dust, wave, pulse)?
- [ ] Is the word zone (`y < -3.8`) kept clear of central subjects?
