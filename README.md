# Breakfast Menu

A simple Next.js MVP for creating a visual breakfast menu for kids. Type breakfast foods separated by commas, and the app creates a kid-friendly image grid with one card per food.

## Features

- Comma-separated breakfast food input
- Responsive visual menu grid
- Free Wikimedia Commons image search
- Local image cache and recently used foods via `localStorage`
- Regenerate image, edit food, remove food, clear menu, shuffle, and print/PDF controls
- Emoji fallback when no image is available

## Run Locally

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Notes

Images are searched from Wikimedia Commons in the browser. The app stores selected image URLs and recent foods locally in your browser only. No database, authentication, or paid image generation is used.
