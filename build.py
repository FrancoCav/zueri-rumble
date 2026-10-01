"""Baut index.html aus src/. Aufruf: python build.py [--debug] [--out=DATEI] [--artifact=DATEI]

--debug     haengt einen Test-Haken (window.__zr) an, nur fuer lokale Vorschau
--out       Zieldatei (Standard: index.html, vollstaendiges HTML-Dokument fuer GitHub Pages)
--artifact  schreibt zusaetzlich die Variante ohne Doctype/Head fuer claude.ai-Artifacts
"""
import glob, io, os, sys

root = os.path.dirname(os.path.abspath(__file__))
rd = lambda p: io.open(os.path.join(root, p), encoding='utf-8').read()
css, body = rd('src/01-style.css'), rd('src/02-body.html')
js = '\n'.join(io.open(p, encoding='utf-8').read() for p in sorted(glob.glob(os.path.join(root, 'src', 'js', '*.js'))))
debug = '--debug' in sys.argv
if debug:
    js += ("\nwindow.__zr = { get match() { return match; }, stepMatch, app, show, newMatch, startFight, FIGHTERS, STAGES, WEAPONS, POWERUPS, SP, MV, "
           "held, pressed, renderFight, net, netHost, netJoin, netSnapshot, netGuestStep, sel, renderSelect, items, projs, fx, takePower, breakCrate, Fighter, applyHit, stepFighter, cpuInput, BLAST, playFx, get fxq() { return fxq; } };")
TITLE = '<title>Züri Rumble</title>\n'
LINKS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap">\n'
         '<script src="https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.5/peerjs.min.js"></script>\n')
content = LINKS + '<style>\n' + css + '</style>\n' + body + "\n<script>\n(() => {\n'use strict';\n" + js + '\n})();\n</script>\n'
full = ('<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
        '<meta name="description" content="Züri Rumble: Plattform-Prügelspiel mit 16 Kämpfern, Waffen und Powerups in fünf Zürcher Kulissen, für PC und Handy, mit Online-Duell.">\n'
        + TITLE +
        '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}</style>\n'
        '</head>\n<body>\n' + content + '</body>\n</html>\n')
out = 'index.html'
for a in sys.argv[1:]:
    if a.startswith('--out='): out = a[6:]
io.open(out if os.path.isabs(out) else os.path.join(root, out), 'w', encoding='utf-8', newline='\n').write(full)
for a in sys.argv[1:]:
    if a.startswith('--artifact='): io.open(a[11:], 'w', encoding='utf-8', newline='\n').write(TITLE + content)
print('built', out, len(full), 'bytes', '(debug)' if debug else '')
