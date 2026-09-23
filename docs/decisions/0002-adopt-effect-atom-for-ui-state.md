# ADR 0002: Adopt effect-atom and Effect for UI state and async boundaries

- Status: Accepted
- Date: 2026-09-23
- Milestone: M01 - Verified foundation

## TL;DR

Use effect-atom for all granular and derived UI state and Effect for every
asynchronous boundary (WebSocket streams, RPC, decoding, timeout,
interruption, typed failure mapping). No Redux, RTK Query, or Zustand is
introduced by default.

## Context

Rupture's UI state is naturally fragmented and derived: a topology canvas with
hundreds of independently updating entities (nodes, wires, nozzles, packet
flows), many loosely related telemetry streams, dial/form state, and cockpit
mode derived from experiment lifecycle. Coarse store models would require
selector and diffing boilerplate to keep re-renders surgical, and a second
imperative async layer (thunks/sagas) to handle streams.

The chosen stack already standardizes on TypeScript Effect for typed errors,
retries, interruption, and testing (TestClock). The Effect ecosystem provides
effect-atom, an atomic state model with Effect as a first-class citizen:
Effect programs run inside atom read/write, resources clean up through Effect
scopes, and atom lifecycles wire to Effect interruption.

## Decision

- effect-atom owns granular UI state and derived state. Atoms live in
  feature-owned `atoms/` modules, split into primitive source atoms and
  read-only derived atoms.
- Cross-feature consumers may read other features' atoms but never write them;
  writes go through the owning feature's exported actions.
- Effect owns asynchronous boundary programs: WS/RPC execution, schema
  decoding of untrusted payloads, timeout, bounded replay-safe retry,
  cancellation, and tagged error translation.
- Experiment abort is a first-class path: it is never retried automatically
  and requires no more authority than starting the experiment.
- Server caches are not hand-rolled; one-shot reads use the RPC layer with
  explicit invalidation owned by the feature.
- Libraries enter only with the first slice that needs them (ADR 0001 rule).

## Consequences

Re-renders stay surgical by construction; derived state (cockpit mode,
severity-ranked surfaces) has no sync-logic bugs. Side effects become testable
with TestClock and protocol fakes, which the T=0→T=5s deterministic fault
scenarios rely on. The UI gets one conceptual model from wire byte to pixel.

effect-atom is younger than Zustand or Jotai, so its ecosystem integrations
must be evaluated per slice and the organization rules above are mandatory to
keep atoms traceable. Team onboarding requires Effect fluency; this is accepted
as a hiring/training cost.

## Alternatives considered

- **Zustand only:** simpler API, but coarse stores reintroduce selector
  boilerplate for canvas granularity and provide no typed async boundary.
- **Jotai + ad-hoc promises:** right state model, but async/error handling
  would be bolted on instead of typed, and testing would lose TestClock.
- **Redux Toolkit + RTK Query:** mature caching, but two models (store + query)
  for state that is mostly derived, plus saga-style stream handling elsewhere.
- **React state only:** fails re-render granularity and cross-route sharing for
  cockpit state.
