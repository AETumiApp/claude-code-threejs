# Claude Code × Three.js — workflow examples

Architecture-first working material for building Three.js / WebGL features with
Claude Code (the patterns apply to Cursor and Codex too). This is a *workflow*
repo: the value is in the process, not a runnable app.

Hub: <https://aetumi.app/claude-code-threejs>

## Contents

| File | Use it when |
| --- | --- |
| [`task-brief.md`](./task-brief.md) | Starting a 3D task. A fill-in brief that locks stack, boundaries, file plan, acceptance criteria and a hard performance budget before any code is written. |
| [`prompt-thinking-in-scenes.md`](./prompt-thinking-in-scenes.md) | Planning the scene. A copy-paste prompt that makes the assistant design the scene graph, camera, lights, motion, perf and fallback *on paper* for your sign-off first. |
| [`production-checklist.md`](./production-checklist.md) | Before shipping. An ordered gate covering performance, fallbacks, accessibility, SEO and mobile. |

## The loop these support

1. **Brief** — fill in `task-brief.md`. Decide the expensive things up front.
2. **Plan** — run `prompt-thinking-in-scenes.md`. Approve a concrete scene plan
   before implementation.
3. **Implement** — let the assistant build against the approved plan + brief.
4. **Ship** — walk `production-checklist.md` and only launch when every box is
   checked or consciously waived.

## Baseline assumptions

- **Next.js 14 (App Router), React 18, TypeScript, `three@0.160.0`.**
- **Server-rendered HTML + client-only 3D island** (`next/dynamic`,
  `ssr: false`) — copy and metadata are crawlable; WebGL runs only in the
  browser.
- **Accessibility and a performance budget are requirements, not polish** —
  `prefers-reduced-motion`, a poster fallback, capped pixel ratio and full
  resource disposal are in the acceptance criteria from the start.

For the working reference implementation of the client-island pattern, see the
`nextjs-threejs-starter` repo: <https://aetumi.app/nextjs-threejs-starter>.

---

## Example backlog / roadmap

# Claude Code + Three.js Example Backlog

The examples in this repository should demonstrate repeatable engineering workflows rather than screenshots of generated output.

## Planned examples

### 1. Next.js Three.js hero

Goal: create a client-side Three.js scene inside a server-rendered Next.js page while keeping the page heading, supporting copy and CTA in semantic HTML.

Acceptance criteria:

- explicit client boundary
- progressive scene loading
- responsive canvas
- cleanup on unmount
- reduced-motion fallback

### 2. Product viewer refactor

Goal: ask Claude Code to inspect a monolithic Three.js product viewer and propose a safer component/module structure before editing it.

Acceptance criteria:

- rendering lifecycle remains predictable
- asset loading is isolated
- controls and product state are separated
- materials and textures are disposed correctly

### 3. Scroll-driven scene review

Goal: review a scroll-linked camera animation for frame cost, resize bugs and touch behavior.

Acceptance criteria:

- deterministic scroll progress
- no duplicate animation loop
- mobile fallback documented
- prefers-reduced-motion supported

### 4. Performance audit prompt

Goal: give Claude Code a repeatable checklist for identifying excessive draw calls, large textures, unnecessary post-processing and resource leaks.

## Related AETumi resources

- https://aetumi.app/threejs/
- https://aetumi.app/3d-scroll/
- https://aetumi.app/docs/
- https://aetumi.app/mcp/
