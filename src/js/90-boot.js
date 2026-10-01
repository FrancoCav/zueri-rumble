
// ---- sizing and the main loop (fixed 60 Hz simulation) ----
function resize() {
  const r = $('stage').getBoundingClientRect(); let s = Math.min(r.width / VW, r.height / VH);
  if (s >= 2) s = Math.floor(s); if (!(s > 0)) s = 1;
  canvas.style.width = Math.floor(VW * s) + 'px'; canvas.style.height = Math.floor(VH * s) + 'px';
}
let acc = 0, last = 0;
function frame(now) {
  requestAnimationFrame(frame);
  const dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now; acc += dt;
  let steps = 0;
  while (acc >= 1 / 60 && steps < 4) {
    acc -= 1 / 60; steps++; app.t++;
    if (app.screen !== 'fight' || !match) continue;
    if (net.role === 'guest') { netGuestStep(); continue; }
    stepMatch();
    if (net.role === 'host') { for (const e of fxq) net.evq.push(e); if (app.t % 2 === 0 || match.phase === 'end') { netSend(netSnapshot()); net.evq = []; } }
  }
  if (steps === 0 && last) return;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (app.screen === 'fight' && match) renderFight(app.t); else renderTitle(app.t);
}
window.addEventListener('resize', resize);
if (document.fonts && document.fonts.load) document.fonts.load('8px "Press Start 2P"').catch(() => {});
resize(); renderSelect(); show('title'); requestAnimationFrame(frame);
