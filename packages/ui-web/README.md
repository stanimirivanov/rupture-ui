# @rupture/ui-web

## TL;DR

Web-only design-system source for Rupture: reviewed shadcn primitives, semantic
theme tokens, and DOM behavior. This package is intentionally not a React
Native design system and never presents Tailwind or shadcn components as
native abstractions.

## Boundaries

- Own checked-in, reviewed shadcn primitives and Tailwind styling.
- Own semantic tokens (canvas, surface, ink, accent, severity) — never scatter
  literal product colors in feature code.
- Own DOM-specific behavior (focus management, portals, dialogs).
- Never fetch data, know application routes, or import application/feature
  code.

## Conventions

- Primitives live in `components/`, shared helpers in `lib/`.
- Every primitive ships keyboard operation, visible focus, an accessible name,
  and reduced-motion-safe styling.
- Variants express stable meaning (e.g. severity, emphasis); do not fork a
  primitive for a one-off color.
