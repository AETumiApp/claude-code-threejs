# Task brief — Three.js hero section

An architecture-first brief you hand to Claude Code (or any AI coding assistant)
*before* it writes a line. Fill in every bracketed field. The point is to force
the decisions that are expensive to change later — stack, boundaries, budget —
up front, so the generated code lands close to production on the first pass.

---

## 1. Goal (one sentence)

> Build a [scroll-reactive / static / interactive] Three.js hero for
> [product / brand / page] that communicates [the one idea] and links to
> [primary CTA].

Keep this to a single sentence. If it needs two, you have two tasks.

## 2. Context & constraints

- **Stack:** Next.js 14 (App Router), React 18, TypeScript, `three@0.160.0`
  (pin it; pin `@types/three@0.160.0` to match).
- **Rendering model:** server-rendered HTML for all copy + metadata; the 3D
  mounts as a **client-only** island via `next/dynamic({ ssr: false })`.
- **No new heavy deps** without asking. Prefer raw `three` over adding a
  framework layer unless the brief says otherwise.
- **Browsers:** last two versions of Chrome, Safari, Firefox, Edge; iOS Safari.
- **Assets:** [list model/texture/HDR files + formats, or "none — procedural"].
  Models must be `.glb` (Draco/meshopt if > 2 MB); textures `.webp`/`.ktx2`.

## 3. Non-goals (explicit)

- No physics engine, no post-processing stack, no asset pipeline changes unless
  listed above.
- Not responsible for the rest of the page — only the hero component and its
  loader.

## 4. File plan (agree before coding)

```
app/
  page.tsx              # server component: metadata + copy + <Hero/> loader
  hero/
    Hero.tsx            # client island; owns renderer lifecycle + cleanup
    useScene.ts         # (optional) scene setup extracted for testability
    poster.jpg          # static fallback shown during load / no-WebGL
```

State the intended responsibility of each file in one line. If the assistant
proposes a different layout, it must say why before writing.

## 5. Acceptance criteria (checklist)

- [ ] Copy and headings are in server-rendered HTML and visible with JS off.
- [ ] 3D loads only in the browser; no `three` import evaluated on the server.
- [ ] `prefers-reduced-motion: reduce` → a single static frame, no RAF loop.
- [ ] Full teardown on unmount: cancel RAF, remove listeners, dispose
      geometries/materials/renderer, remove the canvas.
- [ ] Pixel ratio capped at `Math.min(window.devicePixelRatio, 2)`.
- [ ] Resize handled (camera aspect + renderer size updated).
- [ ] Poster/fallback visible during load and when WebGL is unavailable.
- [ ] No TypeScript errors; no console errors/warnings in a clean run.

## 6. Performance budget (hard numbers)

| Metric | Budget |
| --- | --- |
| Hero JS (gzipped, excl. shared framework) | ≤ 180 KB |
| Total 3D asset payload | ≤ 2.5 MB |
| Draw calls (steady state) | ≤ 30 |
| Sustained frame rate, mid-range phone | ≥ 50 fps |
| LCP element | text/poster, **not** the canvas |

If a choice would blow a budget line, stop and flag it — don't silently ship it.

## 7. Definition of done

Code compiles, meets every acceptance box, stays inside every budget row, and
the assistant has written a two-line note on any trade-off it made and anything
left for a human to verify on real devices.
