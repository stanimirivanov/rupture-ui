import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';

import { CockpitLayout } from './layout';

function renderAt(path: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        Component: CockpitLayout,
        children: [
          { index: true, element: <div>home</div> },
          { path: 'agent', element: <div>agent</div> },
          { path: 'agent/details', element: <div>agent details</div> },
          { path: 'topology', element: <div>topology</div> },
        ],
      },
    ],
    { initialEntries: [path] },
  );
  return render(<RouterProvider router={router} />);
}

describe('CockpitLayout primary navigation', () => {
  it('marks the Agent link active on /agent', () => {
    renderAt('/agent');

    expect(
      screen.getByRole('link', { name: 'Agent' }).getAttribute('aria-current'),
    ).toBe('page');
    expect(
      screen
        .getByRole('link', { name: 'Topology' })
        .getAttribute('aria-current'),
    ).toBeNull();
  });

  it('marks the Topology link active on /topology', () => {
    renderAt('/topology');

    expect(
      screen
        .getByRole('link', { name: 'Topology' })
        .getAttribute('aria-current'),
    ).toBe('page');
    expect(
      screen.getByRole('link', { name: 'Agent' }).getAttribute('aria-current'),
    ).toBeNull();
  });

  it('marks neither link active on the home route', () => {
    renderAt('/');

    expect(
      screen.getByRole('link', { name: 'Agent' }).getAttribute('aria-current'),
    ).toBeNull();
    expect(
      screen
        .getByRole('link', { name: 'Topology' })
        .getAttribute('aria-current'),
    ).toBeNull();
  });

  it('keeps Agent active on a nested route (documents NavLink prefix matching)', () => {
    // react-router's NavLink matches by prefix unless `end` is set. This
    // test locks in the intentional behaviour: a nested route under
    // /agent keeps the Agent link marked current.
    renderAt('/agent/details');

    expect(
      screen.getByRole('link', { name: 'Agent' }).getAttribute('aria-current'),
    ).toBe('page');
  });
});
