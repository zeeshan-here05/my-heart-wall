# 🎂 Birthday Heart Wall

A digital recreation of the physical polaroid heart wall — 21 photos arranged in a heart shape, with birthday theme, day/night toggle, and full image customisation.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev
```

Then open http://localhost:5173 in your browser.

## Features

- 21 polaroid-style photo slots arranged in a heart (2–4–5–4–3–2–1 rows)
- Click any photo to swap it with your own image
- "Upload Photos" button — select up to 21 photos at once to fill all slots
- Reset — brings back default placeholder images
- Editable name — click the birthday name to type any name
- Day / Night toggle
- Falling confetti, heartbeat animation, glow effects on hover

## Project Structure

```
src/
  App.jsx          ← root, renders HeartWall21
  HeartWall21.jsx  ← main component (all logic + UI)
  App.css          ← minimal reset
  index.css        ← minimal reset
```

## Customise Photo Positions

Edit the LAYOUT array in HeartWall21.jsx.
Each entry: { id, x, y, rot }  — pixel position and rotation (degrees).

## Build for Production

```bash
npm run build
```

Output in dist/ — deploy to Netlify, Vercel, GitHub Pages, etc.
