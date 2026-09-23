# Rupture Cockpit

## TL;DR

This application is Rupture's operator console for chaos engineering and
resilience verification. It currently delivers the accessible shell only.
Topology, telemetry, and experiment control are deliberate follow-up slices
tracked by milestone.

## Commands

From the repository root:

```powershell
pnpm nx dev @rupture/cockpit
pnpm nx test @rupture/cockpit
pnpm nx build @rupture/cockpit
pnpm nx e2e @rupture/cockpit-e2e
```

## Boundaries

- Compose routes and application providers here.
- Keep reusable DOM primitives in `@rupture/ui-web`.
- Keep WebSocket and RPC execution outside presentational components.
- Do not consume `/internal/v1` as a production browser contract.
- Do not create observer, replay, or settings placeholder routes; add route
  areas with their first usable slice.

The current shell has no runtime configuration and no backend connection.
