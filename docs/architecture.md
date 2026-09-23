# Rupture UI architecture

## TL;DR

Use one Nx and pnpm repository for independently deployable user experiences.
Begin with the operator cockpit. Add the external observer application only
with its first usable slice. Share contracts deliberately while keeping web
UI, native UI, application state, and authentication adapters
platform-specific.

## Application topology

| Deployable         | Audience and responsibility                                           | Status                           |
| :----------------- | :-------------------------------------------------------------------- | :------------------------------- |
| `rupture-cockpit`  | Authenticated chaos operator console; later replay and settings areas | Implemented shell                |
| `rupture-observer` | Read-only resilience status surface                                   | Deferred to first observer slice |
| widget SDK         | Embeddable read-only status widgets                                   | Deferred                         |
| native clients     | Selected operator workflows                                           | Deferred until required          |

The cockpit and observer experiences use distinct deployment artifacts,
identity clients, CSPs, URLs, performance budgets, and release decisions.
Replay and scenario builder begin as cockpit route areas because they share
the internal trust boundary; split them only for demonstrated isolation or
ownership needs.

## Dependency direction

```text
applications
  -&gt; feature behavior
      -&gt; data access
          -&gt; API contracts
  -&gt; web UI

platform:shared  -X-&gt; platform:web
platform:shared  -X-&gt; platform:native
web UI           -X-&gt; applications or data access
```

Nx project tags enforce the first available boundaries. New package categories
are added when a real slice creates them. `@rupture/ui-web` is intentionally a
DOM, Tailwind, and shadcn boundary; it is not a React Native design system.

## State ownership

| State                                                                                    | Owner            |
| :--------------------------------------------------------------------------------------- | :--------------- |
| Granular and derived UI state (topology, nozzles, telemetry views, cockpit mode)         | effect-atom      |
| WebSocket streams, RPC execution, decoding, timeout, interruption, typed failure mapping | Effect           |
| Shareable filter, selection, and navigation state                                        | React Router URL |
| Form values, field errors, touched state                                                 | React Hook Form  |
| Component-local interaction                                                              | React state      |

These libraries are introduced by the first behavior that needs them (see ADR
0002). Effect executes inside atom write handlers and a thin stream/RPC
adapter; it does not create a second UI-state model. Interruption of Effect
programs must follow UI cancellation (closing a panel cancels its
subscription).

## Routing and rendering

The browser applications are Vite-built React SPAs using React Router Data
Mode. Route definitions own hierarchy, lazy boundaries, parameters, and error
pages. Atoms and route loaders must not create duplicate caches for the same
stream resource.

The static artifact reads only public runtime configuration. Secrets never
enter JavaScript bundles. Production ingress should expose a same-origin API
path so cross-origin policy is deliberate rather than an accidental Vite
development setting.

## API and trust boundary

OpenAPI and RFC 9457 problem responses are wire contracts for RPC; stream
schemas govern WebSocket payloads. Static TypeScript types do not validate
remote data; each consumed payload must be decoded before entering atom state.
Tagged UI errors distinguish authentication, authorization, absence, conflict,
invalid input, timeout, stream failure, invalid message, and unexpected
defects.

A workspace or team selected in the URL is navigation context only. The
backend remains authoritative for operator identity, target authorization,
blast-radius enforcement, and non-disclosure. The production UI does not
consume `/internal/v1` routes; a slice must first establish a reviewed
browser-facing endpoint.

## Presentation

Tailwind owns utility generation and semantic theme tokens, including the
severity scale (ok, warning, critical). shadcn source is checked-in and
reviewed in `@rupture/ui-web`. Feature components remain near their behavior.
Motion is reserved for transitions that clarify state change — experiment
phase changes, fault propagation — and must honor reduced-motion preferences;
CSS handles simple visual feedback. The industrial theme pairs stark mono
typography for metrics with restrained depth overlays; severity is never
conveyed by color alone.

All slices preserve semantic landmarks, keyboard operation, visible focus,
accessible names, heading order, contrast, zoom, and responsive reflow. Color,
position, and animation are never the only state signal.
