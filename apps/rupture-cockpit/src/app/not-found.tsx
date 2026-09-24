import { Button } from '@rupture/ui-web';
import { Link } from 'react-router';

export function NotFound() {
  return (
    <main
      id="main-content"
      className="grid h-full place-items-center overflow-y-auto px-6 py-24 text-center"
    >
      <div>
        <p className="text-sm font-bold tracking-[0.18em] text-accent-strong uppercase">
          404 · Route not found
        </p>
        <h1 className="mt-4 font-display text-5xl tracking-tight">
          This cockpit view does not exist.
        </h1>
        <p className="mx-auto mt-5 max-w-lg leading-7 text-ink-muted">
          The requested location is not part of the current resolver experience.
        </p>
        <Button asChild className="mt-8">
          <Link to="/">Return to the cockpit</Link>
        </Button>
      </div>
    </main>
  );
}
