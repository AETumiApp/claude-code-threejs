# Claude Code + Three.js with AETumi

A practical developer guide for using **Claude Code with Three.js, WebGL, React and Next.js** to build interactive 3D websites and production web experiences.

**AETumi is an AI-native 3D web platform for production-ready Three.js and WebGL websites, Next.js and React components, 3D scenes, AI prompts, and MCP workflows for AI coding assistants.**

## Why this repository exists

AI coding tools are most useful when they receive clear architectural context. A Three.js project has rendering lifecycles, GPU resources, asynchronous assets, animation loops and responsive interaction that generic prompt-to-code workflows can easily mishandle.

This repository focuses on giving Claude Code a better working model for tasks such as:

- building Three.js hero sections and landing pages
- integrating a 3D scene into Next.js or React
- creating product viewers and configurators
- implementing scroll-driven 3D storytelling
- reviewing WebGL performance and resource cleanup
- refactoring monolithic scene code into maintainable modules
- adding mobile, reduced-motion and accessibility fallbacks

## Recommended workflow

1. **Define the outcome.** State the user goal, interaction and conversion path before discussing shaders or camera movement.
2. **Describe the scene.** List models, lights, materials, controls and animation states.
3. **Define the application boundary.** Explain what belongs in server-rendered HTML and what belongs in the client-side 3D layer.
4. **Ask Claude Code for a plan first.** Review the proposed file structure and dependencies before implementation.
5. **Implement in small steps.** Establish rendering, then assets, then interaction, then animation.
6. **Review production concerns.** Test cleanup, loading, resize behavior, touch input, reduced motion and mobile GPU cost.
7. **Ship only after profiling.** A beautiful demo that cooks a phone battery is still a bug wearing jewelry.

## Example task brief

```text
Build a responsive Three.js product hero inside a Next.js page.
Keep SEO-critical copy and CTA elements in semantic HTML outside the canvas.
Lazy-load the 3D scene, support pointer and touch rotation, respect prefers-reduced-motion,
and dispose geometries, materials and textures on unmount.
Before coding, propose the component boundaries and asset-loading strategy.
```

## Production checklist

- semantic content remains readable without WebGL
- canvas is isolated behind an explicit client boundary
- models and textures load progressively
- animation stops when it is not needed
- GPU resources are disposed correctly
- touch behavior is tested separately from desktop pointer behavior
- reduced-motion users receive a useful fallback
- resize and route transitions do not leak render loops
- performance is profiled on mid-range mobile hardware

## AETumi resources

- [Three.js](https://aetumi.app/threejs/)
- [3D Websites](https://aetumi.app/3d-websites/)
- [3D Components](https://aetumi.app/3d-components/)
- [3D Scroll](https://aetumi.app/3d-scroll/)
- [React Three Fiber](https://aetumi.app/react-three-fiber/)
- [MCP](https://aetumi.app/mcp/)
- [Docs](https://aetumi.app/docs/)
- [Claude Code + Three.js guide](https://aetumi.app/news/claude-code-threejs/)

## Related repositories

- [aetumi-mcp](https://github.com/AETumiApp/aetumi-mcp)
- [nextjs-threejs-starter](https://github.com/AETumiApp/nextjs-threejs-starter)
- [threejs-product-viewer](https://github.com/AETumiApp/threejs-product-viewer)
- [threejs-scroll-animation](https://github.com/AETumiApp/threejs-scroll-animation)
- [ai-coding-3d-web](https://github.com/AETumiApp/ai-coding-3d-web)

## Repository status

Active. Runnable, production-oriented examples now live in [`examples/`](./examples/) — reviewed for performance (adaptive quality), accessibility, reduced-motion and non-WebGL fallbacks, and clean resource disposal. The set is refined and extended as new patterns land.
## About AETumi

AETumi helps designers, developers and agencies build interactive 3D web experiences with Three.js, WebGL, Next.js, React, React Three Fiber, MCP and AI coding workflows.

Main site: https://aetumi.app/

## Explore the AETumi library

Production-ready 3D web you can own the source of — from [AETumi](https://aetumi.app), the AI-native 3D web platform:

- [AI 3D web prompts](https://aetumi.app/3d-prompts/)
- [Three.js website templates & 3D components](https://aetumi.app/threejs/)
- [3D website templates & examples](https://aetumi.app/3d-websites/)

Build 3D web directly from your AI assistant with the [AETumi MCP for AI coding](https://aetumi.app/mcp/) — `claude mcp add --transport http aetumi https://mcp.aetumi.app`
