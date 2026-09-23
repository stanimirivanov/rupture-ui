import { expect, test } from '@playwright/test';

import { expectNoAxeViolations } from './helpers';

test('presents the cockpit shell foundation', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Rupture Cockpit');
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /Inject chaos\.\s*Prove resilience\./i,
    }),
  ).toBeVisible();
  await expect(page.getByText('Cockpit shell ready')).toBeVisible();

  await expectNoAxeViolations(page);
});

test('offers a recovery path for an unknown route', async ({ page }) => {
  await page.goto('/missing');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'This cockpit view does not exist.',
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Return to the cockpit' }),
  ).toHaveAttribute('href', '/');
});

test('navigates to the topology from the header', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Topology' }).click();
  await expect(page).toHaveURL(/\/topology$/);
});
