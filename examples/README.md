# Claude Code × Three.js — workflow examples

Architecture-first working material for building Three.js / WebGL features with
Claude Code (the patterns apply to Cursor and Codex too). This is a *workflow*
repo: the value is in the process and the durable artifacts, not a runnable app.

Hub: <https://aetumi.app/claude-code-threejs>

## Contents

| File | Use it when |
| --- | --- |
| [`task-brief.md`](./task-brief.md) | Starting a 3D task. A fill-in brief that locks stack, boundaries, file plan, acceptance criteria, a hard performance budget, an a11y contract and a fallback plan before any code is written. |
| [`prompt-thinking-in-scenes.md`](./prompt-thinking-in-scenes.md) | Planning the scene. A copy-paste prompt that makes the assistant design the scene graph, camera, lights, motion, adaptive quality, perf and fallback *on paper* for your sign-off first. |
| [`prompt-refactor-perf.md`](./prompt-refactor-perf.md) | A scene works but janks on phones. A prompt to measure first, fix the biggest cost, and add a device-aware quality ladder — without changing the look. |
| [`production-checklist.md`](./production-checklist.md) | Before shipping. An ordered gate covering performance, fallbacks, accessibility, SEO, mobile, cleanup and analytics. |

## The loop these support

1. **Brief** — fill in `task-brief.md`. Decide the expensive things up front.
2. **Plan** — run `prompt-thinking-in-scenes.md`. Approve a concrete scene plan
   before implementation.
3. **Implement** — let the assistant build against the approved plan + brief.
4. **Refine** — if it's heavy, run `prompt-refactor-perf.md` to make it adapt.
5. **Ship** — walk `production-checklist.md`; launch only when every box is
   checked or consciously waived.

Every one of these is a plain-markdown **artifact**. That's deliberate: hand the
brief, scene plan and checklist to whichever assistant you open, and the work
travels — Claude Code, Cursor, Codex — without losing the thread.

## Baseline assumptions

- **Next.js 14 (App Router), React 18, TypeScript, `three@0.160.0`** — real r160
  APIs only.
- **Server-rendered HTML + client-only 3D island** (`next/dynamic`,
  `ssr: false`) — copy and metadata are crawlable; WebGL runs only in the
  browser.
- **Accessibility and a performance budget are requirements, not polish** —
  `prefers-reduced-motion`, a poster fallback, capped pixel ratio, adaptive
  quality and full resource disposal are in the acceptance criteria from the
  start.

## Companion repos

- Reference implementation of the client-island pattern:
  <https://aetumi.app/nextjs-threejs-starter>
- The cross-assistant five-phase loop these slot into:
  <https://aetumi.app/ai-coding-3d-web>
- Copy-paste build prompts for specific scenes:
  <https://aetumi.app/3d-web-ai-prompts>
- Driving all of this with grounded context via MCP:
  <https://aetumi.app/aetumi-mcp>
