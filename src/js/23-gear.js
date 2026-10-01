
// ---- weapons come out of crates and replace the plain punch until the ammo is gone ----
const WEAPONS = {
  katana:   { name: 'Katana', ammo: 10, s: 6, a: 5, r: 12, d: 13, hb: [2, 6, 52, 40], bk: 3.2, kg: 5.6, ang: 38, pose: 'hook' },
  bat:      { name: 'Baseballschläger', ammo: 5, s: 14, a: 4, r: 20, d: 17, hb: [2, 12, 44, 30], bk: 3.8, kg: 6.4, ang: 33, pose: 'hook' },
  shuriken: { name: 'Shuriken', ammo: 8, s: 5, a: 2, r: 10, d: 6, hb: null, proj: 'shuriken', bk: 1.8, kg: 2.0, ang: 25, pose: 'jab' },
  laser:    { name: 'Laser', ammo: 6, s: 8, a: 6, r: 12, d: 8, hb: [12, 28, 640, 6], bk: 2.0, kg: 2.6, ang: 12, pose: 'poke', ray: true },
  shotgun:  { name: 'Shotgun', ammo: 4, s: 8, a: 3, r: 24, d: 15, hb: [10, 14, 76, 28], bk: 4.0, kg: 6.2, ang: 28, pose: 'poke', recoil: 2.6 },
  grenade:  { name: 'Granate', ammo: 3, s: 8, a: 2, r: 14, d: 18, hb: null, proj: 'grenade', bk: 4.0, kg: 6.6, ang: 60, pose: 'hook' },
  bazooka:  { name: 'Bazooka', ammo: 2, s: 16, a: 2, r: 26, d: 24, hb: null, proj: 'rocket', bk: 4.6, kg: 7.6, ang: 45, pose: 'poke', recoil: 3 },
};
// ---- powerups float down on their own ----
const POWERUPS = {
  heart: { name: 'Herz: 40 % geheilt', col: '#ff4d6d' },
  power: { name: 'Angriff +', buff: 'atk', dur: 600, col: '#ff9f1c' },
  guard: { name: 'Abwehr +', buff: 'def', dur: 600, col: '#3fb8ff' },
  turbo: { name: 'Turbo', buff: 'speed', dur: 600, col: '#46e08a' },
  bolt:  { name: 'Special voll', col: '#ffe14d' },
};
