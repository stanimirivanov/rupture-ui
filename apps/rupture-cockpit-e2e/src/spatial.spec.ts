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
