
// ---- touch: a floating joystick on the left half of the screen. It appears where the thumb lands;
//      drag sideways to run (further = faster), flick up to jump, pull down to duck or drop ----
const joyZone = $('joyzone'), joyEl = $('joy'), joyKnob = joyEl.firstElementChild;
const joy = { id: null, bx: 0, by: 0, up: false };
const JOY_R = 46, JOY_DEAD = 11, JOY_FLICK = 24;
function joyDraw(kx, ky) {
  joyEl.style.transform = 'translate(' + Math.round(joy.bx) + 'px,' + Math.round(joy.by) + 'px)';
  joyKnob.style.transform = 'translate(' + Math.round(kx) + 'px,' + Math.round(ky) + 'px)';
}
function joyMove(e) {
  const r = $('stage').getBoundingClientRect();
  let dx = e.clientX - r.left - joy.bx, dy = e.clientY - r.top - joy.by;
  const d = Math.hypot(dx, dy);
  if (d > JOY_R) { const k = (d - JOY_R) / d; joy.bx += dx * k; joy.by += dy * k; dx -= dx * k; dy -= dy * k; }   // the base trails a thumb that drags past the rim
  joyDraw(dx, dy);
  const steep = Math.abs(dy) >= Math.abs(dx) * 0.7;
  setInput('p1', 'left', dx < -JOY_DEAD); setInput('p1', 'right', dx > JOY_DEAD);
  held.p1.ax = dx / JOY_R;
  setInput('p1', 'down', dy > JOY_FLICK && steep);
  if (!joy.up && dy < -JOY_FLICK && steep) { joy.up = true; setInput('p1', 'up', true); }                         // one jump per upward flick
  else if (joy.up && dy > -JOY_FLICK * 0.55) { joy.up = false; setInput('p1', 'up', false); }
}
function joyEnd(e) {
  if (e && e.pointerId !== joy.id) return;
  joy.id = null; joy.up = false; joyEl.hidden = true;
  for (const a of ['left', 'right', 'up', 'down']) setInput('p1', a, false);
  held.p1.ax = 0;
}
joyZone.addEventListener('pointerdown', (e) => {
  if (joy.id !== null) return;
  e.preventDefault();
  const r = $('stage').getBoundingClientRect();
  joy.id = e.pointerId; joy.bx = e.clientX - r.left; joy.by = e.clientY - r.top; joy.up = false;
  try { joyZone.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  joyEl.hidden = false; joyDraw(0, 0);
});
joyZone.addEventListener('pointermove', (e) => { if (e.pointerId === joy.id) { e.preventDefault(); joyMove(e); } });
joyZone.addEventListener('pointerup', joyEnd); joyZone.addEventListener('pointercancel', joyEnd); joyZone.addEventListener('lostpointercapture', joyEnd);
joyZone.addEventListener('contextmenu', (e) => e.preventDefault());

// ---- fullscreen, where the browser offers it; the hint explains the home-screen route for iPhones ----
const fsRoot = document.documentElement;
const fsReq = fsRoot.requestFullscreen || fsRoot.webkitRequestFullscreen, fsExit = document.exitFullscreen || document.webkitExitFullscreen;
const fsOn = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
function toggleFs() {
  const fail = () => { $('fs-hint').hidden = false; };
  if (!fsReq) { fail(); return; }
  try {
    if (fsOn()) { fsExit.call(document); return; }
    const lock = () => { try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {}); } catch (err) { /* not lockable */ } };
    const p = fsReq.call(fsRoot, { navigationUI: 'hide' });
    if (p && p.then) p.then(lock).catch(fail); else lock();
  } catch (err) { fail(); }
}
$('btn-fs').addEventListener('click', toggleFs);
$('fsbtn').addEventListener('click', toggleFs);
const fsLabel = () => { const t = fsOn() ? 'VOLLBILD AUS' : 'VOLLBILD'; $('btn-fs').textContent = t; $('fsbtn').textContent = fsOn() ? 'FENSTER' : 'VOLLBILD'; resize(); };
document.addEventListener('fullscreenchange', fsLabel); document.addEventListener('webkitfullscreenchange', fsLabel);
