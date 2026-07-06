# Handoff Context

## Project

Workspace: `/Users/marciteichman/Desktop/Menu App`

Goal: build a simple Next.js, React, TypeScript MVP for a kids breakfast visual menu app.

The user wants to type comma-separated breakfast foods, for example:

```text
Cheerios, sliced mango, apples, omelet
```

The app should create a bright, clean, kid-friendly visual menu grid where each food has its own separate image card. It should not look like one combined plate. Kid-facing cards should not show visible food labels by default, but images need useful alt text.

## Current State

A minimal Next.js App Router project has been created in this workspace.

Files currently present:

- `package.json`
- `package-lock.json`
- `next.config.ts`
- `next-env.d.ts`
- `tsconfig.json`
- `README.md`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `node_modules/`
- `.next/` from the successful production build

This is not a git repository.

## Implemented App Behavior

`app/page.tsx` currently contains a client-side implementation with:

- Large textarea input.
- Exact requested placeholder:
  - `Type breakfast foods separated by commas, like: Cheerios, mango, apples, omelet`
- `Create Breakfast Menu` button.
- Comma parsing with trimming, empty-item filtering, and deduplication by normalized name.
- Responsive food grid.
- One visual card per food.
- No visible food labels on cards.
- Useful image alt text.
- Wikimedia Commons image search from the browser.
- Generic search mapping for:
  - `Cheerios` -> `cereal bowl food`
  - `apple` / `apples` -> `apple fruit food`
- Image results cached in `localStorage`.
- Recent foods saved in `localStorage`.
- Recent food chips below the input.
- Regenerate picture control per card.
- Regeneration chooses a different URL when another cached result exists.
- Fallback emoji card if no image is available or image loading fails.
- Edit food name via `window.prompt`.
- Remove card.
- Clear menu.
- Shuffle order.
- Print / Save as PDF via `window.print()`.
- Print CSS hides builder/admin controls and prints the visual grid.

The code is organized into these in-file components/helpers:

- `BreakfastMenuApp`
- `FoodInputPanel`
- `RecentFoodChips`
- `MenuToolbar`
- `FoodGrid`
- `FoodCardView`
- `EmptyMenu`
- `normalizeFoodName`
- `parseFoods`
- `createFoodCard`
- `getSearchTerm`
- `searchWikimediaImages`
- `readJson`
- `writeJson`
- `getFallbackEmoji`
- `shuffleItems`
- `mergeRecentFoods`
- `getNextImageUrl`

## Styling

`app/globals.css` contains a bright kid-friendly design:

- Warm light background.
- Playful yellow, mint, sky, and pink card colors.
- 8px border radii.
- Desktop grid: 4 columns.
- Medium grid: 3 columns.
- Mobile grid: 2 columns.
- Card controls are subtle and small.
- Print mode hides input, toolbar, controls, and empty state.

## Dependency / Build Status

Dependency install was completed with approval:

```bash
npm install
```

Initial pinned Next.js version reported a security warning, so framework packages were updated:

```bash
npm install next@latest react@latest react-dom@latest
```

Current `package.json` dependencies at time of handoff:

```json
{
  "next": "^16.2.10",
  "react": "^19.2.7",
  "react-dom": "^19.2.7"
}
```

Production build was run and passed:

```bash
npm run build
```

Build output summary:

- Next.js `16.2.10`
- Compiled successfully.
- TypeScript completed successfully.
- Static route `/` generated successfully.

During build, Next updated `tsconfig.json` automatically:

- `jsx` changed to `react-jsx`
- `.next/dev/types/**/*.ts` added to `include`

Those changes were left in place.

## Dev Server Status

Attempted:

```bash
npm run dev
```

Inside sandbox, it failed with:

```text
Error: listen EPERM: operation not permitted 0.0.0.0:3000
```

This appears to be sandbox restriction on binding a local port, not an app compile error.

An escalated attempt to run the dev server was started but the user interrupted it and asked to stop and create this handoff file. Do not assume the dev server is currently running. In a new session, check before starting:

```bash
lsof -i :3000
```

If clear, run:

```bash
npm run dev
```

If sandbox blocks binding again, request approval to run `npm run dev`.

## User Instruction Before Handoff

The user explicitly said:

```text
stop what you're doing and create a file wiht the context it in it for a new session to pickup
```

So no further verification was performed after this file was created.

## Recommended Next Steps

1. Check whether any dev server is already running:

   ```bash
   lsof -i :3000
   ```

2. Start the app:

   ```bash
   npm run dev
   ```

3. Open:

   ```text
   http://localhost:3000
   ```

4. Manually test:

   - Enter `Cheerios, sliced mango, apples, omelet`.
   - Confirm four cards render.
   - Confirm recent chips append foods.
   - Confirm regenerate chooses a different image when possible.
   - Confirm edit, remove, clear, shuffle, and print controls work.
   - Confirm mobile layout stays at two columns and controls do not overlap.
   - Confirm browser console has no runtime errors.

5. Audit can be run later if desired. The user specifically asked to skip audit for now.

