"""Erzeugt die App-Icons (Pixel-Logo "ZR") ohne Zusatzbibliotheken. Aufruf: python tools/mkicons.py"""
import os, struct, zlib
Z = ["######", "######", "....##", "...##.", "..##..", ".##...", "##....", "######", "######"]
R = ["#####.", "######", "##..##", "##..##", "#####.", "####..", "##.##.", "##..##", "##..##"]
BG, EDGE, RED, GOLD = (20, 20, 42), (58, 58, 98), (179, 38, 30), (255, 225, 77)
grid = [[BG] * 16 for _ in range(16)]
for i in range(16):
    grid[0][i] = grid[15][i] = grid[i][0] = grid[i][15] = EDGE
def stamp(glyph, x0, y0, col):
    for y, row in enumerate(glyph):
        for x, ch in enumerate(row):
            if ch == '#' and 0 < x0 + x < 15 and 0 < y0 + y < 15: grid[y0 + y][x0 + x] = col
for glyph, x in ((Z, 2), (R, 9)):
    stamp(glyph, x, 4, RED)      # drop shadow
for glyph, x in ((Z, 1), (R, 8)):
    stamp(glyph, x, 3, GOLD)
def png(path, size):
    scale = size // 16; pad = (size - scale * 16) // 2
    rows = []
    for y in range(size):
        gy = min(15, max(0, (y - pad) // scale)); row = bytearray([0])
        for x in range(size):
            gx = min(15, max(0, (x - pad) // scale)); row += bytes(grid[gy][gx])
        rows.append(bytes(row))
    chunk = lambda t, d: struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    data = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 2, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(b''.join(rows), 9)) + chunk(b'IEND', b'')
    open(path, 'wb').write(data)
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for s in (180, 192, 512): png(os.path.join(root, 'icon-%d.png' % s), s)
print('icons written')
