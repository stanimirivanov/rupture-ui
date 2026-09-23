import { RegistryProvider } from '@effect-atom/atom-react';
import { fireEvent, render, screen } from '@testing-library/react';

import { viewModeAtom } from '../atoms/view-mode';
import { ViewModeToggle } from './view-mode-toggle';

function renderToggle() {
  return render(
    <RegistryProvider initialValues={[[viewModeAtom, '2d']]}>
      <ViewModeToggle />
    </RegistryProvider>,
  );
}

describe('ViewModeToggle', () => {
  it('renders a labelled toggle group with 2D pressed by default', () => {
    renderToggle();

    expect(screen.getByRole('group', { name: 'View mode' })).toBeTruthy();
    expect(
      screen.getByRole('button', { name: '2D' }).getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      screen.getByRole('button', { name: '3D' }).getAttribute('aria-pressed'),
    ).toBe('false');
  });

  it('switches the pressed state when 3D is clicked', () => {
    renderToggle();

    fireEvent.click(screen.getByRole('button', { name: '3D' }));

    expect(
      screen.getByRole('button', { name: '2D' }).getAttribute('aria-pressed'),
    ).toBe('false');
    expect(
      screen.getByRole('button', { name: '3D' }).getAttribute('aria-pressed'),
    ).toBe('true');
  });

  it('announces the current mode through a status region', () => {
    renderToggle();

    expect(screen.getByRole('status').textContent).toBe('2D view');

    fireEvent.click(screen.getByRole('button', { name: '3D' }));

    expect(screen.getByRole('status').textContent).toBe('3D view');
  });
});
