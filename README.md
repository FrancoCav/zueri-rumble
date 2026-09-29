# Züri Rumble

2D-Pixel-Prügelspiel im Stil der 90er-Arcade-Fighter, komplett in einer Datei (`index.html`), ohne Build und ohne eigenen Server.
Läuft am PC (Tastatur) und auf dem Handy (Touch-Pad auf dem Bildschirm).

Spielen: https://francocav.github.io/zueri-rumble/

## Inhalt
- 16 Kämpfer: 7 Männer, 4 Frauen, 5 Monster. Jeder hat vier Techniken und einen hervorgehobenen Special.
- 5 Kulissen aus Zürich: Grossmünster, Hardbrücke mit Prime Tower, Langstrasse bei Nacht, Bürkliplatz mit Zürisee, Hauptbahnhof.
- Modi: Arcade (5 CPU-Gegner in Folge, wird pro Sieg schwerer), Duell (2 Spieler an einer Tastatur), Online (2 Handys oder PCs über das Internet).
- Best of 3 Runden, 60 Sekunden pro Runde, Special-Leiste füllt sich durch Treffer.

## Online-Duell mit zwei Handys
1. Beide öffnen den Link oben.
2. Ein Handy tippt «Online», dann «Match eröffnen» und zeigt einen Code mit vier Zeichen.
3. Das andere Handy tippt den Code ein und drückt «Beitreten».
4. Beide wählen einen Kämpfer, der Host wählt die Kulisse, dann startet der Kampf.

Technik: Die Browser verbinden sich direkt per WebRTC (PeerJS, Vermittlung über den kostenlosen PeerJS-Cloud-Server).
Der Host rechnet den Kampf und schickt 30-mal pro Sekunde den Spielstand, der Gast schickt nur seine Tasten.
Der Gast spürt deshalb die Netzverzögerung als kleine Eingabelatenz. Im claude.ai-Fenster ist WebRTC gesperrt,
dort laufen nur Arcade und Tastatur-Duell.

## Steuerung
- Spieler 1: A/D laufen, W springen, S ducken, F Schlag, G Tritt, H Special. Im Arcade- und Online-Modus gehen auch Pfeile + J/K/L.
- Spieler 2 (Tastatur-Duell): Pfeile, K Schlag, L Tritt, Ö Special.
- Block: nach hinten halten. Tiefe Angriffe (Fegen) nur geduckt blocken. Würfe und einige Specials sind nicht blockbar.
- Techniken: Schlag, Tief + Schlag, Tritt, Tief + Tritt, in der Luft Schlag oder Tritt = Sprungtritt.

## Grafik
Alle Figuren und Kulissen werden zur Laufzeit als Pixel-Grafik gezeichnet (Canvas 384 x 216, hochskaliert ohne Glättung).
Es gibt keine Bilddateien. Figuren sind Papierpuppen aus Kopf, Rumpf und Gliedmassen mit Frisuren, Kleidung und Props.

## Hosting
GitHub Pages aus diesem Repository (Branch `main`, Ordner `/`). Änderungen: `index.html` anpassen, committen, pushen.
