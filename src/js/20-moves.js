
// ---- move templates. s startup, a active, r recovery (frames); d damage in %; hb hitbox [x, y, w, h] from the feet, facing right;
//      bk base knockback, kg knockback growth per 100 %, ang launch angle in degrees (0 forward, 90 up, 270 down) ----
const MV = {
  jab:   { s: 5, a: 4, r: 10, d: 4,  hb: [4, 24, 32, 14], bk: 1.4, kg: 1.2, ang: 30, pose: 'jab' },
  hook:  { s: 9, a: 5, r: 16, d: 10, hb: [0, 24, 32, 34], bk: 3.4, kg: 6.0, ang: 78, pose: 'hook' },
  kick:  { s: 7, a: 5, r: 14, d: 8,  hb: [6, 10, 38, 20], bk: 2.8, kg: 4.6, ang: 35, pose: 'kick' },
  sweep: { s: 9, a: 5, r: 18, d: 7,  hb: [2, 0, 42, 12],  bk: 2.6, kg: 3.4, ang: 75, pose: 'sweep', low: true },
  head:  { s: 8, a: 5, r: 16, d: 10, hb: [0, 26, 28, 24], bk: 3.2, kg: 5.2, ang: 40, pose: 'head' },
  dash:  { s: 9, a: 14, r: 16, d: 11, hb: [0, 6, 30, 40], bk: 3.4, kg: 5.4, ang: 40, pose: 'dash', vx: 3.4 },
  poke:  { s: 7, a: 6, r: 16, d: 7,  hb: [6, 24, 48, 12], bk: 2.4, kg: 3.6, ang: 25, pose: 'poke' },
  dive:  { s: 5, a: 90, r: 8, d: 10, hb: [0, -4, 28, 30], bk: 3.0, kg: 4.8, ang: 55, pose: 'dive', jump: [2.6, 5.2] },
  throw: { s: 7, a: 4, r: 22, d: 9,  hb: [2, 4, 24, 40],  bk: 4.4, kg: 4.8, ang: 55, pose: 'grab', grab: true },
  shot:  { s: 10, a: 2, r: 18, d: 6, hb: null, bk: 1.8, kg: 2.0, ang: 30, pose: 'cast', proj: 'orb' },
};
const INPUTS = ['Schlag', 'Runter + Schlag', 'Tritt', 'Runter + Tritt'];
