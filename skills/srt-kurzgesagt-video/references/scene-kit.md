# Scene kit reference (core.js) — read this before writing scenes.js

## Contents
1. World, camera, layers  2. Palette  3. Helpers  4. Scene recipe  5. Concept → visual metaphors  6. Transitions & SFX events  7. Quality checklist

## 1. World, camera, layers
- World is **9 wide × 16 tall units** (1080×1920). Origin = screen center, +y up. Safe art zone: x ∈ [-4,4], y ∈ [-3.6, 6.8].
- **Words zone**: kinetic subtitle word sits at y ≈ -5.6 (set in runtime.js). Keep important art above y = -3.8.
- Painter's order = creation order (renderOrder). No depth. Create background → mid → foreground in that order.
- Each scene gets a group `g`. The engine zooms/pans it with `cam = [zoom0, zoom1, panX0, panX1, panY0, panY1]` over the scene (e.g. `[1, 1.12, 0, 0, 0, 0]` = slow push-in; add small pan for drift). A punch-in (+0.1 → 0 over 0.6 s) is added automatically at each scene start.
- `bg(g, c1, c2, c3)` draws the radial gradient (center, mid, edge colors) AND a **parallax far layer** (light rays, bokeh circles, hill silhouettes) that moves slower than the foreground. Always call it first.
- A global vignette is applied by the runtime.

## 2. Palette constants
`N` navy `#060a1c`, `CY` cyan, `OR` orange, `RD` red, `GD` gold (the "ideal/imagined" color), `CR` cream, `GR` grey-blue (the "real/seen" color), `BL` person blue. Dramatic/serious mood: dark navy/purple/dark-red backgrounds, one warm accent + one cool accent per scene, red for conflict/pain, gold for idealized things, cyan for calm/clean.

## 3. Helpers (all take a parent group first)
| Helper | What it does |
|---|---|
| `mesh(par, geo, color, opacity, x, y)` | flat transparent mesh, auto render order. Geometries: `CIRC`, `HALF`, `rr(w,h,r)` rounded rect, `arcG(inner,outer,theta0,theta1)` arc, `new THREE.CircleGeometry(1,3)` triangle |
| `grp(par, x, y, scale)` | sub-group |
| `sc(mesh, s)` | uniform scale (safe for 0) |
| `glow(par, x, y, radius, color, op)` | soft 8-layer glow; `.setOp(o)` to fade |
| `person(par, x, y, scale, color, {rim, face:'none', hair})` | bust with hair, ears, neck, collar, 2-tone shading, ground shadow. Returns `{g, calm, wince}` — toggle `.visible` on `calm`/`wince` for expressions. `face:'none'` = back-of-head/faceless |
| `wave(par, n, w, h, color, x, y)` | glowing audio bars. `.set(t, amp, jag, phase, speed)`; `jag` 0 = smooth, ~0.9 = harsh/jagged |
| `arcs(par, x, y, dir, color)` | expanding sound arcs; returns `update(t)` |
| `eye(par, x, y, s)` | almond eye; `.look(dx,dy)` |
| `glyph(par, '?', size, color, x, y)` | big Anton character (?, !, ≠ …) |
| `pop(mesh, t, t0, dur, to)` | overshoot pop-in from local time t0 |
| `sine(par, n, color, y, w)` | dotted sine line; returns `(t, amp, freq, phase)` |
| `dust(g, n, color)` | drifting particles; returns `update(t)` |
| `crowd(g, [[x,y,s,color],…], face)` | several persons |
| `fadeG(group, o)` | fade a group built with `mesh()` (NOT the bg plane) |
| `ease`, `outBack`, `clamp`, `R()` | easing and a seeded random (deterministic per scene) |

## 4. Scene recipe
```js
// S(cues, cam, build, sfx, transition?)  — cues = SRT cue numbers (1-based) shown during this scene
S([3], [1, 1.12, 0, 0, 0, 0], g => {
  bg(g, '#3a1020', '#14081a', '#04020a');           // 1 background + parallax layer
  const D = dust(g, 40, '#ff8a6a');                  // 2 ambient motion
  const glowA = glow(g, 0, 1.5, 2.6, RD, .12);       // 3 light behind the subject
  const A = wave(g, 16, 2.8, 2.2, CY, -2.5, 1.6);    // 4 subject(s)
  return (t, p) => {                                  // t = seconds into scene, p = 0..1 progress
    D(t); A.set(t, 1, 0); glowA.setOp(.5 + .5 * Math.sin(t * 3));
  };
}, [[.4, 'riser']]);                                  // optional SFX: [dt, 'boom'|'riser'|'crack']
```
Rules: **everything must be a pure function of `t`** (frames are rendered independently, any order). Never accumulate state. Two cues can share one scene (`S([8, 9], …)`). Scenes are cut at the midpoint between cues, so one scene = one idea. Aim for 1 scene per 2.5–6 s. Build moments inside a scene (a reveal at `t > 1.7`) to match the narration beat.
Detail that sold the look to the user: light behind subjects (glow), rim light on figures, bokeh + hills + vignette, glowing waveform bars, rising embers/dust, shadows under figures, a second thing happening (sound arcs, ticks, particles). Flat un-lit shapes look cheap — always add glow + highlight + a moving element.

## 5. Concept → visual metaphor (starting points)
sound/voice → waveform bars + arcs; gap/mismatch → chasm between two halves, `≠` sign; ideal self → gold figure with halo inside a head; reality → grey-blue figure; being judged/exposed → spotlight + many eyes; being ignored → crowd with own thought bubbles; can't change it → padlock + sliders that snap back; hiding → curtain; broken belief → cracking bubble + shards; time → ticks sliding + expanding ripples; choice/identity → two figures alternating with big `?`; honesty/reflection → mirror frame with cross-fading figure.

## 6. Transitions & SFX
- Four transition styles rotate automatically and never repeat back-to-back: `wipe` (diagonal band), `iris` (circle close/open), `flash` (soft cream light-leak), `slide` (vertical panel). Force one with the 5th argument of `S`. The cut happens at the exact midpoint when the screen is covered.
- `sfx.py` picks a different soft swish per transition (airy / bright / deep, random length, stereo pan sweep). Extra events in `S(..., sfx)`: `boom` (impact), `riser` (tension build), `crack` (breaking). **Never add per-word pop/tick sounds.**

## 7. Quality checklist before the final render
- Contact-sheet every scene with `preview.py` (use times 1 s into each scene) AND a few frames at cut midpoints.
- Nothing important cropped at the edges after the zoom (scenes zoom up to ~1.2×) and nothing under the word zone.
- Text readable, correct word order, last word not cut early.
- Consecutive scenes look different (color, layout, camera).
