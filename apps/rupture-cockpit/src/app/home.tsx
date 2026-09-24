import { Button } from '@rupture/ui-web';

const principles = [
  {
    number: '01',
    title: 'Blast radius before impact',
    description:
      'Every experiment declares what it can touch before it starts. Scope is explicit, reviewable, and enforced — never implied.',
  },
  {
    number: '02',
    title: 'Kill-switch before convenience',
    description:
      'Aborting an experiment must always be faster and easier than starting one, from any surface, with no extra authority required.',
  },
  {
    number: '03',
    title: 'Change points before pass/fail',
    description:
      'A run is understood through statistical change points and propagation evidence, not a binary green badge on a coarse threshold.',
  },
] as const;

export function Home() {
  return (
    <main
      id="main-content"
      className="h-full overflow-y-auto [scrollbar-gutter:stable]"
    >
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.3fr_0.7fr] lg:px-10 lg:py-28">
        <div className="max-w-3xl">
          <p className="mb-6 flex items-center gap-3 text-sm font-bold tracking-[0.18em] text-accent-strong uppercase">
            <span className="h-px w-10 bg-highlight" aria-hidden="true" />
            Resilience operations
          </p>
          <h1 className="font-display text-5xl leading-[0.98] tracking-[-0.04em] text-ink sm:text-6xl lg:text-7xl">
            Inject chaos.
            <br />
            Prove resilience.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-ink-muted">
            Rupture gives engineers one live view of the system topology, the
            experiments breaking it, and the evidence that it survives — with an
            abort always one keystroke away.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button asChild>
              <a href="#foundation">Review the foundation</a>
            </Button>
            <p className="max-w-xs text-sm leading-6 text-ink-muted">
              Live topology and telemetry arrive with the first canvas slice.
            </p>
          </div>
        </div>

        <aside
          id="foundation"
          className="relative overflow-hidden rounded-[2rem] border border-border bg-surface-strong p-8 shadow-[0_30px_80px_rgb(0_0_0_/_40%)]"
          aria-labelledby="foundation-title"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-28 -top-28 size-44 rounded-full border-[28px] border-highlight/20"
          />
          <p className="text-xs font-bold tracking-[0.2em] text-accent-strong uppercase">
            Current capability
          </p>
          <h2 id="foundation-title" className="mt-4 font-display text-3xl">
            Cockpit shell ready
          </h2>
          <p className="mt-4 leading-7 text-ink-muted">
            The UI now has a versioned Nx workspace, a web-only design-system
            boundary, deterministic verification, and a theme built for
            high-contrast telemetry from day one.
          </p>
          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-6">
            <div>
              <dt className="text-xs tracking-wide text-ink-muted uppercase">
                Runtime
              </dt>
              <dd className="mt-1 text-lg font-semibold">React 19.3</dd>
            </div>
            <div>
              <dt className="text-xs tracking-wide text-ink-muted uppercase">
                Workspace
              </dt>
              <dd className="mt-1 text-lg font-semibold">Nx + pnpm</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="border-y border-border/80 bg-surface/65">
        <div className="mx-auto grid max-w-7xl divide-y divide-border px-6 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-10">
          {principles.map((principle) => (
            <article
              className="py-10 md:px-8 md:first:pl-0 md:last:pr-0"
              key={principle.number}
            >
              <p className="font-display text-2xl text-highlight">
                {principle.number}
              </p>
              <h2 className="mt-5 text-lg font-bold">{principle.title}</h2>
              <p className="mt-3 text-sm leading-6 text-ink-muted">
                {principle.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
