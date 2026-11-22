// ---- timing from the SRT, words, wipe, text ----
const ts = s => { const m = s.match(/(\d+):(\d+):(\d+)[,.](\d+)/); return +m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4] / 1000; };
let CUES = [], TOTAL = 60;
function layout(srt, dur) {
  CUES = srt.replace(/\r/g, '').trim().split(/\n\s*\n/).map(b => { const l = b.split('\n'); const [a, c] = l[1].split(' --> ');
    return { t0: ts(a), t1: ts(c), text: l.slice(2).join(' ').replace(/\s+/g, ' ').trim() }; });
  TOTAL = dur + .5;
  CUES.forEach(c => { const ws = c.text.split(' '), tot = ws.reduce((s, w) => s + w.length + 2, 0); let t = c.t0; const span = Math.max(.2, c.t1 - c.t0 - .04);
    c.words = ws.map(w => { const o = { w, t: t }; t += span * (w.length + 2) / tot; return o; }); });
  SC.forEach((s, i) => { const f = CUES[s.cues[0] - 1], prev = i ? CUES[SC[i - 1].cues.slice(-1)[0] - 1] : null; s.t0 = i ? (prev.t1 + f.t0) / 2 : 0; });
  SC.forEach((s, i) => { s.t1 = i < SC.length - 1 ? SC[i + 1].t0 : TOTAL; });
  // transition style per cut: never the same twice in a row unless forced via S(..., 'wipe'|'iris'|'flash'|'slide')
  const TY = ['wipe', 'iris', 'flash', 'slide']; let pv = -1, sd = 5;
  SC.forEach((s, i) => { if (!i) return; if (s.tr) { pv = TY.indexOf(s.tr); return; } let k; do { sd = (sd * 16807) % 2147483647; k = sd % 4; } while (k === pv); s.tr = TY[k]; pv = k; });
}
const wc = {}; let wordMesh = null;
function wordTex(txt) { if (wc[txt]) return wc[txt]; const c = document.createElement('canvas'), g = c.getContext('2d'); g.font = '250px Anton'; const tw = g.measureText(txt).width;
  c.width = Math.ceil(tw + 90); c.height = 340; g.font = '250px Anton'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 24; g.shadowOffsetY = 10; g.lineWidth = 34; g.strokeStyle = N; g.strokeText(txt, c.width / 2, 180);
  g.shadowColor = 'transparent'; const gr = g.createLinearGradient(0, 60, 0, 300); gr.addColorStop(0, '#fffaf0'); gr.addColorStop(1, '#ffc766'); g.fillStyle = gr; g.fillText(txt, c.width / 2, 180);
  const t = new THREE.CanvasTexture(c); t.minFilter = THREE.LinearFilter; return wc[txt] = { t, w: c.width, h: c.height }; }
const tm = new THREE.MeshBasicMaterial({ transparent: true, depthTest: false, depthWrite: false }), tp = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), tm); tp.renderOrder = 1e6; root.add(tp);
const wipe = new THREE.Group(); wipe.rotation.z = .3; root.add(wipe); const mw = (w, x, c) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 50), new THREE.MeshBasicMaterial({ color: c, depthTest: false, depthWrite: false })); m.position.x = x; m.renderOrder = 2e6; wipe.add(m); };
mw(26, 0, '#070c24'); mw(.35, 13, OR); mw(.14, 13.6, CY); mw(.35, -13, OR); wipe.visible = false;
const tmk = (g, c, op = 1) => { const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: op, depthTest: false, depthWrite: false })); m.renderOrder = 2e6; m.visible = false; root.add(m); return m; };
const iris = tmk(new THREE.CircleGeometry(1, 64), '#070c24'), irisEdge = tmk(new THREE.RingGeometry(.96, 1, 64), OR), flash = tmk(new THREE.PlaneGeometry(30, 30), '#fff1d6', 0);
const slide = new THREE.Group(); root.add(slide); [[20, 44, '#070c24', 0], [20, .35, OR, 22], [20, .35, CY, -22.4]].forEach(([w, h, c, y]) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c, depthTest: false, depthWrite: false })); m.position.y = y; m.renderOrder = 2e6; slide.add(m); });
const vc = document.createElement('canvas'); vc.width = 128; vc.height = 256; { const g2 = vc.getContext('2d'), gr = g2.createRadialGradient(64, 120, 40, 64, 128, 170); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(4,2,12,.62)'); g2.fillStyle = gr; g2.fillRect(0, 0, 128, 256); }
const vg = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(vc), transparent: true, depthTest: false, depthWrite: false })); vg.renderOrder = 5e5; root.add(vg);
const blk = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0, depthTest: false, depthWrite: false })); blk.renderOrder = 3e6; root.add(blk);

window.renderFrame = function (t) {
  let idx = SC.findIndex(s => t >= s.t0 && t < s.t1); if (idx < 0) idx = t < 0 ? 0 : SC.length - 1;
  SC.forEach((s, i) => { s.g.visible = i === idx; }); const s = SC[idx], lt = t - s.t0, p = clamp(lt / (s.t1 - s.t0)), c = s.cam;
  const zs = c[0] + (c[1] - c[0]) * p + .1 * (1 - ease(clamp(lt / .6))); s.g.scale.setScalar(zs); s.g.position.set(c[2] + (c[3] - c[2]) * p, c[4] + (c[5] - c[4]) * p, 0); s.upd(lt, p);
  const fr = s.g.userData.far; if (fr) { fr.scale.setScalar((1 + (zs - 1) * .4) / zs); fr.position.set((.4 - 1) * s.g.position.x / zs, (.4 - 1) * s.g.position.y / zs, 0); }
  let wd = null; for (const q of CUES) { if (t >= q.t0 - .02 && t < q.t1 + .4) { for (const w of q.words) if (t >= w.t) wd = w; if (wd) wd.cue = q; } }
  if (wd) { const tx = wordTex(wd.w.toUpperCase()); tm.map = tx.t; tm.needsUpdate = true; const ph = 2.9 * tx.w / tx.h, k = Math.min(1, 8.3 / ph), u = outBack((t - wd.t) / .22);
    tp.visible = true; tp.scale.set(ph * k * u, 2.9 * k * u, 1); tp.position.set(0, -5.6 + .1 * (1 - clamp((t - wd.t) / .2)), 0); } else tp.visible = false;
  let near = 1e9, tb = 0, ib = 1; SC.forEach((q, i) => { if (i && Math.abs(t - q.t0) < near) { near = Math.abs(t - q.t0); tb = q.t0; ib = i; } });
  [wipe, iris, irisEdge, slide, flash].forEach(o => { o.visible = false; });
  if (near < .4) { const u = clamp((t - tb + .4) / .8), ty = SC[ib].tr;
    if (ty === 'wipe') { wipe.visible = true; wipe.position.x = -22 + 44 * (.5 - .5 * Math.cos(Math.PI * u)); }
    else if (ty === 'iris') { const r = 10.6 * Math.pow(Math.sin(Math.PI * u), 1.3); iris.visible = irisEdge.visible = r > .05; iris.scale.setScalar(r + .01); irisEdge.scale.setScalar(r + .01); }
    else if (ty === 'slide') { slide.visible = true; slide.position.y = -30 + 60 * (.5 - .5 * Math.cos(Math.PI * u)); }
    else { flash.visible = true; flash.material.opacity = Math.pow(Math.sin(Math.PI * u), 1.6) * .96; } }
  blk.material.opacity = Math.max(clamp(1 - t / .5), clamp((t - (TOTAL - 1)) / 1)); renderer.render(root, cam);
  return renderer.domElement.toDataURL('image/jpeg', .93);
};
window.READY = false;
(async () => {
  const f = new FontFace('Anton', 'url(node_modules/@fontsource/anton/files/anton-latin-400-normal.woff2)'); await f.load(); document.fonts.add(f);
  const srt = await (await fetch(P.get('srt') || 'input.srt')).text(); const dur = +(P.get('dur') || 59.01); layout(srt, dur);
  SC.forEach(s => { seed = 11; s.g = new THREE.Group(); root.add(s.g); s.upd = s.build(s.g); });
  window.META = { total: TOTAL, scenes: SC.map(s => ({ t0: s.t0, tr: s.tr, sfx: s.sfx })), words: CUES.flatMap(q => q.words.map(w => w.t)) }; window.READY = true;
})();
