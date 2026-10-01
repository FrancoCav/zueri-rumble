
// ---- monsters: same joints, different bodies ----
function drawMonster(f, P, t) {
  const L = f.def.look, [hx, hy] = P.head, [sx, sy] = P.sh, [ix, iy] = P.hip, cx = Math.round((sx + ix) / 2);
  const wave = (k) => Math.round(Math.sin(t * 0.15 + k) * 2);
  const c = L.c1, d = L.c2;
  switch (L.body) {
    case 'kraken': {
      for (let k = 0; k < 2; k++) limb(-4 - k * 6, 8, -16 - k * 8 + wave(k), 2 + wave(k + 2), 3, d);
      const tent = (A, x0, y0, col) => { limb(x0, y0, A[0][0] + wave(1), A[0][1], 4, col); limb(A[0][0] + wave(1), A[0][1], A[1][0] + wave(2), A[1][1] + wave(3), 3, col); px(A[1][0] + wave(2) - 1, A[1][1] + wave(3), 2, 2, L.eye); };
      tent(P.ba, sx - 3, sy - 2, d); tent(P.bl, ix - 3, iy - 6, d);
      limb(ix, iy - 8, sx, sy, 15, c); circ(cx, iy + 2, 8, c);
      circ(hx, hy + 1, 8, c); px(hx - 8, hy - 3, 16, 4, c);
      px(hx + 2, hy + 1, 3, 2, L.eye); px(hx + 3, hy + 1, 1, 1, '#111'); px(hx - 4, hy + 2, 2, 2, L.eye);
      tent(P.fa, sx + 3, sy - 2, c); tent(P.fl, ix + 3, iy - 6, c);
      break;
    }
    case 'boogg': {
      circ(cx, 11, 11, c); px(cx - 11, 0, 22, 3, d);
      circ(cx, iy + 6, 8, c); px(cx, iy + 3, 2, 2, '#222'); px(cx, iy + 8, 2, 2, '#222');
      limb(sx - 2, sy - 1, P.ba[0][0], P.ba[0][1], 2, '#6b4a2b'); limb(P.ba[0][0], P.ba[0][1], P.ba[1][0], P.ba[1][1], 2, '#6b4a2b');
      circ(hx, hy, 7, c); px(hx + 2, hy + 1, 2, 2, '#222'); px(hx - 3, hy + 1, 2, 2, '#222'); px(hx + 4, hy - 1, 5, 2, '#ff8c00');
      [-2, 0, 2].forEach((dx) => px(hx + dx, hy - 3, 1, 1, '#222'));
      px(hx + 3, hy - 3, 4, 1, '#5a3a1a'); px(hx + 7, hy - 3, 2, 2, '#5a3a1a'); px(hx + 7, hy + (t / 3) % 5, 1, 1, 'rgba(220,220,220,.7)');
      px(hx - 8, hy + 6, 16, 2, '#111'); px(hx - 5, hy + 8, 10, 6, '#111'); px(hx - 5, hy + 8, 10, 1, '#c62828');
      limb(sx + 2, sy - 1, P.fa[0][0], P.fa[0][1], 2, '#6b4a2b'); limb(P.fa[0][0], P.fa[0][1], P.fa[1][0], P.fa[1][1], 2, '#6b4a2b');
      limb(P.fa[1][0], P.fa[1][1] - 8, P.fa[1][0] + 2, P.fa[1][1] + 14, 2, '#8a6a3a'); px(P.fa[1][0] - 2, P.fa[1][1] + 14, 7, 5, '#c9a227');
      if (f.state === 'attack' && f.move && f.move.type === 'explode') { const len = 5 - Math.floor(f.t / 20); px(hx - 1, hy + 14, 2, len, '#eee'); px(hx - 1, hy + 14 + len, 2, 2, t % 4 < 2 ? '#ff3d00' : '#ffd54a'); }
      break;
    }
    case 'yeti': {
      const arm = (A, x0, y0) => { limb(x0, y0, A[0][0], A[0][1], 6, c); limb(A[0][0], A[0][1], A[1][0], A[1][1], 6, c); px(A[1][0] - 3, A[1][1] - 3, 6, 6, d); };
      const leg = (J, x0, y0) => { limb(x0, y0, J[0][0], J[0][1], 6, c); limb(J[0][0], J[0][1], J[1][0], J[1][1], 6, c); px(J[1][0] - 4, J[1][1] - 1, 10, 3, d); };
      arm(P.ba, sx - 3, sy); leg(P.bl, ix - 3, iy);
      limb(ix, iy + 2, sx, sy + 2, 17, c); px(cx - 3, iy + 4, 6, 10, d);
      leg(P.fl, ix + 3, iy);
      px(hx - 7, hy - 6, 14, 14, c); px(hx - 4, hy - 4, 10, 8, '#7a8bb5');
      px(hx + 2, hy + 1, 2, 2, '#111'); px(hx - 2, hy + 1, 2, 2, '#111'); px(hx - 2, hy - 3, 7, 2, '#eee');
      px(hx - 7, hy + 8, 14, 3, c); px(hx - 5, hy + 11, 3, 2, c); px(hx + 3, hy + 11, 3, 2, c);
      arm(P.fa, sx + 3, sy);
      break;
    }
    case 'gargoyle': {
      const flap = !f.ground ? Math.round(Math.sin(t * 0.5) * 6) : 0;
      for (let k = 0; k < 2; k++) { const s = k ? 1 : -1; px(sx + (s > 0 ? 2 : -14), sy - 4, 12, 10 + flap, 'rgba(93,98,110,.8)'); limb(sx, sy - 2, sx + s * 16, sy + 10 + flap, 2, d); limb(sx + s * 16, sy + 10 + flap, sx + s * 10, sy - 6, 2, d); }
      limb(ix - 4, iy - 2, ix - 16 + wave(0), iy - 8 + wave(1), 2, d); px(ix - 18 + wave(0), iy - 10 + wave(1), 3, 3, d);
      limb(sx - 2, sy - 1, P.ba[0][0], P.ba[0][1], 3, c); limb(P.ba[0][0], P.ba[0][1], P.ba[1][0], P.ba[1][1], 3, c); px(P.ba[1][0] - 1, P.ba[1][1] - 2, 3, 4, d);
      limb(ix - 2, iy, P.bl[0][0], P.bl[0][1], 4, c); limb(P.bl[0][0], P.bl[0][1], P.bl[1][0], P.bl[1][1], 4, c); px(P.bl[1][0] - 3, P.bl[1][1] - 1, 8, 3, d);
      limb(ix, iy + 2, sx, sy - 1, 11, c); px(cx - 3, iy + 4, 6, 8, d);
      limb(ix + 2, iy, P.fl[0][0], P.fl[0][1], 4, c); limb(P.fl[0][0], P.fl[0][1], P.fl[1][0], P.fl[1][1], 4, c); px(P.fl[1][0] - 3, P.fl[1][1] - 1, 8, 3, d);
      px(hx - 5, hy - 5, 10, 11, c); px(hx - 6, hy + 5, 3, 4, d); px(hx + 3, hy + 5, 3, 4, d);
      px(hx - 7, hy, 2, 3, c); px(hx + 2, hy + 1, 3, 2, L.eye); px(hx + 1, hy - 2, 4, 1, '#eee');
      limb(sx + 2, sy - 1, P.fa[0][0], P.fa[0][1], 3, c); limb(P.fa[0][0], P.fa[0][1], P.fa[1][0], P.fa[1][1], 3, c); px(P.fa[1][0] - 1, P.fa[1][1] - 2, 3, 4, d);
      break;
    }
    case 'pigeon': {
      const flap = !f.ground ? Math.round(Math.sin(t * 0.6) * 8) : wave(0);
      const leg = (J, x0) => { limb(x0, iy - 6, J[1][0], J[1][1] + 1, 2, '#ff7a1a'); px(J[1][0] - 3, J[1][1], 8, 1, '#ff7a1a'); };
      leg(P.bl, ix - 3);
      limb(sx - 4, sy - 4, P.ba[1][0] - 6, P.ba[1][1] + flap, 5, d);
      circ(cx, iy + 4, 11, c); circ(cx + 2, iy + 8, 9, c); px(cx - 9, iy - 4, 18, 6, c);
      limb(cx - 10, iy - 2, cx - 18, iy - 10 + wave(2), 4, d);
      leg(P.fl, ix + 3);
      px(hx - 2, hy - 7, 6, 4, '#3aa06a'); px(hx - 2, hy - 5, 6, 2, '#7a4bd1');
      circ(hx + 1, hy, 5, c); px(hx + 3, hy + 1, 2, 2, '#ff7a1a'); px(hx + 4, hy + 1, 1, 1, '#111'); px(hx + 6, hy - 1, 4, 2, '#ffb000');
      limb(sx + 4, sy - 4, P.fa[1][0] + 2, P.fa[1][1] + flap, 5, d); px(P.fa[1][0] + 2, P.fa[1][1] + flap - 2, 6, 3, d);
      break;
    }
  }
  if (f.buff.rage) for (let k = 0; k < 8; k++) px(-12 + ((t * 5 + k * 13) % 24), 4 + ((t * 7 + k * 11) % 44), 2, 2, k % 2 ? '#ff3d00' : '#ffb300');
}
