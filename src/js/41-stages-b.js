  { name: 'Langstrasse', sub: 'Markisen, Balkon und Leuchtreklame ganz oben', col: ['#c2416b', '#15151f', '#0c0c14'],
    plats: [{ x: 40, y: 0, w: 560, solid: true }, { x: 60, y: 58, w: 110 }, { x: 250, y: 88, w: 140 }, { x: 470, y: 58, w: 110 }, { x: 285, y: 158, w: 70 }],
    bg(t) {
      bands('#05060f', '#1a1030', 6, 300); R(0, 300, VW, 60, '#07060c');
      const cols = ['#3b2a3f', '#2a2f45', '#3f2a2a', '#2a3f35', '#40332a'];
      for (let i = 0; i < 6; i++) { const x = i * 110 - 10, h = 190 + (i * 29) % 50; R(x, 300 - h, 104, h, cols[i % 5]); windows(x, 300 - h, 104, h - 60, 6, Math.floor((h - 60) / 16), '#ffe9a8', '#1a1420', i * 3); R(x, 300 - h, 104, 4, '#111'); R(x + 40, 262, 24, 38, '#181018'); }
      const signs = [[74, 262, 'BAR', '#ff3fa4'], [280, 232, 'KEBAB', '#39ff6a'], [492, 262, 'CLUB', '#00e5ff'], [304, 162, 'KINO', '#ffe14d']];
      for (const s of signs) { const on = (Math.floor(t / 7) + s[0]) % 23 !== 0; R(s[0] - 4, s[1] - 11, s[2].length * 8 + 8, 14, '#100a14'); txt(s[2], s[0], s[1], 8, on ? s[3] : '#3a2a3a'); }
      for (let i = 0; i < 4; i++) { const x = 30 + i * 190; R(x, 200, 3, 100, '#444'); R(x - 4, 196, 11, 4, '#666'); R(x - 2, 200, 7, 2, '#ffd27a'); ctx.fillStyle = 'rgba(255,210,122,.07)'; ctx.fillRect(x - 24, 202, 51, 98); }
    } },
  { name: 'Bürkliplatz', sub: 'Zwei Stege, dazwischen der See und ein Dampfschiff', col: ['#e6d7b0', '#a8946a', '#8a784f'],
    plats: [{ x: 50, y: 0, w: 230, solid: true }, { x: 360, y: 0, w: 230, solid: true }, { x: 278, y: 60, w: 84, mv: { ax: 96, period: 480 }, hide: true }, { x: 275, y: 140, w: 90 }],
    bg(t) {
      bands('#4fa3ff', '#d6ecff', 8, 210);
      for (let i = 0; i < 11; i++) { const x = i * 64 - 20, h = 46 + (i * 23) % 34; for (let k = 0; k < h; k += 2) R(x + k * 0.9, 210 - h + k, 64 - k * 1.8, 2, k < h * 0.45 ? '#ffffff' : '#8fa3bf'); }
      R(0, 210, VW, 150, '#2f7fc1'); for (let i = 0; i < 50; i++) R(((i * 53 + t * 0.3) % (VW + 30)) - 15, 216 + (i * 11) % 140, 6, 1, '#8fc9f2');
      const s = ((t * 0.15 + 300) % 760) - 60; R(s, 226, 16, 3, '#eee'); R(s + 7, 210, 2, 16, '#eee'); R(s + 9, 210, 7, 13, '#fff');
      const b = this.plats[2], bx = Math.round(b.cx), by = GY - b.cy;     // the steamer: its roof is the moving platform
      R(bx - 14, by + 14, b.w + 28, 14, '#f4f4f4'); R(bx - 8, by + 28, b.w + 16, 8, '#c62828'); R(bx, by, b.w, 6, '#d9d9d9'); R(bx + 4, by + 6, b.w - 8, 8, '#f4f4f4');
      for (let k = 0; k < 6; k++) R(bx + 8 + k * 12, by + 8, 5, 4, '#3a5a7a');
      R(bx + 4, by - 14, 8, 14, '#222'); R(bx + 4, by - 14, 8, 3, '#c62828'); R(bx + 6 - (t % 40) * 0.4, by - 20 - (t % 40) * 0.3, 4, 3, 'rgba(255,255,255,.6)');
    } },
  { name: 'Hauptbahnhof', sub: 'Vordächer, Bahnhofsuhr und ein Tram, das durchfährt', col: ['#cfc7b8', '#8f887b', '#6f695d'],
    plats: [{ x: 50, y: 0, w: 540, solid: true }, { x: 80, y: 74, w: 120 }, { x: 440, y: 74, w: 120 }, { x: 265, y: 136, w: 110 }, { x: -160, y: 46, w: 120, mv: { lin: 1.1, from: -160, to: 800 }, hide: true }],
    bg(t) {
      bands('#6fb3e8', '#f0e6d2', 8, 300);
      R(0, 300, VW, 60, '#3a6f96'); for (let i = 0; i < 20; i++) R(((i * 67 + t * 0.4) % (VW + 30)) - 15, 306 + (i * 17) % 50, 7, 1, '#7fb0d0');   // the Sihl runs under the station
      R(30, 110, 580, 190, '#d9c9a3'); R(30, 104, 580, 7, '#8a7a5a'); R(240, 70, 160, 40, '#d9c9a3'); R(240, 64, 160, 7, '#8a7a5a');
      R(280, 180, 80, 120, '#4a3f33'); R(288, 170, 64, 10, '#4a3f33');
      for (let k = 0; k < 10; k++) { const x = 46 + k * 58; if (k === 4 || k === 5) continue; R(x, 130, 10, 170, '#c4b48e'); R(x - 3, 124, 16, 6, '#8a7a5a'); R(x + 18, 150, 16, 40, '#3a4a5a'); R(x + 18, 236, 16, 40, '#3a4a5a'); }
      circ(320, 90, 12, '#f4f4f4'); R(319, 81, 2, 9, '#222'); R(320, 89, 7, 2, '#222');
      txt('HAUPTBAHNHOF', 320, 124, 8, '#4a3f33', 'center');
      const tr = this.plats[4], x = Math.round(tr.cx), y = GY - tr.cy;       // the tram: its roof is a moving platform
      R(x - 6, y, tr.w + 12, 6, '#143f8c'); R(x - 6, y + 6, tr.w + 12, 40, '#1e5bc6'); R(x - 6, y + 12, tr.w + 12, 14, '#dfe8ff');
      for (let k = 0; k < 8; k++) R(x + k * 16, y + 13, 11, 12, '#9ec2ff');
      R(x + 30, y + 26, 8, 20, '#0d3a8a'); R(x + 80, y + 26, 8, 20, '#0d3a8a');
    } },
];
