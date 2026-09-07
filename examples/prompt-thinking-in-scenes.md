# Prompt — "Think in scenes" (plan before you build)

A reusable planning prompt for an AI coding assistant. It asks the model to
*design the Three.js scene on paper first* — camera, lights, objects, animation,
performance, fallback — and get your sign-off before writing code. Paste it,
fill the brackets, and do not let it skip to implementation.

---

```
You are planning a Three.js scene. Do NOT write code yet. First produce a
scene plan I can approve. We are on Next.js 14 (App Router), React 18,
TypeScript, and three@0.160.0. The scene mounts as a client-only island
(next/dynamic, ssr:false); all page copy stays in server-rendered HTML.

The scene I want:
[one or two sentences: what it shows and the feeling it should create]

Constraints:
- Performance budget: [e.g. ≤ 30 draw calls, ≥ 50 fps on a mid-range phone,
  ≤ 2.5 MB assets]
- Must honour prefers-reduced-motion (static frame, no loop).
- Must have a poster/fallback for no-WebGL and during load.
- Assets available: [list, or "none — procedural"].

Return the plan in these sections, and nothing else:

1. SCENE GRAPH — the objects, as a short tree. For each: geometry, material
   (type + key params), rough scale, and why it exists. Note which are static
   vs animated.

2. CAMERA — type (perspective/orthographic), FOV or frustum, start position and
   what it frames. Any camera movement over time or scroll.

3. LIGHTING — each light (type, colour, intensity, direction) and the mood it
   creates. Prefer the fewest lights that read well.

4. MOTION — what animates and how it is driven (clock time, scroll progress,
   pointer). Give the actual easing/ranges. State the reduced-motion behaviour
   explicitly.

5. PERFORMANCE PLAN — how you stay inside the budget: instancing, geometry
   merging, texture sizes, render-on-demand vs continuous loop, pixel-ratio cap.
   Call out the single biggest risk to the frame rate.

6. FALLBACK PLAN — the poster, the no-WebGL path, and the loading state.

7. FILE PLAN — the files you will create and the one-line responsibility of
   each, matching the client-island pattern above.

8. OPEN QUESTIONS — anything ambiguous you need me to decide before coding.

Keep it concrete. No placeholder values — commit to real numbers I can push
back on. Wait for my approval before writing any code.
```

---

## How to use it

1. Fill the four bracketed fields and send.
2. Read section 5 (performance) and 4 (motion) hardest — that's where 3D work
   goes wrong.
3. Push back on anything vague ("some particles", "a nice light") until it
   commits to numbers.
4. Only then say *"approved, implement it"* — ideally alongside the
   [task brief](./task-brief.md) so the acceptance criteria and budget travel
   with the code.
