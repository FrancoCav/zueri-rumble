
// ---- online play: the host runs the fight, the guest sends inputs and renders the host's snapshots (PeerJS over WebRTC) ----
const PUBLIC_URL = 'https://francocav.github.io/zueri-rumble/';
const net = { role: null, peer: null, conn: null, code: '', remoteHeld: {}, remotePressed: {}, myPick: -1, theirPick: -1, hostStage: -1, lastState: null, evq: [], evIn: [] };
const BITS = { left: 1, right: 2, up: 4, down: 8, punch: 16, kick: 32, special: 64, block: 128 };
const toBits = (o) => { let b = 0; for (const k in BITS) if (o[k]) b |= BITS[k]; return b; };
const fromBits = (b) => { const o = {}; for (const k in BITS) if (b & BITS[k]) o[k] = true; return o; };
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const makeCode = () => Array.from({ length: 4 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');
function netStatus(s) { $('online-status').textContent = s; }
function netReset() {
  try { if (net.conn) net.conn.close(); } catch (e) { /* already closed */ }
  try { if (net.peer) net.peer.destroy(); } catch (e) { /* already gone */ }
  net.role = null; net.peer = null; net.conn = null; net.remoteHeld = {}; net.remotePressed = {}; net.myPick = -1; net.theirPick = -1; net.hostStage = -1; net.lastState = null; net.evq = []; net.evIn = [];
  $('online-code').hidden = true; $('online-actions').hidden = false;
}
function netLeave() { netSend({ t: 'bye' }); netReset(); if (app.mode === 'online') app.mode = 'arcade'; }
function netSend(m) { try { if (net.conn && net.conn.open) net.conn.send(m); } catch (e) { /* dropped */ } }
function netUnavailable() { netStatus('Hier geht der Online-Modus nicht. Öffne das Spiel unter ' + PUBLIC_URL); }
function netHost() {
  netReset(); if (typeof Peer === 'undefined') { netUnavailable(); return; }
  net.role = 'host'; net.code = makeCode(); netStatus('Verbinde mit dem Vermittlungsserver…'); $('online-actions').hidden = true;
  const peer = new Peer('zr-' + net.code.toLowerCase(), { debug: 0 }); net.peer = peer;
  peer.on('open', () => { $('online-code').hidden = false; $('code-text').textContent = net.code; netStatus('Schick den Code dem Gegner. Warte auf Verbindung…'); });
  peer.on('connection', (c) => { if (net.conn) { c.close(); return; } netAttach(c); });
  peer.on('error', netError);
}
function netJoin(code) {
  netReset(); if (typeof Peer === 'undefined') { netUnavailable(); return; }
  net.role = 'guest'; net.code = code; netStatus('Verbinde…'); $('online-actions').hidden = true;
  const peer = new Peer({ debug: 0 }); net.peer = peer;
  peer.on('open', () => netAttach(peer.connect('zr-' + code.toLowerCase(), { reliable: true, serialization: 'json' })));
  peer.on('error', netError);
}
function netError(e) {
  const type = e && e.type;
  if (type === 'peer-unavailable') { netReset(); netStatus('Kein Match mit diesem Code gefunden.'); }
  else if (type === 'unavailable-id') { netStatus('Code schon vergeben, neuer Versuch…'); setTimeout(netHost, 300); }
  else { netReset(); netStatus('Keine Verbindung möglich (' + (type || 'Fehler') + '). Online geht nur unter ' + PUBLIC_URL); }
}
