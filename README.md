# TSW5 Random Weather Scenario Generator

Eine Web-App zur Generierung zufälliger Szenarien für Train Sim World 5.

## 🌟 Features

- **Wetter-Generierung**: Realistische saisonale Wetterwahrscheinlichkeiten basierend auf dem ausgewählten Monat
- **Routen-Auswahl**: Voreingestellte Listen für TSW5 DLCs (Deutschland, UK, USA)
- **Szenario-Generator**: Kombiniert Wetter, Route, Uhrzeit und Zugtyp zufällig
- **Teilen-Funktion**: Kopiere das generierte Szenario in die Zwischenablage
- **Routen-Verwaltung**: Füge eigene Routen hinzu oder verwalte die vorhandenen

## 🚀 Verwendung

### Online
Die App ist auf GitHub Pages verfügbar:
https://aloyvipa.github.io/tsw5-random-web/

### Lokal
1. Repository klonen oder herunterladen
2. `index.html` in einem Browser öffnen
3. Fertig! Kein Server nötig.

## ⌨️ Tastenkürzel

- `Leertaste` - Neues Szenario generieren
- `Strg+C` - Aktuelles Szenario kopieren

## 🛤️ Enthaltene Routen

### Deutschland
- Schnellfahrstrecke Kassel - Würzburg
- Bahnstrecke Bremen - Oldenburg
- Pfälzische Ludwigsbahn
- Kinzigtalbahn
- Niddertalbahn
- Bahnstrecke Salzburg - Rosenheim
- Ruhr-Sieg Nord
- Rhein-Ruhr Osten
- Hauptstrecke Hamburg - Lübeck
- Hauptstrecke München - Augsburg
- Schnellfahrstrecke Köln-Aachen
- Hauptstrecke Riesa - Dresden
- Hauptstrecke Rhein-Ruhr
- Nahverkehr Dresden
- S-Bahn Zentralschweiz
- Semmeringbahn
- Bahnstrecke S-Bahn Vorarlberg
- Linke Rheinstrecke
- Pfälzische Maximiliansbahn
- Maintalbahn
- Thüringerwaldbahn
- Schnellfahrstrecke Karlsruhe - Basel
- Bahnstrecke Kiel - Lübeck
- Bahnstrecke Würzburg - Stuttgart

### Großbritannien
- West Coast Main Line South
- Midland Main Line
- East Coast Main Line
- Great Western Express
- Southeastern High Speed
- West Cornwall Local
- Glossop Line
- Birmingham Cross-City Line
- Island Line
- Cathcart Circle Line
- West Coast Main Line North
- Blackpool Branches
- East Midlands Railway
- London Overground Suffragette Line
- West Coast Main Line Over Shap
- Spirit of Steam
- Glasgow Cathcart Circle
- Bakerloo Line
- London Commuter
- Scotland Express

### USA
- NEC: Boston - Providence
- Long Island Rail Road
- Cane Creek
- Sherman Hill
- Clinchfield Railroad
- Cajon Pass
- San Bernardino Line
- Peninsula Corridor

## 🌦️ Wetter-System

Die App verwendet realistische Wahrscheinlichkeiten für jeden Monat:

- **Winter** (Dez-Feb): Mehr Schnee und Nebel
- **Frühling** (Mär-Mai): Ausgewogen, weniger Schnee
- **Sommer** (Jun-Aug): Mehr Sonne und Gewitter
- **Herbst** (Sep-Nov): Mehr Wolken und Nebel

## 🛠️ Technologien

- Reines HTML5, CSS3 und Vanilla JavaScript
- Keine externen Abhängigkeiten
- LocalStorage für Routen-Persistenz
- Responsive Design für Mobile

## 📁 Projektstruktur

```
ts5-web/
├── index.html          # Hauptseite
├── css/
│   └── style.css       # Styling (Dark Mode)
├── js/
│   ├── weather.js      # Wetter-Logik
│   ├── routes.js       # Routen-Daten
│   ├── scenario.js     # Szenario-Generator
│   ├── app.js          # Haupt-App-Logik
│   └── weather-config.json  # Wetter-Wahrscheinlichkeiten
└── README.md
```

## 📝 Lizenz

MIT License - siehe [LICENSE](LICENSE)

## 🙏 Credits

Basierend auf der originalen Python/Tkinter App von [MCBlatt](https://github.com/MCBlatt).

## 💬 Feedback

Hast du einen Bug gefunden oder eine Idee für eine neue Funktion?

**Vor dem Erstellen eines neuen Issues:**
🔍 [Bestehende Issues durchsuchen](https://github.com/AloyVipa/tsw5-random-web/issues)

**Neues Issue erstellen:**
- 🐛 [Bug melden](https://github.com/AloyVipa/tsw5-random-web/issues/new?template=bug_report.md)
- 💡 [Idee vorschlagen](https://github.com/AloyVipa/tsw5-random-web/issues/new?template=feature_request.md)