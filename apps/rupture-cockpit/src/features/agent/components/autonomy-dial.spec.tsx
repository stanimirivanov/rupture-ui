import { RegistryProvider } from '@effect-atom/atom-react';
import { fireEvent, render, screen } from '@testing-library/react';

import { autonomyModeAtom } from '../atoms/autonomy';
import { AutonomyDial } from './autonomy-dial';

function renderDial() {
  return render(
    <RegistryProvider initialValues={[[autonomyModeAtom, 'approve']]}>
      <AutonomyDial />
    </RegistryProvider>,
  );
}

describe('AutonomyDial', () => {
  it('renders a fieldset with a legend and three radio options', () => {
    renderDial();

    expect(screen.getByRole('group', { name: 'Autonomy' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: /Suggest/ })).toBeTruthy();
    expect(screen.getByRole('radio', { name: /Approve/ })).toBeTruthy();
    expect(screen.getByRole('radio', { name: /Auto/ })).toBeTruthy();
  });

  it('selects Approve by default', () => {
    renderDial();

    const approve = screen.getByRole('radio', {
      name: /Approve/,
    }) as HTMLInputElement;
    expect(approve.checked).toBe(true);
  });

  it('switches selection when another radio is clicked', () => {
    renderDial();

    fireEvent.click(screen.getByRole('radio', { name: /Auto/ }));

    expect(
      (screen.getByRole('radio', { name: /Auto/ }) as HTMLInputElement).checked,
    ).toBe(true);
    expect(
      (screen.getByRole('radio', { name: /Approve/ }) as HTMLInputElement)
        .checked,
    ).toBe(false);
  });

  it('announces the current mode through a status region', () => {
    renderDial();

    expect(screen.getByRole('status').textContent).toBe(
      'Autonomy mode: Approve.',
    );

    fireEvent.click(screen.getByRole('radio', { name: /Suggest/ }));

    expect(screen.getByRole('status').textContent).toBe(
      'Autonomy mode: Suggest.',
    );
  });
});
