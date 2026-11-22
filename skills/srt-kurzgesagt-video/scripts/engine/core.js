// Kurzgesagt-style SRT-driven scene engine (three.js r128). Deterministic: renderFrame(t) draws any time t.
const P = new URLSearchParams(location.search);
const PW = +P.get('w') || 1080, PH = +P.get('h') || 1920, W = 9, H = 16;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(PW, PH); document.body.appendChild(renderer.domElement);
const cam = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, .1, 100); cam.position.z = 20;
const root = new THREE.Scene();
const N = '#060a1c', CY = '#4fd8ff', OR = '#ff7a3d', RD = '#ff3b4e', GD = '#ffcf6b', CR = '#fff1d6', GR = '#7d8bb8', BL = '#4a5fb5';
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
const outBack = u => { u = clamp(u); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };
let seed = 11; const R = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
let RO = 0; const geo = {};
const CIRC = new THREE.CircleGeometry(1, 48), HALF = new THREE.CircleGeometry(1, 40, 0, Math.PI);
const rr = (w, h, r) => { const k = w + '|' + h + '|' + r; if (geo[k]) return geo[k];
  const x = -w / 2, y = -h / 2, s = new THREE.Shape(); r = Math.min(r, w / 2, h / 2);
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return geo[k] = new THREE.ShapeGeometry(s, 8); };
const arcG = (a, b, t0, t1) => new THREE.RingGeometry(a, b, 40, 1, t0, t1);
function mesh(par, g, col, op = 1, x = 0, y = 0) {
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, depthTest: false, depthWrite: false }));
  m.material.userData = { o: op }; m.position.set(x, y, 0); m.renderOrder = ++RO; par.add(m); return m; }
const grp = (par, x = 0, y = 0, s = 1) => { const g = new THREE.Group(); g.position.set(x, y, 0); g.scale.setScalar(s); par.add(g); return g; };
const fadeG = (g, o) => g.traverse(m => { if (m.material) m.material.opacity = m.material.userData.o * o; });
const sc = (m, s) => m.scale.setScalar(Math.max(s, 1e-4));
function bg(g, c1, c2, c3) {
  const c = document.createElement('canvas'); c.width = 128; c.height = 256; const x = c.getContext('2d');
  const gr = x.createRadialGradient(64, 100, 6, 64, 128, 190); gr.addColorStop(0, c1); gr.addColorStop(.55, c2); gr.addColorStop(1, c3);
  x.fillStyle = gr; x.fillRect(0, 0, 128, 256); const t = new THREE.CanvasTexture(c); t.minFilter = t.magFilter = THREE.LinearFilter;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.8, H * 1.8), new THREE.MeshBasicMaterial({ map: t, depthTest: false, depthWrite: false }));
  m.renderOrder = ++RO; g.add(m);
  const far = new THREE.Group(); g.add(far); g.userData.far = far; const C = k => new THREE.Color(k), lt = C(c1).lerp(C('#ffffff'), .35);
  for (let i = 0; i < 3; i++) { const sh = new THREE.Shape(); sh.moveTo(-.25 - i * .1, 9); sh.lineTo(.25 + i * .1, 9); sh.lineTo((i - 1) * 6 + 2.2, -9); sh.lineTo((i - 1) * 6 - 2.2, -9); mesh(far, new THREE.ShapeGeometry(sh), lt, .045); }
  for (let i = 0; i < 9; i++) { const b = mesh(far, CIRC, lt, .04 + R() * .06, (R() - .5) * 11, (R() - .3) * 13); sc(b, .5 + R() * 1.4); }
  [[-5.6, .55, .5, '#02030c', .55], [-6.6, .7, .35, '#02030c', .8]].forEach(([base, a, f, col, op], k) => { const sh = new THREE.Shape(); sh.moveTo(-8, -12);
    for (let xx = -8; xx <= 8.01; xx += .4) sh.lineTo(xx, base + a * Math.sin(xx * f + k * 2.1) + a * .6 * Math.sin(xx * f * 2.7 + k) + (R() > .6 ? .25 * R() : 0)); sh.lineTo(8, -12);
    mesh(far, new THREE.ShapeGeometry(sh), C(c2).lerp(C(col), .6), op); });
}
function dust(g, n, col) { const a = []; for (let i = 0; i < n; i++) { const m = mesh(g, CIRC, col, .12 + R() * .4, 0, 0); sc(m, .02 + R() * .05);
    a.push([m, (R() - .5) * W * 1.4, R() * H * 1.2, .25 + R() * .5, R() * 6]); }
  return t => a.forEach(([m, x, y, v, ph]) => { m.position.set(x + Math.sin(t * .5 + ph) * .15, ((y + t * v) % (H * 1.2)) - H * .6, 0); }); }
function glow(g, x, y, r, col, op) { const q = grp(g, x, y); [1, .86, .72, .6, .48, .38, .28, .18].forEach((k, i) => sc(mesh(q, CIRC, col, op * (.3 + i * .22)), r * k));
  q.setOp = o => fadeG(q, o); return q; }
function person(par, x, y, s, col, o = {}) {
  const p = grp(par, x, y, s), C = c => new THREE.Color(c), dk = (c, f) => C(c).lerp(C('#02030c'), f), lt = (c, f) => C(c).lerp(C('#ffffff'), f);
  const hair = o.hair || dk(col, .55), ink = '#0a1030';
  mesh(p, CIRC, '#02030c', .35, 0, -1.55).scale.set(2.1, .26, 1);
  if (o.rim) { mesh(p, HALF, o.rim, 1, 0, -1.5).scale.set(1.8, 1.6, 1); sc(mesh(p, CIRC, o.rim, 1, 0, .45), .9); }
  mesh(p, rr(.44, .7, .12), dk(col, .4), 1, 0, -.1);
  mesh(p, HALF, dk(col, .32), 1, 0, -1.5).scale.set(1.7, 1.5, 1);
  mesh(p, HALF, col, 1, -.07, -1.47).scale.set(1.6, 1.43, 1);
  const cl = mesh(p, new THREE.CircleGeometry(1, 3), lt(col, .6), .9, 0, -.2); cl.rotation.z = -Math.PI / 2; cl.scale.set(.44, .52, 1);
  mesh(p, rr(.9, .05, .02), lt(col, .5), .35, -.5, -.85).rotation.z = .5;
  [-1, 1].forEach(sd => sc(mesh(p, CIRC, dk(col, .28), 1, sd * .81, .4), .13));
  sc(mesh(p, CIRC, dk(col, .3), 1, 0, .45), .82); sc(mesh(p, CIRC, lt(col, .1), 1, -.05, .48), .75);
  mesh(p, HALF, hair, 1, 0, .62).scale.set(.85, .8, 1); sc(mesh(p, CIRC, hair, 1, -.42, .78), .3); sc(mesh(p, CIRC, lt(hair, .18), .5, -.5, .95), .1);
  const calm = grp(p), wince = grp(p);
  [-1, 1].forEach(sd => { sc(mesh(calm, CIRC, ink, .9, sd * .3, .4), .075); mesh(calm, rr(.22, .045, .02), ink, .7, sd * .3, .55); sc(mesh(calm, CIRC, '#ff7a90', .22, sd * .47, .22), .1); });
  mesh(calm, arcG(.2, .27, Math.PI * 1.15, Math.PI * .7), ink, .85, 0, .34);
  [[-.3, .4], [.3, -.4]].forEach(([ex, r]) => { mesh(wince, rr(.24, .06, .03), ink, .9, ex, .4).rotation.z = -r * .2; mesh(wince, rr(.24, .05, .02), ink, .75, ex, .58).rotation.z = r; });
  mesh(wince, arcG(.2, .27, Math.PI * .15, Math.PI * .7), ink, .85, 0, .14);
  if (o.face === 'none') { calm.visible = wince.visible = false; } else wince.visible = false;
  return { g: p, calm, wince }; }
function wave(par, n, w, h, col, x, y) { const q = grp(par, x, y), bw = w / n * .6, bars = [], C = new THREE.Color(col), WH = new THREE.Color('#ffffff');
  for (let i = 0; i < n; i++) { const u = i / n, px = -w / 2 + (i + .5) * w / n, c = C.clone().lerp(WH, .3 * Math.sin(u * 3.14));
    bars.push([mesh(q, rr(bw * 2.6, 1, bw * 1.3), col, .12, px, 0), mesh(q, rr(bw, 1, bw / 2), c, 1, px, 0), mesh(q, rr(bw * .26, 1, bw * .13), '#ffffff', .4, px - bw * .22, 0)]); }
  q.set = (t, amp = 1, jag = 0, ph = 0, sp = 2) => bars.forEach(([a, b, c], i) => { const u = i / n;
    let v = .5 + .5 * Math.sin(u * 9 + t * sp + ph) * Math.sin(u * 3.3 - t * .7 + ph); v = .14 + v * .86;
    if (jag) v = v * (1 - jag) + jag * (.15 + .85 * Math.abs(Math.sin(i * 12.9898 + Math.floor(t * 6) * 3.1 + ph * 7)));
    const hh = Math.max(.05, v * h * amp); b.scale.y = hh; a.scale.y = hh + .22; c.scale.y = hh * .78; });
  q.bars = bars; return q; }
function arcs(par, x, y, dir, col) { const q = grp(par, x, y); q.rotation.z = dir; const a = [0, 1, 2].map(() => mesh(q, arcG(.92, 1, -.55, 1.1), col, .8));
  return t => a.forEach((m, k) => { const ph = (t * 1.1 + k / 3) % 1; sc(m, .5 + ph * 2.6); m.material.opacity = (1 - ph) * .8; }); }
function eye(par, x, y, s) { const q = grp(par, x, y, s); mesh(q, CIRC, '#f4f7ff').scale.set(1, .52, 1);
  const ir = mesh(q, CIRC, RD, 1); sc(ir, .34); const pu = mesh(q, CIRC, '#150008', 1); sc(pu, .16); q.look = (dx, dy) => { ir.position.set(dx, dy, 0); pu.position.set(dx, dy, 0); }; return q; }
function glyph(par, ch, size, col, x, y) { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
  g.font = '230px Anton'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineWidth = 18; g.lineJoin = 'round'; g.strokeStyle = N; g.strokeText(ch, 128, 140);
  g.fillStyle = col; g.fillText(ch, 128, 140); const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthTest: false, depthWrite: false }));
  m.material.userData = { o: 1 }; m.position.set(x, y, 0); m.renderOrder = ++RO; par.add(m); return m; }
const pop = (m, t, t0, d = .4, to = 1) => { const u = (t - t0) / d; m.visible = u > 0; sc(m, to * outBack(u)); };
const sine = (par, n, col, y, w) => { const a = []; for (let i = 0; i < n; i++) { const m = mesh(par, CIRC, col, .95, -w / 2 + w * i / (n - 1), y); sc(m, .06); a.push(m); }
  return (t, A, f, ph) => a.forEach((m, i) => { m.position.y = y + A * Math.sin(i / n * f * 6.28 + t * 1.6 + ph); }); };
const crowd = (g, ys, mode) => { const out = []; ys.forEach(([x, y, s, col]) => out.push(person(g, x, y, s, col, { face: mode })));
  return out; };

const SC = [];
// S(cueNumbers, [zoom0,zoom1,panX0,panX1,panY0,panY1], build(g)->update(t,p), sfx=[[dt,'boom'|'riser'|'crack']], transition?)
const S = (cues, cam, build, sfx, tr) => SC.push({ cues, cam, build, sfx: sfx || [], tr });
