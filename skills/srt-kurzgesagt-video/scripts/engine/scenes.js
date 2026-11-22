// EDIT THIS FILE PER VIDEO: one S(...) per idea. Example below = 'Why you hate your own voice' (17 scenes).
// 1 — the wince
S([1], [1, 1.1, 0, 0, 0, 0], g => { bg(g, '#3a1634', '#12102e', '#04061a'); const D = dust(g, 40, '#ff9a7a');
  const rg = glow(g, 1.9, 1.3, 2.6, RD, .1); const ph = grp(g, -2.1, 1.6); ph.rotation.z = .12;
  mesh(ph, rr(2.2, 4, .35), '#2a3480'); mesh(ph, rr(1.95, 3.65, .25), '#070b22'); const w1 = wave(ph, 7, 1.4, 1.5, OR, 0, -.2);
  const dot = mesh(ph, CIRC, RD, 1, 0, 1.35); sc(dot, .14); const pr = person(g, 1.9, 1.3, 1.15, BL, { rim: CY }); const ar = arcs(g, -.85, 1.6, 0, CY);
  return (t) => { D(t); w1.set(t, 1, .25); dot.material.opacity = .5 + .5 * Math.abs(Math.sin(t * 5)); ar(t);
    const w = t > 1.7; pr.calm.visible = !w; pr.wince.visible = w; rg.setOp(w ? clamp((t - 1.7) * 3) : 0);
    pr.g.position.x = 1.9 + (w ? Math.sin(t * 70) * .07 * Math.max(0, 1 - (t - 1.7) * 1.4) : 0); }; }, [[1.7, 'boom']]);
// 2 — only you
S([2], [1, 1.1, 0, -.3, 0, 0], g => { bg(g, '#0f2a52', '#08122c', '#03050e'); const D = dust(g, 40, CY);
  const back = crowd(g, [[-3.3, 3.4, .75, '#243468'], [-1.6, 3.4, .75, '#2a3b74'], [0, 3.4, .75, '#243468'], [1.6, 3.4, .75, '#2a3b74'], [3.3, 3.4, .75, '#243468']]);
  const mid = crowd(g, [[1.2, .6, 1, '#32458a'], [3.3, .6, 1, '#2d3e7e']]); const rg = glow(g, -1.6, .1, 2.6, RD, .12);
  const me = person(g, -1.6, .1, 1.25, BL, { rim: RD }); me.calm.visible = false; me.wince.visible = true;
  return (t) => { D(t); [...back, ...mid].forEach((q, i) => q.g.position.y += Math.sin(t * 1.5 + i) * .002); rg.setOp(.6 + .4 * Math.sin(t * 4)); sc(rg, 1 + .05 * Math.sin(t * 4)); }; });
// 3 — the gap
S([3], [1, 1.12, 0, 0, 0, 0], g => { bg(g, '#3a1020', '#14081a', '#04020a'); const D = dust(g, 40, '#ff8a6a');
  const ch = mesh(g, rr(1, 12, 0), '#010104', 1, 0, 1); const e1 = mesh(g, rr(.08, 12, 0), RD, 1, 0, 1), e2 = mesh(g, rr(.08, 12, 0), RD, 1, 0, 1);
  const gl = glow(g, 0, 1.5, 2.6, RD, .12); const em = []; for (let i = 0; i < 16; i++) { const m = mesh(g, CIRC, '#ff6a4a', .8, 0, 0); m.userData = { a: R(), v: .5 + R() }; sc(m, .04 + R() * .05); em.push(m); } const L = wave(g, 16, 2.8, 2.2, CY, -2.5, 1.6), Rr = wave(g, 16, 2.8, 2.2, OR, 2.5, 1.6);
  return (t, p) => { D(t); const o = ease(clamp(t / 2.6)), gw = .15 + 2.4 * o; ch.scale.x = gw; e1.position.x = -gw / 2; e2.position.x = gw / 2;
    L.position.x = -2.5 - .7 * o; Rr.position.x = 2.5 + .7 * o; L.set(t, 1, 0); Rr.set(t, 1, .85); gl.setOp(.4 + .6 * o); em.forEach(m => { m.position.set((m.userData.a - .5) * gw * .85, ((t * m.userData.v + m.userData.a * 7) % 9) - 3.5, 0); m.visible = gw > .5; }); }; }, [[.4, 'riser']]);
// 4 — the version in your head
S([4], [1, 1.1, 0, 0, 0, 0], g => { bg(g, '#241a5c', '#0c0b2c', '#030313'); const D = dust(g, 40, GD);
  const hd = person(g, 0, .4, 2.6, '#16205a', { rim: BL, face: 'none' }); const gl = glow(g, 0, 1.55, 2.2, GD, .1);
  const gf = person(g, 0, 1.5, .62, GD, { face: 'none' }); const dots = [0, 1, 2].map(i => { const m = mesh(g, CIRC, BL, 1, 3.2 + i * .5, -1.6 - i * .5); sc(m, .25 - i * .06); return m; });
  return (t) => { D(t); gl.setOp(.7 + .3 * Math.sin(t * 3)); sc(gf.g, .62 + .02 * Math.sin(t * 3)); dots.forEach((m, i) => { m.visible = t > .5 + i * .3; }); }; });
// 5 — calm, confident, smooth
S([5], [1.05, 1.15, 0, 0, 0, 0], g => { bg(g, '#43205a', '#190f45', '#05030f'); const D = dust(g, 50, GD);
  const gl = glow(g, 0, 1.7, 3.4, GD, .09); const gf = person(g, 0, 1.6, 1.9, GD, { rim: '#fff3c4', face: 'none' });
  const s1 = sine(g, 60, CY, -2.0, 8), s2 = sine(g, 60, '#7fe3ff', -2.8, 8), s3 = sine(g, 60, '#a8f0ff', -3.6, 8);
  return (t) => { D(t); gl.setOp(.8 + .2 * Math.sin(t * 2)); s1(t, .28, 1.2, 0); s2(t, .22, 1.2, .8); s3(t, .16, 1.2, 1.6); }; });
// 6 — believed for years
S([6], [1, 1.12, 0, 0, 0, 0], g => { bg(g, '#14305a', '#08142c', '#03060d'); const D = dust(g, 50, '#9fc8ff');
  const rip = [0, 1, 2, 3].map(() => mesh(g, arcG(.97, 1, 0, 6.3), CY, .5)); rip.forEach(m => m.position.set(0, 1.6, 0));
  const gl = glow(g, 0, 1.6, 3, GD, .08); const gf = person(g, 0, 1.6, 1.8, GD, { rim: '#fff3c4', face: 'none' });
  const tk = []; for (let i = 0; i < 20; i++) { const m = mesh(g, rr(.08, i % 5 === 0 ? .8 : .45, .04), '#cfe4ff', .8); m.userData.i = i; tk.push(m); }
  return (t, p) => { D(t); rip.forEach((m, k) => { const ph = (t * .5 + k / 4) % 1; sc(m, 1.5 + ph * 5); m.material.opacity = (1 - ph) * .5; });
    tk.forEach(m => { m.position.set(((m.userData.i * .8 - t * 3.2) % 16 + 16) % 16 - 8, -2.6, 0); }); gl.setOp(1 - .5 * p); }; });
// 7 — the recording doesn't match
S([7], [1, 1.1, 0, 0, 0, 0], g => { bg(g, '#0e2a52', '#08122c', '#03050e'); const D = dust(g, 40, CY);
  const a = wave(g, 30, 7, 2.4, CY, 0, 4), b = wave(g, 30, 7, 2.4, OR, 0, -.4); const bt = mesh(g, CIRC, '#1a2a60', 1, 0, 1.8); sc(bt, .75);
  const tri = mesh(g, new THREE.CircleGeometry(1, 3), '#eaf2ff', 1, .08, 1.8); sc(tri, .38); const ln = [];
  for (let i = 0; i < 30; i++) ln.push(mesh(g, rr(.06, 1, .03), RD, 0, -3.5 + (i + .5) * 7 / 30, 1.8));
  return (t) => { D(t); a.set(t, 1, 0); b.set(t, 1, .9, 1.3); const o = clamp((t - 1) / 1.2);
    ln.forEach((m, i) => { m.scale.y = 2.6 + .3 * Math.sin(i + t * 3); m.material.opacity = o * (.25 + .6 * Math.abs(Math.sin(i * 1.7))); }); }; }, [[1, 'boom']]);
// 8 — the mismatch (two cues)
S([8, 9], [1, 1.14, 0, 0, 0, 0], g => { bg(g, '#2a1660', '#0d0a30', '#03020f'); const D = dust(g, 50, '#c9a8ff');
  const gl1 = glow(g, -2.4, 1.9, 2.2, GD, .09); const gl2 = glow(g, 2.4, 1.9, 2.2, CY, .07);
  const A = person(g, -2.4, 1.9, 1.2, GD, { rim: '#fff3c4', face: 'none' }), B = person(g, 2.4, 1.9, 1.2, GR, { rim: CY, face: 'none' });
  const gap = grp(g, 0, 1.9); const b1 = mesh(gap, rr(1.7, .3, .15), RD), b2 = mesh(gap, rr(1.7, .3, .15), RD, 1, 0, -.6); b1.position.y = .3;
  const b3 = mesh(gap, rr(2.2, .3, .15), RD, 1, 0, 0); b3.rotation.z = -.9; const ds = []; for (let i = 0; i < 8; i++) ds.push(mesh(g, CIRC, '#cfd8ff', .7, 0, 1.9));
  return (t) => { D(t); const o = ease(clamp((t - 2.6) / 2));
    A.g.position.x = -2.4 - .7 * o; B.g.position.x = 2.4 + .7 * o; gl1.position.x = A.g.position.x; gl2.position.x = B.g.position.x;
    pop(gap, t, 1.6, .5, 1); gap.position.y = 1.9 + .0; ds.forEach((m, i) => { const u = (i + .5) / 8; m.position.x = A.g.position.x + 1.1 + (B.g.position.x - A.g.position.x - 2.2) * u; sc(m, .07 + .03 * Math.sin(t * 5 - i)); }); }; }, [[1.6, 'boom']]);
// 9 — exposed
S([10], [1, 1.1, 0, 0, 0, -.2], g => { bg(g, '#12121e', '#07070f', '#010103'); const D = dust(g, 40, '#ffffff');
  const sp = new THREE.Shape(); [[-.5, 8], [.5, 8], [2.8, -2.6], [-2.8, -2.6]].forEach((q, i) => i ? sp.lineTo(q[0], q[1]) : sp.moveTo(q[0], q[1]));
  mesh(g, new THREE.ShapeGeometry(sp), '#ffffff', .1, 0, 0); const me = person(g, 0, -.8, 1.2, BL, { rim: '#ffffff' }); me.calm.visible = false; me.wince.visible = true;
  const E = []; for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283 + .3, e = eye(g, Math.cos(a) * 3.2, .8 + Math.sin(a) * 5, .62); E.push([e, a]); }
  return (t) => { D(t); E.forEach(([e, a], i) => { pop(e, t, .4 + i * .13, .3, .62); const dx = -Math.cos(a) * .22, dy = -Math.sin(a) * .08; e.look(dx, dy); }); }; }, [[.4, 'boom']]);
// 10 — can't control it
S([11], [1, 1.1, 0, 0, 0, 0], g => { bg(g, '#3a0e1c', '#14060f', '#04020a'); const D = dust(g, 40, '#ff8a7a');
  const w = wave(g, 26, 6.2, 2.6, OR, 0, 3); const lk = grp(g, 0, 3); const sh = mesh(lk, arcG(.62, .9, 0, Math.PI), '#ffd1d6', 1, 0, .35);
  mesh(lk, rr(2.1, 1.6, .25), RD, 1, 0, -.45); sc(mesh(lk, CIRC, '#2a0510', 1, 0, -.3), .2); mesh(lk, rr(.12, .55, .05), '#2a0510', 1, 0, -.62);
  const kn = []; [-.6, -1.5, -2.4].forEach((y, i) => { mesh(g, rr(6, .16, .08), '#3a2a5a', 1, 0, y); const k = mesh(g, CIRC, '#ffb3bd', 1, -1 + i, y); sc(k, .3); kn.push([k, -1 + i]); });
  return (t) => { D(t); const lo = t > .6; w.set(Math.min(t, .6), lo ? .25 : 1, .2); pop(lk, t, .6, .35, 1.3); if (lo) lk.position.x = Math.sin(t * 40) * .05 * Math.max(0, 1 - (t - .6) * 2);
    kn.forEach(([k, bx], i) => { const j = Math.max(0, Math.sin(t * 6 + i * 2)); k.position.x = bx + j * 1.1 * (1 - Math.abs(Math.sin(t * 3 + i)) * .2) * (Math.sin(t * 12 + i) > 0 ? 1 : .2); }); }; }, [[.6, 'boom']]);
// 11 — hide it, but here's what's strange
S([12], [1, 1.1, 0, 0, 0, 0], g => { bg(g, '#0f2250', '#081028', '#03050e'); const D = dust(g, 40, CY);
  const me = person(g, 0, 1.6, 1.5, BL, { rim: CY }); me.calm.visible = false; me.wince.visible = true;
  const cu = grp(g, 6, 1.4); mesh(cu, rr(4.2, 6.2, .25), '#141c40'); [-1.4, 0, 1.4].forEach(x => mesh(cu, rr(.1, 6, .05), '#1f2b5e', 1, x, 0)); [-2.1, -.7, .7, 2.1].forEach(x => mesh(cu, rr(.7, 6.2, .1), '#0a1030', .3, x, 0)); mesh(cu, rr(4.6, .22, .1), '#c9a24a', 1, 0, 3.1);
  const q = glyph(g, '?', 3, OR, 2.8, 4.8); return (t) => { D(t); const a = ease(clamp(t / 1.1)), b = ease(clamp((t - 2.2) / .9));
    cu.position.x = 6 - 6 * a + 6 * b; pop(q, t, 2.6, .5, 1); q.position.y = 4.8 + .1 * Math.sin(t * 4); me.g.position.x = Math.sin(t * 10) * .03 * (1 - a * .6); }; });
// 12/13 — nobody is listening (bubbles)
const bubbles = worry => g => { bg(g, worry ? '#2c1030' : '#0f2a52', worry ? '#12081e' : '#08122c', '#03050e'); const D = dust(g, 40, worry ? '#ff9ab0' : CY);
  const xs = [-3.2, -1.6, 0, 1.6, 3.2], cols = ['#2b3a7a', '#34468c', BL, '#34468c', '#2b3a7a'], B = [];
  xs.forEach((x, i) => { person(g, x, -.4, .85, cols[i], { face: 'none' }); const q = grp(g, x, 3.3); mesh(q, CIRC, worry ? '#ff7aa0' : CY, .9).scale.set(1.18, 1.18, 1); sc(mesh(q, CIRC, '#10205a', 1), 1.1);
    const w = wave(q, 6, 1.2, 1.2, worry ? OR : CY, 0, 0); B.push([q, w]); mesh(g, CIRC, '#10205a', 1, x, 1.7).scale.set(.12, .12, 1); });
  return (t) => { D(t); B.forEach(([q, w], i) => { pop(q, t, .2 + i * .25, .4, .65); w.set(t, 1, worry ? .7 : 0, i, worry ? 3 : 2); q.position.y = 3.3 + .06 * Math.sin(t * 2 + i); }); }; };
S([13], [1, 1.1, 0, 0, 0, 0], bubbles(false)); S([14], [1, 1.12, 0, 0, 0, 0], bubbles(true));
// 14 — the version was the problem (crack)
S([15], [1, 1.1, 0, 0, 0, 0], g => { bg(g, '#1c1a50', '#0a0a2a', '#030312'); const D = dust(g, 40, GD);
  const gl = glow(g, 0, 2.2, 3, GD, .08); const bb = grp(g, 0, 2.2); mesh(bb, arcG(2.4, 2.55, 0, 6.3), BL, 1); mesh(bb, CIRC, '#10205a', .85).scale.set(2.4, 2.4, 1);
  const gf = person(bb, 0, -.2, .9, GD, { face: 'none' }); const w = wave(g, 30, 7, 2.2, CY, 0, -2.4); const gw = glow(g, 0, -2.4, 3.2, CY, .06);
  const ck = []; for (let i = 0; i < 6; i++) { const m = mesh(bb, rr(.1, 1.3, .05), RD, 1, 0, 0); m.position.set(-.6 + i * .35 * (i % 2 ? 1 : 1), 1.6 - i * .6, 0); m.rotation.z = i % 2 ? .6 : -.6; ck.push(m); }
  const sh = []; for (let i = 0; i < 14; i++) { const m = mesh(g, new THREE.CircleGeometry(.3 + R() * .3, 3), i % 2 ? BL : '#10205a', 1, 0, 2.2); m.userData = { a: R() * 6.28, v: 2 + R() * 4, r: R() * 6 }; sh.push(m); }
  return (t) => { D(t); w.set(t, 1, 0); gw.setOp(.7 + .3 * Math.sin(t * 3)); const c = clamp((t - 2.7) / .5), br = t > 3.2;
    ck.forEach((m, i) => { m.visible = c > i / 7 && !br; }); bb.visible = !br; gl.setOp(br ? 0 : 1);
    sh.forEach(m => { m.visible = br; const u = Math.max(0, t - 3.2); m.position.set(Math.cos(m.userData.a) * m.userData.v * u, 2.2 + Math.sin(m.userData.a) * m.userData.v * u - 2 * u * u, 0); m.rotation.z = m.userData.r * u; m.material.opacity = Math.max(0, 1 - u * .8); });
    sc(bb, 1 + .015 * Math.sin(t * 9) * c); }; }, [[1.5, 'riser'], [3.2, 'crack']]);
// 15 — which one is the real you
S([16], [1, 1.14, 0, 0, 0, 0], g => { bg(g, '#2a1660', '#0d0a30', '#03020f'); const D = dust(g, 50, '#c9a8ff');
  const gl1 = glow(g, -2.3, 1.2, 2.4, GD, .09); const gl2 = glow(g, 2.3, 1.2, 2.4, CY, .07);
  const A = person(g, -2.3, 1.2, 1.25, GD, { rim: '#fff3c4', face: 'none' }), B = person(g, 2.3, 1.2, 1.25, GR, { rim: CY, face: 'none' }); const q = glyph(g, '?', 3.6, '#ffffff', 0, 1.6);
  return (t) => { D(t); const k = .5 + .5 * Math.sin(t * 3.4); fadeG(A.g, .45 + .55 * k); fadeG(B.g, 1 - .55 * k); gl1.setOp(k); gl2.setOp(1 - k); pop(q, t, .2, .4, 1 + .08 * Math.sin(t * 6)); }; });
// 16 — imagined vs the one everyone knows
S([17], [1, 1.1, 0, 0, 0, 0], g => { bg(g, '#1c1040', '#0a0a22', '#02020a'); const D = dust(g, 40, '#bcd0ff');
  const lp = mesh(g, rr(1, 24, 0), '#3a1650', 1, 0, 1), rp = mesh(g, rr(1, 24, 0), '#0a2a4a', 1, 0, 1); const gl = glow(g, -2.2, 1.4, 2.6, GD, .1);
  const A = person(g, -2.2, 1.4, 1.2, GD, { rim: '#fff3c4', face: 'none' }); const cr = crowd(g, [[1.6, 3.2, .5, '#1d3f6a'], [3.1, 3.4, .5, '#1d3f6a'], [2.4, -.9, .6, '#1d3f6a']], 'none');
  const B = person(g, 2.3, 1.4, 1.2, GR, { rim: CY, face: 'none' }); const dv = mesh(g, rr(.1, 12, .05), OR, 1, 0, 1);
  return (t) => { D(t); const x = 1.2 * Math.sin(t * 1.5); dv.position.x = x; lp.scale.x = 4.5 + x; lp.position.x = (x - 4.5) / 2; rp.scale.x = 4.5 - x; rp.position.x = (x + 4.5) / 2; }; });
// 17 — be honest (mirror)
S([18, 19], [1, 1.18, 0, 0, 0, -.2], g => { bg(g, '#12305c', '#081530', '#02050c'); const D = dust(g, 50, CY);
  const gl = glow(g, 0, 1.2, 4, CY, .06); mesh(g, rr(5.6, 8, .6), CY, 1, 0, 1.2); mesh(g, rr(5.3, 7.7, .5), '#0a1a38', 1, 0, 1.2);
  const gh = person(g, 0, .6, 1.5, GD, { face: 'none' }); const me = person(g, 0, .6, 1.5, GR, { rim: CY, face: 'none' }); const sheen = mesh(g, rr(.8, 9, .2), '#ffffff', .07, 0, 1.2); sheen.rotation.z = .4;
  const w = wave(g, 34, 6, 1.6, CY, 0, -3.5);
  return (t) => { D(t); const k = .5 + .5 * Math.sin(t * .9); fadeG(gh.g, k * .8); fadeG(me.g, 1 - k * .7); sheen.position.x = -4 + ((t * .9) % 8); w.set(t, 1, 0); }; });

