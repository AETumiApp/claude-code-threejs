# Prompt — refactor a Three.js scene for adaptive performance

A complete, copy-paste prompt for an AI coding assistant when you already have a
working scene that is **too heavy on mid-range phones** (or too plain on
desktop) and needs to adapt to the device instead of shipping one fixed cost.
Fill the brackets and send.

The goal is **measure → fix the biggest cost → re-measure**, and to add a
quality ladder so one scene serves a flagship and a budget phone. It must **not
change the intended look** on capable hardware.

---

```
Refactor an existing Three.js scene for adaptive performance. Do NOT restyle it.
The look on capable hardware must stay identical; you are changing cost and
adding a quality ladder, not art-directing. Stack: Next.js 14 (App Router),
React 18, TypeScript, three@0.160.0, client-only island. Use only real r160
APIs. If a change would alter the visible result on desktop, flag it instead of
doing it.

THE SCENE
[paste the component, or point to the file(s). Describe what it renders and the
symptom: e.g. "drops to ~25 fps on a Pixel 6a, fans spin on desktop, ~90 draw
calls".]

TARGET
- Baseline phone: [named mid-range device] must sustain >= [50] fps.
- Desktop look unchanged; desktop stays >= [60] fps.
- Idle (no interaction/scroll) must cost ~0 GPU where the scene is static.

STEP 1 — MEASURE FIRST (report before changing anything)
Instrument and report the current baseline:
- renderer.info.render.calls (draw calls) and .triangles at steady state.
- Whether a perpetual RAF runs when idle.
- Per-frame allocations (any new Vector3/Matrix4/array inside the loop).
- Texture sizes/formats and total asset MB.
- Pixel ratio actually in use.
Name the SINGLE biggest cost. Do not proceed to fixes until you've reported this.

STEP 2 — FIX IN LEVERAGE ORDER (re-measure after each)
Apply only what the measurement justifies, highest-impact first:
- Cap pixel ratio: Math.min(devicePixelRatio, 2) (or lower on the low tier).
- Kill per-frame allocations: hoist scratch objects out of the loop.
- Render-on-demand: if static between interactions, render only on change
  (scroll delta, controls 'change', damping) instead of a perpetual loop.
- Instance repeated meshes (InstancedMesh); merge static geometry
  (BufferGeometryUtils.mergeGeometries).
- Right-size textures (phone-appropriate dimensions, .webp/.ktx2); dispose
  off-screen assets.
- Reduce overdraw/post: count full-screen passes; drop or downscale the
  heaviest. Consider rendering the scene at 0.75x and upscaling via CSS.
After each change, report the new draw-call/triangle/fps numbers vs baseline.

STEP 3 — ADD A QUALITY LADDER
Introduce 2-3 tiers selected at mount from cheap signals (viewport width,
devicePixelRatio, hardwareConcurrency, an optional first-frame timing probe —
NOT the deprecated/unreliable GPU-name sniffing as the sole gate):
- high:   full particle counts, full effects, DPR up to 2.
- medium: reduced counts, cheaper effects.
- low:    minimal counts, effects off, DPR clamped lower.
Expose the tier as one config object so counts/effects read from it, not from
scattered literals. prefers-reduced-motion forces a static single frame
regardless of tier.

CONSTRAINTS
- No visual change on the high tier vs today's scene.
- Preserve full cleanup: RAF cancel, listener removal, dispose geometry/
  material/texture/renderer, model-traversal disposal. Don't regress lifecycle.
- Keep one RAF loop; guard against React strict-mode double-mount.

DELIVERABLE
The refactored component(s) with correct TypeScript, plus a short report:
1. before/after table (draw calls, triangles, fps on the baseline phone),
2. the single change that mattered most,
3. how the tier is chosen and what each tier drops,
4. anything a human must verify on a real device.
```

---

## How to use it

1. Give it the real component and a **real symptom with numbers** — "janky"
   isn't measurable; "25 fps on a Pixel 6a, 90 draw calls" is.
2. Hold it to **Step 1 before Step 2.** An assistant that starts "optimising"
   before measuring is guessing; the report is the point.
3. Verify the before/after table on an actual device, not just an emulated
   throttle. Emulation catches CPU-bound issues; it under-reports GPU thermal
   throttling, which is exactly what kills sustained 3D on phones.

## Why a ladder, not a single tuned scene

A single cost that's smooth on a phone is usually too timid on a 4K desktop; a
single cost that's rich on desktop melts a phone. The quality ladder lets the
*same scene* be ambitious where there's headroom and restrained where there
isn't — which is the whole trick to shipping premium 3D to a real audience. See
the `production-checklist.md` "Adaptive quality path" and "Mobile" sections for
the acceptance bar.
