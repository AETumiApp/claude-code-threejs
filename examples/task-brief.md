# Task brief — Three.js feature (architecture-first)

An expert brief you hand to Claude Code (or any AI coding assistant) *before* it
writes a line. Fill every bracketed field. The point is to force the decisions
that are expensive to change later — stack, boundaries, budget, fallback,
a11y — up front, so the generated code lands near production on the first pass.

Copy this file, fill it in, and keep it in the repo. It is a durable artifact:
it travels to whichever assistant you open next, and it *is* the acceptance
contract at review time.

---

## 0. Type & one-line summary

- **Feature type:** [hero backdrop / scroll scene / product viewer / shader
  background / full landing / other].
- **Summary:** [one sentence a stranger could act on].

## 1. Goal (one sentence)

> Build a [scroll-reactive / static / interactive] Three.js [feature] for
> [product / brand / page] that communicates [the one idea] and links to
> [primary CTA].

If it needs two sentences, you have two tasks — split them.

## 2. The feeling (art direction, in words)

Three lines the assistant tunes against. Vague adjectives here cause vague
scenes, so anchor them:

- **Mood:** [e.g. precise, calm, expensive — not playful or loud].
- **Reference:** [a named look you're after, or 2-3 palette hex values].
- **Restraint:** [what it must NOT do — e.g. "no bloom, no lens flare, motion
  under 8s per cycle, never competes with the headline"].

## 3. Context & constraints

- **Stack:** Next.js 14 (App Router), React 18, TypeScript, `three@0.160.0`
  (pin it; pin `@types/three@0.160.0` to match). Real r160 APIs only.
- **Rendering model:** server-rendered HTML for all copy + metadata; the 3D
  mounts as a **client-only** island via `next/dynamic({ ssr: false })`.
- **Dependencies:** no new heavy deps without asking. Prefer raw `three` over a
  framework layer unless this brief says otherwise. If R3F/drei is already in the
  project, say so here so the assistant matches it.
- **Target devices:** last two versions of Chrome, Safari, Firefox, Edge; iOS
  Safari. **Baseline phone:** [name a real mid-range device] — the scene must be
  smooth there, not just on your laptop.
- **Assets:** [list model/texture/HDR files + formats, or "none — procedural"].
  Models `.glb` (Draco/meshopt if > 2 MB); textures `.webp`/`.ktx2`; HDRIs
  downsampled.

## 4. Non-goals (explicit)

- No physics engine, no post-processing stack, no asset-pipeline changes unless
  listed in §3.
- Not responsible for the rest of the page — only this component and its loader.
- [Anything else out of scope — say it, so it doesn't get gold-plated.]

## 5. File plan (agree before coding)

```
app/
  [route]/page.tsx       # server component: metadata + copy + <Feature/> loader
  [route]/Feature.tsx    # client island; owns renderer lifecycle + cleanup
  [route]/useScene.ts    # (optional) scene setup extracted for testability
  [route]/poster.jpg     # static fallback shown during load / no-WebGL
```

State each file's responsibility in one line. If the assistant wants a different
layout, it must say why *before* writing.

## 6. Acceptance criteria (checklist)

- [ ] Copy and headings are server-rendered HTML, visible with JS off.
- [ ] 3D loads only in the browser; no `three` import evaluated on the server.
- [ ] `prefers-reduced-motion: reduce` → a single static frame, no RAF loop.
- [ ] Full teardown on unmount: cancel RAF, remove listeners, dispose
      geometries/materials/textures/renderer, remove the canvas.
- [ ] Pixel ratio capped at `Math.min(window.devicePixelRatio, 2)`.
- [ ] Resize handled (camera aspect + renderer size updated).
- [ ] Poster/fallback visible during load and when WebGL is unavailable.
- [ ] Context-loss handled (`webglcontextlost` → recover or show fallback).
- [ ] Tab-hidden pauses the loop (`visibilitychange`).
- [ ] No TypeScript errors; no console errors/warnings in a clean run.

## 7. Performance budget (hard numbers)

| Metric | Budget |
| --- | --- |
| Feature JS (gzipped, excl. shared framework) | ≤ [180] KB |
| Total 3D asset payload over the wire | ≤ [2.5] MB |
| Draw calls (steady state) | ≤ [30] |
| Triangles (steady state) | ≤ [300k] |
| Sustained frame rate on the baseline phone | ≥ [50] fps |
| Time to first interactive (broadband) | ≤ [2] s |
| LCP element | text/poster, **not** the canvas |

If a choice would blow a budget line, **stop and flag it** — don't silently ship
it. A budget you never enforce is a wish.

## 8. Accessibility contract

- Canvas is decorative → `aria-hidden`; **all meaning lives in real HTML** next
  to it.
- Any interactive 3D control has a keyboard-operable equivalent (real DOM
  buttons for rotate/reset/next, not mouse-drag only).
- Text over the canvas meets **WCAG AA against the darkest and lightest frames**
  the scene can produce, not just the average.
- No rapid full-screen flashing (> 3 flashes/sec). Reduced-motion is honoured,
  not faked.

## 9. Fallback & resilience plan

- **No-WebGL:** [poster image / CSS gradient] shows instead of a blank canvas.
- **Load failure:** a failed model/texture falls back to the poster + a short
  message — never a white screen.
- **Context loss:** on `webglcontextlost`, [attempt restore / show poster].
- **Loading state:** poster or skeleton visible until the scene mounts; no flash
  of empty space, no layout shift when it appears.

## 10. Definition of done

Code compiles, meets **every** acceptance box, stays inside **every** budget
row, honours the a11y contract and the fallback plan, and the assistant has
written a short note covering:
1. any assumption it made,
2. the measured draw-call count and (if known) triangle count,
3. anything a human must verify on real devices.

Anything waived is waived *consciously, in writing* — not by omission.

---

### How to drive it

1. Fill §0–§9 and hand the whole brief over. Do not let the assistant start
   coding from §1 alone — the budget, a11y and fallback sections are what keep it
   honest.
2. Pair this with [`prompt-thinking-in-scenes.md`](./prompt-thinking-in-scenes.md)
   so a concrete scene plan is approved before implementation.
3. At review, walk [`production-checklist.md`](./production-checklist.md) — this
   brief's §6–§9 map straight onto it.
