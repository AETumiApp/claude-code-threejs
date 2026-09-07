# Production checklist — shipping 3D on the web

Run this before a Three.js / WebGL feature goes live. Ordered by what breaks real
launches most often: performance → fallbacks → accessibility → SEO → mobile →
cleanup → analytics. Check every box or write down why it doesn't apply. Each
item names the *symptom* it prevents, so you know what you're buying.

---

## Performance

- [ ] **Pixel ratio capped:** `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`.
      *Prevents:* the single most common cause of phone jank (a 3× DPR phone
      rendering 9× the pixels).
- [ ] **Draw calls counted:** inspect `renderer.info.render.calls`. Merge static
      geometry (`BufferGeometryUtils.mergeGeometries`); use `InstancedMesh` for
      repeated meshes. *Prevents:* CPU-bound stutter from thousands of tiny
      draws.
- [ ] **Asset payload measured:** models compressed (Draco/meshopt), textures
      `.webp`/`.ktx2`, HDRIs downsampled. Know the total MB over the wire.
      *Prevents:* a 12 MB hero nobody waits for.
- [ ] **Frame loop efficient:** one `requestAnimationFrame` loop; **no per-frame
      allocations** — reuse scratch `Vector3`/`Matrix4`/`Quaternion`/`Object3D`.
      *Prevents:* GC sawtooth and periodic hitches.
- [ ] **Render-on-demand where possible:** if the scene is static between
      interactions, render only when something changed — don't run a perpetual
      RAF. *Prevents:* a laptop fan spinning on an idle page.
- [ ] **Tab visibility respected:** pause the loop on `visibilitychange`
      (hidden). *Prevents:* burning battery in a background tab.
- [ ] **Bundle split:** `three` and the scene are code-split (dynamic import),
      not in the initial/shared chunk. *Prevents:* a 3D dependency taxing every
      route.
- [ ] **Shadows & post budgeted:** shadow maps sized deliberately; post-processing
      passes counted (each full-screen pass is another draw of the whole frame).
      *Prevents:* invisible cost stacking.
- [ ] **Adaptive quality path exists:** particle counts / effect tiers scale down
      below a width or device-tier threshold (see
      [`prompt-refactor-perf.md`](./prompt-refactor-perf.md)). *Prevents:* one
      scene that's either too heavy for phones or too plain for desktops.

## Fallbacks & resilience

- [ ] **WebGL detection:** if context creation fails, show a static image/poster,
      not a blank canvas.
- [ ] **Loading state:** a poster or skeleton is visible until the scene mounts;
      no flash of empty space and **no layout shift** when the canvas appears.
- [ ] **Asset-load errors handled:** a failed model/texture doesn't white-screen
      the page — catch and fall back to the poster + a short message.
- [ ] **Context-loss handled:** listen for `webglcontextlost` (call
      `preventDefault`) and either recover on `webglcontextrestored` or show the
      fallback. Mobile GPUs drop contexts under memory pressure.
- [ ] **Reduced-quality decode:** oversized textures don't OOM low-end phones
      (resize/`KTX2` before upload).

## Accessibility

- [ ] **`prefers-reduced-motion` honoured:** no autoplaying motion; render a
      single static frame for users who asked to reduce motion. Not a slowed-down
      loop — actually stopped.
- [ ] **Canvas is not the content:** decorative canvases are `aria-hidden`; all
      meaning is in real HTML text beside it.
- [ ] **Keyboard:** every interactive 3D control has a keyboard-operable
      equivalent (real DOM buttons), or the action is reachable via normal DOM
      controls. Focus states are visible.
- [ ] **Contrast:** text overlaid on the canvas meets WCAG AA against the
      *darkest and lightest* frames the scene can show — test the extremes, not
      the average.
- [ ] **No seizure risk:** no rapid full-screen flashing (> 3 flashes/sec).
- [ ] **Focus not trapped:** the canvas doesn't swallow tab order; screen-reader
      users can move past it.

## SEO & metadata

- [ ] **Copy is server-rendered HTML**, present with JS disabled — not painted
      into the canvas or injected only on the client.
- [ ] **Title + meta description** set; **OpenGraph/Twitter image** is a static
      screenshot of the scene (crawlers can't run WebGL).
- [ ] **Headings are real `<h1>/<h2>`**; semantic landmarks used.
- [ ] **LCP is text or a poster image,** not the canvas — verify in Lighthouse.
- [ ] **Structured data** (if the page warrants it) is in the HTML, unaffected by
      the 3D island.

## Mobile

- [ ] **Tested on a real mid-range Android**, not just a desktop and a flagship
      phone. Emulated throttling is a proxy, not proof.
- [ ] **Touch handled:** gestures don't fight page scroll; `touch-action` set
      where you capture drags. Pinch-zoom on the model doesn't zoom the page.
- [ ] **Thermals sane:** the scene doesn't pin the GPU at 100% forever (leads to
      throttling, then a slideshow, then battery complaints).
- [ ] **Memory bounded:** textures sized for phones (no 4K textures on a
      handset); off-screen assets disposed.
- [ ] **Reduced-quality path active on mobile:** lower particle counts / disabled
      expensive effects below the threshold actually kick in on the device.

## Cleanup & lifecycle

- [ ] **Full disposal on unmount:** geometries, materials, **textures**,
      render targets, controls, environment maps, and the renderer are all
      disposed; RAF cancelled; listeners removed; canvas removed.
- [ ] **Traversal disposal for loaded models:** `scene.traverse` disposing each
      mesh's geometry and material(s) and their textures — a single top-level
      dispose misses nested resources.
- [ ] **No leaked contexts across navigation:** route changes don't accumulate
      WebGL contexts (browsers cap them ~16; leaking = eventual "too many
      contexts" and a dead canvas). Verify by navigating in and out repeatedly.
- [ ] **No doubled loops after remount:** React strict-mode double-invoke doesn't
      leave two RAF loops running.

## Analytics & observability

- [ ] **Load success/failure tracked:** you can tell in the field how often the
      no-WebGL / load-error fallback is being shown.
- [ ] **A performance signal captured:** e.g. a sampled frame-time or a
      "downgraded to reduced-quality" event, so real-device regressions surface.
- [ ] **No PII in any of it**, and analytics respects the same reduced-motion /
      consent posture as the rest of the site.

## Final gate

- [ ] Lighthouse (mobile) run **recorded**; Performance and Accessibility scores
      known and acceptable.
- [ ] No console errors or warnings in a clean production build.
- [ ] Every GPU resource disposed on route change (checked, not assumed).
- [ ] Any waived box above is waived *in writing* with a reason — not by
      omission.
