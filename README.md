# Summa Presentatie Rad

Een interactief draairad voor presentaties, speciaal gemaakt voor Summa College.

## Features

- Draai het rad om willekeurig een presentatie-onderwerp te kiezen
- Aanpasbare onderwerpen via admin panel (toegang: druk 7x op '9')
- Geluideffecten: 3-tonig ratelgeluid tijdens draaien, winnaarsjingle bij resultaat
- Confetti animatie bij winnaar
- Responsive design met Summa College branding

## Run Locally

**Prerequisites:** Node.js

1. Installeer dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open browser op: `http://localhost:3000`

## Deploy naar diva.summacollege.nl/rad

De app is geconfigureerd voor deployment op `diva.summacollege.nl/rad`.

1. Build de app:
   ```bash
   npm run build
   ```

2. Upload de volledige inhoud van de `dist` folder naar de server:
   - Alle bestanden in `dist/` moeten in de `/rad/` directory op de server komen
   - Behoud de folder structuur (vooral `assets/`)

3. Zorg ervoor dat de webserver de juiste MIME types gebruikt:
   - `.js` files als `application/javascript`
   - `.html` files als `text/html`

4. De app is nu beschikbaar op: `https://diva.summacollege.nl/rad/`

## Admin Panel

Druk 7x op toets '9' om het admin panel te openen waar je:
- Onderwerpen kunt toevoegen
- Onderwerpen kunt verwijderen
- Onderwerpen kunt bewerken

## Technologie

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Web Audio API voor geluidseffecten
- Canvas Confetti voor animaties