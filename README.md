# Züri Rumble

Plattform-Prügelspiel im Smash-Stil mit Pixelgrafik: 16 Kämpfer, Waffen aus Kisten, Powerups und fünf Zürcher Kulissen mit Plattformen auf verschiedenen Höhen.
Läuft im Browser am PC (Tastatur) und auf dem Handy (Touch-Pad, am besten quer halten).

Spielen: https://francocav.github.io/zueri-rumble/

## Regeln
- Jeder Treffer erhöht die Prozente des Getroffenen. Je höher die Prozente, desto weiter fliegt er.
- Wer aus dem Bild fliegt oder in den Abgrund fällt, verliert eines von drei Leben. Nach drei Minuten gewinnt, wer mehr Leben hat.
- Der Special kostet nur einen Teil der Special-Leiste (30 bis 50 %). Die Leiste füllt sich durch Treffer und mit der Zeit.
- Kisten fallen vom Himmel. Ein Treffer öffnet sie: Katana, Baseballschläger, Shuriken, Laser, Shotgun, Granate oder Bazooka.
  Die Waffe ersetzt den normalen Schlag, bis die Munition leer ist. Ein harter Treffer schlägt sie aus der Hand.
- Powerups schweben am Fallschirm herab: Herz (heilt 40 %), Angriff +, Abwehr +, Turbo, Special voll.
- Schild blockt Schläge, wird dabei kleiner und bricht irgendwann. Würfe und einige Specials gehen durch.

## Steuerung
- Spieler 1: A/D laufen, W springen (in der Luft nochmal = Doppelsprung), S ducken (länger halten = durch Plattform fallen, in der Luft schneller fallen),
  F Schlag oder Waffe, G Tritt, H Special, R Schild. Im Arcade- und Online-Modus gehen auch Pfeile + J/K/L/I.
- Spieler 2 (Tastatur-Duell): Pfeile, K Schlag, L Tritt, Ö Special, O Schild.
- Techniken: Schlag, Runter + Schlag, Tritt, Runter + Tritt. Alle gehen auch in der Luft.
- Wer weggeschleudert wurde, hat einen zusätzlichen Rettungssprung.

## Handy
- Links irgendwo aufsetzen: dort erscheint der Joystick. Seitlich ziehen läuft (weiter ziehen = schneller), hoch ziehen springt,
  nochmal hoch ziehen gibt den Doppelsprung, runter ziehen duckt oder lässt durch Plattformen fallen.
- Rechts unten sitzen vier Knöpfe: Schlag, Tritt, Schild, Special.
- Hochkant gehalten dreht sich das Spiel selbst um 90 Grad und füllt die lange Seite. Handy einfach quer halten
  (Oberkante nach links), die Ausrichtungssperre darf an bleiben.
- Vollbild auf Android und am PC: Knopf «VOLLBILD» im Menü oder oben rechts im Kampf.
- iPhone: Safari kann kein Vollbild per Knopf. Ohne Browser-Leisten läuft das Spiel als Web-App vom Home-Bildschirm:
  in Safari öffnen, Teilen-Symbol, «Zum Home-Bildschirm», «Als Web-App öffnen» eingeschaltet lassen, dann über das Icon starten.
  Ein älteres Icon vorher löschen. Uhrzeit und Akku-Anzeige blendet iOS im Hochformat immer ein.

## Modi
- Arcade: fünf CPU-Gegner in Folge, jeder schlauer als der vorige.
- Duell: zwei Spieler an einer Tastatur.
- Online: zwei Handys oder PCs. Einer eröffnet ein Match und bekommt einen Code, der andere tippt ihn ein.
  Verbindung direkt per WebRTC (PeerJS). Der Host rechnet, der Gast schickt nur seine Tasten.

## Kulissen
Grossmünster (Limmatquai), Hardbrücke, Langstrasse bei Nacht, Bürkliplatz mit fahrendem Dampfschiff, Hauptbahnhof mit durchfahrendem Tram.

## Entwicklung
Der Quelltext liegt in `src/` (Stylesheet, Markup und nummerierte JS-Teile). `python build.py` setzt daraus die eine Datei `index.html` zusammen,
die GitHub Pages ausliefert. `python build.py --debug --out=_preview.html` baut eine lokale Testversion mit Test-Haken.
Der klassische 1-gegen-1-Fighter von vorher ist als Git-Tag `v1-klassisch` gesichert.
