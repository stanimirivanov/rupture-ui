# Rupture UI

## TL;DR

Rupture UI is the browser workspace for Rupture's autonomous chaos and
resilience platform. The repository currently contains the operator cockpit
shell and a web-only UI package. The observer application, WebSocket telemetry,
agentic hypothesis UI, and animation enter only with a slice that uses them.

## Current status

The first foundation provides:

- React 19.3 in an Nx and pnpm workspace;
- one Vite-built `rupture-cockpit` application using React Router Data Mode;
- a dark industrial Tailwind theme with severity tokens and a mono display
  face in `@rupture/ui-web`;
- Vitest component tests and a Chromium Playwright smoke path with an
  axe-core accessibility gate;
- enforced project tags and accepted foundation and state-model decisions; and
- a contributor, security, issue, pull-request, and CI harness.

No backend API or telemetry stream is connected yet. The next slice delivers
the interactive topology canvas from mock data. See
[current state](docs/development/current-state.md).

## Prerequisites

- Node.js 24 LTS
- Corepack

Install and verify:

```powershell
corepack enable
pnpm install --frozen-lockfile
pnpm format
pnpm verify
```

Run the cockpit locally:

```powershell
pnpm dev
```

Nx serves it at http://localhost:4200 by default.

## Repository shape

```text
apps/
  rupture-cockpit/       Internal chaos engineering console
  rupture-cockpit-e2e/   Browser verification
packages/
  ui-web/                DOM and Tailwind-specific UI source
docs/
  decisions/             Durable UI architecture decisions
  development/           Engineering rules and current state
```

The eventual read-only status experience will be a separate
`apps/rupture-observer` deployable. It will be created with its first usable
slice, not as an empty placeholder. Platform-neutral packages and React Native
applications follow the same rule. Rupture's engine, wire contracts, and
milestone definitions remain authoritative in the backend repository.

## Working agreement

Read [AGENTS.md](AGENTS.md), [CONTRIBUTING.md](CONTRIBUTING.md), and the
[engineering standards](docs/development/engineering-standards.md) before
changing the workspace. Each change delivers one reviewable capability and is
assigned to the existing Rupture milestone that owns that behavior.

## License

Apache License 2.0. See [LICENSE](LICENSE).
