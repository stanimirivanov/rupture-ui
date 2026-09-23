import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';

import { cockpitRoutes } from './router';

function renderRoute(path = '/') {
  const router = createMemoryRouter(cockpitRoutes, {
    initialEntries: [path],
  });

  return render(<RouterProvider router={router} />);
}

describe('App', () => {
  it('introduces the chaos cockpit purpose', () => {
    renderRoute();

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /inject chaos\.\s*prove resilience\./i,
      }),
    ).toBeTruthy();
    expect(screen.getByText('Cockpit shell ready')).toBeTruthy();
  });

  it('renders a recovery path for unknown routes', () => {
    renderRoute('/missing');

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'This cockpit view does not exist.',
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole('link', { name: 'Return to the cockpit' }),
    ).toBeTruthy();
  });
});
