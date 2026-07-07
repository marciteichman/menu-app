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
- `app/menu-utils.ts`
- `app/menu-utils.test.ts`
- `app/globals.css`
- `node_modules/`
- `.next/` from the successful production build
- `.gitignore`
- `.githooks/post-commit`

This is now a Git repository on branch `main`, connected to GitHub:

```text
https://github.com/marciteichman/menu-app
```

The local branch tracks `origin/main`.

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
- Single-item image search rules to prefer one food item instead of store, market, tray, pile, or group images.
- Generic search mapping for:
  - `Cheerios` -> `cereal bowl close up food`
  - `apple` / `apples` -> `single apple fruit food`
  - `mango` / `mangoes` -> `single mango fruit food`
  - most other foods -> `single [food] food`
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

Shared menu helper behavior now lives in `app/menu-utils.ts` and is covered by `app/menu-utils.test.ts`:

- `normalizeFoodName`
- `parseFoods`
- `getSearchTerm`
- `isLikelySingleFoodImage`
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

Test/check scripts:

```bash
npm test
npm run lint
npm run build
```

Current behavior:

- `npm test` runs Vitest helper tests.
- `npm run lint` runs `tsc --noEmit`.
- `npm run build` runs the Next.js production build.

All three were run and passed after adding tests:

```bash
npm test
npm run lint
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

Audit note:

```bash
npm audit --omit=dev
```

The audit currently reports two moderate issues through Next.js' `postcss` dependency. The installed Next.js version is already the latest stable (`npm view next version` returned `16.2.10`). `npm audit fix --force` suggests downgrading Next to `9.3.3`, so do not apply that forced fix. Re-check after a newer stable Next.js release is available.

## Dev Server Status

The dev server requires approval/escalation in this environment because sandboxed port binding fails with:

```bash
npm run dev
```

```text
Error: listen EPERM: operation not permitted 0.0.0.0:3000
```

In this session, the escalated dev server started successfully and responded with HTTP 200 at:

```text
http://localhost:3000
```

Before starting a future dev server, check:

```bash
lsof -i :3000
```

If clear, run `npm run dev`. If sandbox blocks binding again, request approval to run it.

## Git / GitHub Versioning

The project has been initialized as a Git repository and pushed to GitHub.

Current GitHub remote:

```bash
git remote -v
```

Expected remote:

```text
origin  https://github.com/marciteichman/menu-app.git (fetch)
origin  https://github.com/marciteichman/menu-app.git (push)
```

An auto-push Git hook is installed:

```text
.githooks/post-commit
```

The repo is configured locally with:

```bash
git config core.hooksPath .githooks
```

Behavior: whenever a commit is created on `main`, the hook automatically runs:

```bash
git push
```

Important: GitHub only receives committed changes. Future sessions should make a commit after meaningful edits. The push should happen automatically after commit. If the auto-push fails because of authentication, ask the user to run `git push` in their own Terminal.

Useful commands for future sessions:

```bash
git status --short --branch
git add .
git commit -m "Describe the change"
```

Because of the auto-push hook, the commit should push to GitHub by itself.

Recent commits:

```text
7ce3454 Add auto-push Git hook
6707fb4 Initial commit
```

## New Session Prompt

Use this prompt to resume work in a new Codex session:

```text
We are working in /Users/marciteichman/Desktop/Menu App on a Next.js/React/TypeScript kids breakfast visual menu app. Read HANDOFF.md first and continue from there.

Important GitHub setup:
- The repo is already initialized on branch main.
- GitHub remote is https://github.com/marciteichman/menu-app.git.
- main tracks origin/main.
- .githooks/post-commit is configured via git config core.hooksPath .githooks.
- After each meaningful change, commit it. The post-commit hook should automatically push to GitHub.
- Before edits, check git status. Do not overwrite unrelated user changes.

User preference: keep the work non-technical and explain steps plainly. The user wants code versioned in GitHub by default and does not want to keep asking about it.

Next likely task: continue improving/testing the breakfast menu app. Start by checking git status, reading the app files, and running the dev server or build as appropriate.
```

## Previous User Instruction Before Handoff

The user explicitly said:

```text
stop what you're doing and create a file wiht the context it in it for a new session to pickup
```

That instruction came before Git/GitHub setup was completed. Since then, Git has been initialized, the repo has been pushed to GitHub, and an auto-push post-commit hook has been added and verified.

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
