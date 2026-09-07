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