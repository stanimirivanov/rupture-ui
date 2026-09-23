# Current UI implementation state

## TL;DR

The repository contains a verified cockpit shell and a web-only UI package.
It has no engine connection, no telemetry stream, no topology canvas, no
atom state, no Effect runtime, no agent UI, no animation, no observer app,
and no native app.

## Implemented

- pnpm workspace managed by Nx 23;
- Node 24 and React 19.3 version contract;
- Vite-built cockpit with React Router Data Mode;
- dark industrial Tailwind theme with severity tokens and a mono display
  face, plus one shadcn-compatible button primitive;
- accessible home and unknown-route recovery screens;
- strict TypeScript, ESLint project boundaries, Prettier, Vitest, and
  Playwright with an axe-core accessibility gate;
- GitHub verification workflow and contributor harness;
- accepted cockpit/observer topology, effect-atom state-model, and
  canvas-technology decisions; and
- documentation aligned with the accepted architecture, naming, and
  milestone map.

## Deliberate limits

- No backend endpoint or stream is consumed.
- No authentication or browser session exists.
- No production deployment configuration or ingress exists.
- No `/internal/v1` endpoint is treated as a supported browser contract.
- No observer, widget, or native placeholder has been created.
- effect-atom, Effect, React Hook Form, Motion, React Flow, dagre, and
  React Three Fiber are deferred until their first behavior needs them.

## Milestone sequence

| Milestone | Outcome                                | Status   |
| :-------- | :------------------------------------- | :------- |
| M01       | Verified foundation                    | Complete |
| M02       | Topology canvas                        | Next     |
| M03       | Agentic proposals                      | Planned  |
| M04       | Live cockpit                           | Planned  |
| M05       | Replay and change points               | Planned  |
| M06       | Accessibility and visual identity pass | Planned  |
| M07       | Demo and engine-integration handoff    | Planned  |

Milestone outcomes are defined by the Rupture core repository. This table
maps the UI workspace's slices to those milestones; it does not define
product scope.

## Next slice: M02 - Topology canvas

M02 renders the mock system topology, places fault-injection nozzles on
wires, and verifies the interaction with keyboard-only Playwright coverage.

M02 is delivered as six independently reviewable sub-slices, in this order:

1. Read-only topology from fixtures, auto-laid-out.
2. Keyboard traversal of the canvas.
3. Nozzles as draggable palette items on edges.
4. Dial interaction that updates the wire's severity signal.
5. Packet-flow animation with a reduced-motion-safe non-color signal.
6. 3D mirror of the same graph model (may be split into its own milestone
   if M02's budget is exhausted).

Ordering rule: keyboard traversal lands before nozzle editing. The
accessibility budget is cheapest to pay on a read-only graph and most
expensive to retrofit once editing exists.

### Data strategy for M02

M02 consumes static fixtures in `features/canvas/fixtures/`, decoded through
Effect Schema in `features/canvas/schema/`. The decoded value is the input
to the canvas source atoms.

This defers the WebSocket and RPC boundary to M03, where the agentic
proposal stream is the first behavior that genuinely requires it. The
fixture Schema becomes the contract the future mock server and the eventual
real engine implement, so the swap at M07 does not touch UI code.

Static fixtures were chosen over a mock server for M02 because none of
M02's acceptance criteria — canvas rendering, keyboard traversal, nozzle
placement, dial interaction, animation, and the 3D mirror — require a live
stream. Introducing the wire now would add a runtime surface without a
behavior that needs it, against the rule in `AGENTS.md` that packages and
dependencies are created only when curren# Rupture UI trend map

## TL;DR

The Rupture cockpit commits to ten interface trends from the product brief.
Each trend is an acceptance criterion tied to a milestone, not a parallel
workstream. A milestone is not complete until every trend it owns is
demonstrably present and interactive, not decorative.

Product, backend, and milestone definitions remain authoritative in the
Rupture core repository. This document maps those trends to the UI slices in
this workspace.

## Trend-to-milestone map

| #   | Trend                           | UI capability                                              | Milestone |
| :-- | :------------------------------ | :--------------------------------------------------------- | :-------- |
| 1   | Generative and adaptive UI      | Cockpit mode restructures panels by severity               | M04       |
| 2   | Intent-driven and agentic UX    | Hypothesis feed, reasoning chain, autonomy dial            | M03       |
| 3   | Multimodal interfaces           | ⌘K palette, hotkeys, and voice through one CommandBus      | M04       |
| 4   | Graphical-first interaction     | React Flow canvas; nozzles dragged onto wires              | M02       |
| 5   | Accessibility-first             | WCAG 2.2 AA gate; keyboard-only Playwright suite           | M02, M06  |
| 6   | Purposeful motion               | Physics-based micro-interactions; reduced-motion token     | M02, M06  |
| 7   | Liquid glass visuals            | Glass drawers, kill-switch overlay, specular depth         | M04       |
| 8   | Spatial interfaces              | Read-only 3D mirror of the 2D graph                        | M02       |
| 9   | Data storytelling               | Change-point narrative, timeline scrubber, story beats     | M05       |
| 10  | Neo-brutalism / bold expressive | Industrial type, thick borders, high-contrast badge system | M06       |

## Structural and transient layers

The visual thesis is that neo-brutalism (trend 10) is the structural layer —
typography, borders, data density — and liquid glass (trend 7) is the
transient layer — drawers, dialogs, the kill-switch overlay. They coexist by
discipline, not by accident.

Two rules keep the layers honest:

- A glass surface never carries persistent data. Data that matters survives
  a reload of the brutalist base.
- A brutalist surface never obscures a state transition. If a transition
  needs depth to read, it moves to the transient layer.

## Acceptance criteria per trend

Trends are acceptance criteria. The list below is the test that a trend has
landed, not a description of the intent.

### 1. Generative and adaptive UI (M04)

- Cockpit mode is a derived atom, not stored state.
- Panel order is priority-scored by severity and experiment phase.
- A layout snapshot test asserts panel order across at least three phase
  transitions.

### 2. Intent-driven and agentic UX (M03)

- Every agent proposal exposes a step-by-step reasoning chain, a confidence
  score, and a blast-radius preview before any action is offered.
- The autonomy dial has three modes; the highest mode still honors a review
  gate on the first action of a session.
- Approve, edit, and intercept are reachable keyboard-only.

### 3. Multimodal interfaces (M04)

- ⌘K, hotkeys, and voice normalize into one `Intent` schema.
- The kill-switch intent from any of the three inputs reaches the same typed
  abort path. Abort is never automatically retried.
- Voice is a parser into that schema, not a separate command path.

### 4. Graphical-first interaction (M02)

- Nozzles are placed on wires by drag-and-drop from a palette.
- The same placement is achievable keyboard-only.
- Nozzle count and edge assignment are derivable from source atoms alone,
  never from canvas-internal state.

### 5. Accessibility-first (M02, M06)

- `pnpm verify` includes an axe-core Playwright scan on every rendered route.
- A keyboard-only Playwright suite is a release gate, not an optional check.
- Every graph node has an accessible name and a non-color state signal.

### 6. Purposeful motion (M02, M06)

- Motion is reserved for state transitions that clarify change.
- `prefers-reduced-motion: reduce` is a design token, not a media query
  scattered through components.
- No animation blocks input or delays the perception of a completed action.

### 7. Liquid glass visuals (M04)

- Glass tokens are defined once in `@rupture/ui-web` and are not re-derived
  per feature.
- A glass surface never carries data that cannot be re-read at a brutalist
  surface.
- Contrast is verified against the blurred backdrop, not the flat token
  value.

### 8. Spatial interfaces (M02)

- The 3D view reads the same laid-out graph model as the 2D view.
- The 3D view is never an editor.
- Toggling view modes preserves selection and does not reset camera or focus
  unexpectedly.

### 9. Data storytelling (M05)

- The timeline scrubber syncs charts, traces, and canvas state from one
  source.
- The change-point algorithm is tested against a frozen T=0→5s cascade
  fixture without a browser.
- Story beats are derived from the run, not hand-authored per demonstration.

### 10. Neo-brutalism / bold expressive (M06)

- Industrial display type is a token, not a per-component font choice.
- Severity is never conveyed by color alone.
- Border weight and data density are theme tokens; features do not
  hard-code them.

## Success definition

The proposal's § 7 success criteria are the acceptance test for this trend
map as a whole:

- All ten trends are demonstrably present and interactive.
- The full experiment lifecycle completes keyboard-only and is
  screen-reader-navigable.
- The T=0→5s cascade is replayable second-by-second with change-point story
  beats.
- The canvas holds 60fps under 10 Hz telemetry load.
- The fake server swaps for the real chaos engine with zero UI changes.t behavior uses them.
