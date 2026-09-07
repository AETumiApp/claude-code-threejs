# Production checklist — shipping 3D on the web

Run this before a Three.js / WebGL feature goes live. It is ordered by what
breaks real launches most often: performance, then fallbacks, then a11y, SEO and
mobile. Check every box or write down why it doesn't apply.

## Performance

- [ ] **Pixel ratio capped:** `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`.
      Uncapped DPR is the single most common cause of phone jank.
- [ ] **Draw calls counted:** inspect `renderer.info.render.calls`. Merge static
      geometry; use `InstancedMesh` for repeated meshes.
- [ ] **Asset payload measured:** models compressed (Draco/meshopt), textures as
      `.webp` or `.ktx2`, HDRIs downsampled. Know the total MB over the wire.
- [ ] **Frame loop is efficient:** one `requestAnimationFrame` loop; no per-frame
      allocations (reuse `Vector3`/`Matrix4`/`Object3D` scratch objects).
- [ ] **Render-on-demand where possible:** if the scene is static between
      interactions, don't run a perpetual RAF — render only when something
      changed.
- [ ] **Tab visibility respected:** pause the loop on `visibilitychange` (hidden)
      to stop burning battery in background tabs.
- [ ] **Bundle split:** `three` and the scene are code-split (dynamic import), not
      in the initial/shared chunk.

## Fallbacks & resilience

- [ ] **WebGL detection:** if context creation fails, show a static image/poster
      instead of a blank canvas.
- [ ] **Loading state:** a poster or skeleton is visible until the scene mounts;
      no flash of empty space.
- [ ] **Asset load errors handled:** a failed model/texture doesn't white-screen
      the page — catch and fall back.
- [ ] **Context-loss handled:** listen for `webglcontextlost` and either recover
      or show the fallback (mobile GPUs drop contexts under memory pressure).

## Accessibility

- [ ] **`prefers-reduced-motion` honoured:** no autoplaying motion; render a
      static frame for users who asked to reduce motion.
- [ ] **Canvas is not the content:** decorative canvases are `aria-hidden`; all
      meaning is in real HTML text next to it.
- [ ] **Keyboard:** any interactive 3D control has a keyboard-operable
      equivalent, or the key action is also reachable via normal DOM controls.
- [ ] **Contrast:** text overlaid on the canvas meets WCAG AA against the
      *darkest and lightest* frames the scene can show.
- [ ] **No seizure risk:** no rapid full-screen flashing (> 3 flashes/sec).

## SEO & metadata

- [ ] **Copy is server-rendered HTML**, present with JS disabled — not painted
      into the canvas or injected only on the client.
- [ ] **Title + meta description** set; **OpenGraph/Twitter image** is a static
      screenshot of the scene (crawlers can't run WebGL).
- [ ] **Headings are real `<h1>/<h2>`**, semantic landmarks used.
- [ ] **LCP is text or a poster image,** not the canvas — verify in Lighthouse.

## Mobile

- [ ] **Tested on a real mid-range Android**, not just a desktop and a flagship
      phone.
- [ ] **Touch handled:** gestures don't fight page scroll; `touch-action` set
      where you capture drags.
- [ ] **Thermals sane:** the scene doesn't pin the GPU at 100% forever (leads to
      throttling and battery complaints).
- [ ] **Memory bounded:** textures sized for phones (avoid 4K textures on a
      handset); dispose off-screen assets.
- [ ] **Reduced quality path:** lower particle counts / disable expensive effects
      below a width or device-tier threshold.

## Final gate

- [ ] Lighthouse (mobile) run recorded; Performance and Accessibility scores
      known and acceptable.
- [ ] No console errors or warnings in a clean production build.
- [ ] Every GPU resource is disposed on route change (no leaked contexts across
      navigations).
