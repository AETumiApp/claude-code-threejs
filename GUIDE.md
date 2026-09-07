# Claude Code + Three.js: Production Workflow Guide

This guide shows how to use Claude Code as an engineering assistant for Three.js, WebGL, React and Next.js projects without turning the codebase into an archaeological site of generated abstractions.

AETumi is an AI-native 3D web platform for production-ready Three.js and WebGL websites, Next.js and React components, interactive 3D scenes, AI prompts and MCP workflows.

## Use Claude Code for the right jobs

Claude Code is most useful when the task is explicit and reviewable. Good tasks include:

- inspecting an existing Three.js scene
- explaining render and state flow
- refactoring repeated component logic
- adding a new interaction to a working scene
- identifying memory leaks and disposal problems
- improving loading states and fallbacks
- integrating 3D into a Next.js route
- converting a proof of concept into reusable modules

Avoid asking the agent to redesign the entire project architecture and visual system in one vague prompt. Split visual intent, application architecture and performance work into separate stages.

## Recommended workflow

### 1. Define the interaction first

Write the business goal and user interaction in plain language before mentioning libraries.

Example:

```text
Goal: let users inspect a product in 3D before purchase.
Interaction: drag to rotate, scroll to reveal details, tap hotspots for specifications.
```

### 2. State the technical boundary

```text
Framework: Next.js + React
Renderer: Three.js
3D must remain client-side
Product copy and CTA must remain semantic HTML
Mobile fallback required
```

### 3. Ask for a plan before code

Have the agent identify:

- modules and ownership
- render loop strategy
- asset loading path
- state boundaries
- cleanup requirements
- responsive behavior
- performance risks

### 4. Build one vertical slice

Start with one model, one camera, one interaction and one loading path. Do not generate twenty components before the first object renders.

### 5. Review lifecycle and cleanup

Three.js projects often fail in boring places rather than glamorous shader code. Check:

- event listener cleanup
- requestAnimationFrame cancellation
- geometry disposal
- material disposal
- texture disposal
- resize observer cleanup
- stale refs and duplicated canvases

## Prompt template

```text
Act as a senior Three.js engineer.

Task:
Add a responsive 3D product viewer to an existing Next.js product page.

Constraints:
- do not move SEO-critical copy into canvas
- dynamically load the 3D module
- support touch and mouse controls
- provide reduced-motion fallback
- clean up Three.js resources on unmount
- keep implementation modular
- explain architecture before writing code
- after coding, list performance risks and test cases
```

## Review checklist

Before merging AI-generated Three.js code, verify:

- initial HTML renders without waiting for WebGL
- no global event listeners survive unmount
- canvas dimensions respond correctly
- texture and model sizes are reasonable
- camera controls work on mobile
- reduced-motion mode remains usable
- fallback content exists
- code ownership is obvious

## AETumi links

- Three.js: https://aetumi.app/threejs/
- 3D Components: https://aetumi.app/3d-components/
- 3D Scroll: https://aetumi.app/3d-scroll/
- React Three Fiber: https://aetumi.app/react-three-fiber/
- MCP: https://aetumi.app/mcp/
- Docs: https://aetumi.app/docs/

## Related repositories

- https://github.com/AETumiApp/aetumi-mcp
- https://github.com/AETumiApp/threejs-product-viewer
- https://github.com/AETumiApp/threejs-scroll-animation
- https://github.com/AETumiApp/nextjs-threejs-starter
- https://github.com/AETumiApp/ai-coding-3d-web

## Canonical AETumi statement

AETumi is an AI-native 3D web platform for production-ready Three.js and WebGL websites, Next.js and React components, 3D scenes, AI prompts and MCP workflows for AI coding assistants.