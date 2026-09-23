import { expect, test } from '@playwright/test';

import { expectNoAxeViolations } from './helpers';

test('switches between 2D and 3D views', async ({ page }) => {
  await page.goto('/topology');

  await expect(page.getByRole('button', { name: 'API Gateway' })).toBeVisible();
  await expect(page.getByRole('button', { name: '2D' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  await page.getByRole('button', { name: '3D' }).click();

  await expect(page.getByRole('button', { name: '3D' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByRole('button', { name: '2D' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  await expect(page.getByRole('button', { name: 'API Gateway' })).toBeHidden();

  await page.getByRole('button', { name: '2D' }).click();
  await expect(page.getByRole('button', { name: 'API Gateway' })).toBeVisible();
});

test('preserves the focused node across a view toggle', async ({ page }) => {
  await page.goto('/topology');

  const gateway = page.getByRole('button', { name: 'API Gateway' });
  await gateway.focus();
  await expect(gateway).toBeFocused();

  await page.getByRole('button', { name: '3D' }).click();
  await expect(page.getByRole('button', { name: 'API Gateway' })).toBeHidden();

  await page.getByRole('button', { name: '2D' }).click();
  await expect(page.getByRole('button', { name: 'API Gateway' })).toBeFocused();
});

test('announces the view mode through a status region', async ({ page }) => {
  await page.goto('/topology');

  await expect(page.getByRole('status')).toHaveText('2D view');

  await page.getByRole('button', { name: '3D' }).click();

  await expect(page.getByRole('status')).toHaveText('3D view');
});

test('3D view has no axe violations', async ({ page }) => {
  await page.goto('/topology');

  await page.getByRole('button', { name: '3D' }).click();
  await expect(page.getByRole('button', { name: '3D' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  await expectNoAxeViolations(page);
});

test('preserves placed nozzles and dial values across a view toggle', async ({
  page,
}) => {
  await page.goto('/topology');

  await page.getByRole('button', { name: /Latency Injector/ }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'API Gateway to Checkout' })
    .click();

  const item = page.getByRole('button', {
    name: /Latency Injector.*API Gateway to Checkout/,
  });
  await item.click();
  const slider = page.getByRole('slider', { name: 'Strength' });
  await slider.fill('80');
  await expect(
    page.getByRole('img', {
      name: 'Latency Injector nozzle, critical severity',
    }),
  ).toBeVisible();

  await page.getByRole('button', { name: '3D' }).click();
  await page.getByRole('button', { name: '2D' }).click();

  await expect(
    page.getByRole('img', {
      name: 'Latency Injector nozzle, critical severity',
    }),
  ).toBeVisible();
  await expect(item).toContainText('Critical');
});
