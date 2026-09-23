# ADR 0003: Adopt React Flow and React Three Fiber for the topology canvas

- Status: Accepted
- Date: 2026-09-23
- Milestone: M02 - Topology canvas

## TL;DR

Use React Flow for the 2D editable topology canvas and React Three Fiber for
a read-only 3D mirror of the same graph model. dagre provides deterministic
auto-layout inside a derived atom. The 2D graph is the editor; the 3D view
never accepts edits. Keyboard traversal, accessible names, and
reduced-motion behavior are owned by `features/canvas` and `features/a11y`,
not delegated to the libraries.

## Context

M02 renders the discovered system topology as services (nodes) and
connections (wires), places fault-injection nozzles on wires, and adjusts
nozzle dials. Later milestones add a 3D flythrough and evidence overlays.
The canvas is the spine the proposal's Phase 1 and every subsequent phase
hang on.

The candidate technology has to satisfy five requirements at once: (1)
palette-to-wire placement of nozzles; (2) deterministic auto-layout that can
be snapshot-tested without a browser; (3) keyboard-only operation with
authored ARIA semantics; (4) a 3D view that reads the same graph model
without duplicating state; and (5) reduced-motion-safe edge animation.

No mature graph library provides WCAG 2.2 AA keyboard traversal out of the
box. Existing libraries implement pointer interaction and leave the
accessibility layer to the consumer. This is a fact of the ecosystem, not a
reason to avoid the ecosystem — but it does mean the a11y budget is a
first-class schedule item, not a polish task.

The canvas is also the heaviest dependency the workspace will take. It
cannot introduce a second state model beside effect-atom without breaking
ADR 0002.

## Decision

- Use React Flow for the 2D canvas. Drag, selection, zoom, edge routing, and
  palette drops are already solved; the nozzle palette targets React Flow's
  own `onDrop`/`onConnect` surface instead of a parallel hit-testing layer.
- Use dagre for auto-layout inside the derived `laidOutNodesAtom`. The
  layout must be deterministic for a given fixture so it can be snapshot-
  tested without a browser. elkjs remains a possible replacement inside
  that one atom if dagre's layout quality is insufficient; the choice is
  internal to the module.
- Use React Three Fiber for the 3D mirror. It reads the same laid-out atoms
  as the 2D view. There is no second graph model and no second layout pass.
- The 2D graph is the editor. The 3D view is read-only. Selection is shared
  in both directions so toggling preserves context; editing is not.
- Keyboard traversal, ARIA node roles, visible focus, screen-reader
  descriptions, and reduced-motion suppression are owned by `features/canvas`
  and `features/a11y`. React Flow is a renderer and an input surface only.
- Edge severity carries at least one non-color, non-motion signal (stroke
  style, icon, or accessible description) in addition to color and
  animation. This is required by `AGENTS.md` § React and TypeScript and by
  `docs/architecture.md` § Presentation.
- All graph model mutations flow through effect-atom source atoms per ADR
  0002. React Flow is mounted with controlled props driven from atoms,
        never with its internal store as a source of truth.

## Consequences

The 2D and 3D views share one authoritative layout, so they cannot drift.
The palette and drop interactions reuse React Flow's own surface rather than
a parallel system, removing a common class of pointer bugs.

React Flow's accessibility surface is thin. Arrow-key traversal, focus
management, and screen-reader labels are ours to author and test, and the
a11y budget in the proposal's § 6 applies directly. React Flow and React
Three Fiber add non-trivial JS and type weight; M02 sets the first
performance budget the workspace will measure. React Flow's internal state
and effect-atom's atom state must not duplicate each other.

Bundle cost, a11y authorship, and 3D scene complexity are accepted as the
price of not writing a canvas or WebGL renderer by hand. If the 3D mirror's
scope balloons during M02, it may be deferred to its own milestone without
affecting the 2D editor.

## Alternatives considered

- **Custom SVG canvas:** full control over semantics and bundle, but drag,
  selection, zoom, edge routing, and minimap all become our problem. The
  proposal's Phase 1 budget is one milestone, not three.
- **Cytoscape.js:** strong graph analysis features, weaker React integration
  and a less ergonomic editing surface for palette-driven nozzles.
- **Sigma.js:** WebGL-based and fast for large graphs, but graph editing and
  node customization are not its focus; it is a visualization library, not
  an editor.
- **No 2D editor (form-only fault injection):** drops the proposal's
  differentiator #2 and Phase 1's stated deliverable.
- **React Flow alone (no R3F):** drops the spatial-interface trend (#8) and
  Phase 1's 3D toggle. Deferrable, but the deferral should be explicit, not
  implicit.
