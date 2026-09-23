# Current UI implementation state

## TL;DR

The repository contains a verified cockpit shell and a web-only UI package. It
has no engine connection, no telemetry stream, no topology canvas, no atom
state, no Effect runtime, no agent UI, no animation, no observer app, and no
native app.

## Implemented

- pnpm workspace managed by Nx 23;
- Node 24 and React 19.3 version contract;
- Vite-built cockpit with React Router Data Mode;
- dark industrial Tailwind theme with severity tokens and a mono display face,
  plus one shadcn-compatible button primitive;
- accessible home and unknown-route recovery screens;
- strict TypeScript, ESLint project boundaries, Prettier, Vitest, and
  Playwright with an axe-core accessibility gate;
- GitHub verification workflow and contributor harness; and
- accepted cockpit/observer topology and effect-atom state-model decisions.

## Deliberate limits

- No backend endpoint or stream is consumed.
- No authentication or browser session exists.
- No production deployment configuration or ingress exists.
- No `/internal/v1` endpoint is treated as a supported browser contract.
- No observer, widget, or native placeholder has been created.
- effect-atom, Effect, React Hook Form, and Motion are deferred until their
  first behavior needs them.

The next UI slice is M02 - Topology canvas: render the mock system topology,
place fault-injection nozzles on wires, and verify the interaction with
keyboard-only Playwright coverage.
