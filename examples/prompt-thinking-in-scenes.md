# Prompt — "Think in scenes" (plan before you build)

A reusable planning prompt for an AI coding assistant. It forces the model to
*design the Three.js scene on paper first* — scene graph, camera, lights, motion,
performance, fallback — and get your sign-off before any code. This is the
single highest-leverage habit in 3D web work: the expensive mistakes
(wrong boundary, uncapped cost, no fallback) are all decided here, cheaply, in
prose.

Paste it, fill the brackets, and do **not** let it skip to implementation.

---

```
You are planning a Three.js scene. Do NOT write code yet. First produce a
scene plan I can approve. We are on Next.js 14 (App Router), React 18,
TypeScript, and three@0.160.0 (real r160 APIs only). The scene mounts as a
client-only island (next/dynamic, ssr:false); all page copy stays in
server-rendered HTML. The canvas is decorative and aria-hidden.

THE SCENE I WANT
[one or two sentences: what it shows and the feeling it should create]

THE FEELING / ART DIRECTION
- Mood: [e.g. precise, calm, expensive]
- Palette: [2-4 hex values, or a named reference]
- Restraint: [what it must NOT do — e.g. no bloom, motion under 8s/cycle,
  never competes with the headline]

CONSTRAINTS
- Performance budget: [e.g. <= 30 draw calls, <= 300k tris, >= 50 fps on a
  named mid-range phone, <= 2.5 MB assets].
- Must honour prefers-reduced-motion (single static frame, no loop).
- Must have a poster/fallback for no-WebGL and during load.
- Assets available: [list model/texture/HDR files + formats, or "none —
  procedural"].

Return the plan in these numbered sections, and NOTHING else. Commit to real
numbers — no "some particles" or "a nice light". I will push back on the
numbers, so give me numbers to push on.

1. SCENE GRAPH — the objects as a short tree. For each: geometry, material
   (type + key params), rough scale, and why it exists. Mark each static vs
   animated. State the expected draw-call and triangle count for the whole
   graph and how you arrived at it.

2. CAMERA — type (perspective/orthographic), FOV or frustum, start position and
   what it frames. Any movement over time or scroll, with the start/end values.

3. LIGHTING — each light (type, colour, intensity, direction) and the mood it
   creates. Prefer the fewest lights that read well. State tone mapping
   (e.g. ACESFilmic) and colour space (SRGB output), and whether an environment
   map is used instead of/alongside lights.

4. MOTION — what animates and exactly how it is driven (clock time, scroll
   progress p in [0,1], pointer). Give the actual easing functions and value
   ranges. State the reduced-motion behaviour explicitly (what the single static
   frame looks like). Confirm scrolling/interaction is reversible if applicable.

5. PERFORMANCE PLAN — how you stay inside the budget: instancing, geometry
   merging, texture sizes and formats, render-on-demand vs continuous loop,
   pixel-ratio cap, shadow/post cost. Name the SINGLE biggest risk to the frame
   rate and how you'll measure it (renderer.info.render.calls, frame timing).

6. ADAPTIVE QUALITY — what scales down on low-end / narrow viewports (particle
   counts, effects, DPR) and the threshold that triggers it.

7. FALLBACK PLAN — the poster, the no-WebGL path, the loading state (no layout
   shift), asset-load-error handling, and context-loss handling.

8. FILE PLAN — the files you will create and the one-line responsibility of
   each, matching the client-island pattern (server loader + client island +
   poster). Note where cleanup/disposal lives.

9. LIFECYCLE — how you cancel RAF, remove listeners, and dispose every GPU
   resource (including textures and any loaded-model traversal) on unmount, and
   how you avoid a doubled loop under React strict mode.

10. OPEN QUESTIONS — anything ambiguous you need me to decide before coding.

Wait for my explicit approval before writing any code.
```

---

## How to use it

1. Fill the bracketed fields and send. Pair it with the
   [task brief](./task-brief.md) so budget and acceptance criteria travel with
   the plan.
2. **Read sections 5, 6 and 9 hardest.** Performance plan, adaptive quality and
   lifecycle are where 3D work actually fails — a beautiful scene that leaks
   contexts or janks on a phone is not shipped.
3. Push back on anything vague until it commits to numbers and named easing.
   "Some particles" is a red flag; "1,200 instanced points, scaled to 400 below
   768px" is a plan.
4. Only then say **"approved, implement it"** — ideally with the brief attached,
   so the acceptance criteria and budget are already in context.

## Why the plan is the deliverable

The scene plan is a durable artifact. It reviews faster than code, catches the
expensive errors before they cost anything, and hands cleanly to a different
assistant. Approving a concrete plan is what makes the implementation boring —
which, for production 3D, is exactly the goal.
