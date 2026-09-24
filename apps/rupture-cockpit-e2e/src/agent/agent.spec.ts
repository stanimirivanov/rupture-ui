import { expect, test } from '@playwright/test';

import { expectNoAxeViolations } from '../helpers';

test('renders the agent hypothesis feed', async ({ page }) => {
  await page.goto('/agent');

  await expect(
    page.getByRole('heading', { level: 1, name: 'Proposed experiments' }),
  ).toBeVisible();

  await expect(
    page.getByRole('heading', {
      level: 2,
      name: 'Latency Injector on API Gateway to Checkout',
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', {
      level: 2,
      name: 'Packet Dropper on API Gateway to Inventory',
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', {
      level: 2,
      name: 'CPU Thrasher on Checkout to Payments',
    }),
  ).toBeVisible();

  await expectNoAxeViolations(page);
});

test('announces confidence as a bounded meter', async ({ page }) => {
  await page.goto('/agent');

  const meter = page.getByRole('meter', {
    name: 'Confidence 72 percent',
  });
  await expect(meter).toBeVisible();
  await expect(meter).toHaveAttribute('aria-valuenow', '72');
  await expect(meter).toHaveAttribute('aria-valuemin', '0');
  await expect(meter).toHaveAttribute('aria-valuemax', '100');
});

test('exposes reasoning steps and blast radius per hypothesis', async ({
  page,
}) => {
  await page.goto('/agent');

  const firstCard = page.getByRole('article', {
    name: /Latency Injector on API Gateway to Checkout/,
  });

  await expect(
    firstCard.getByRole('list', { name: /reasoning/i }),
  ).toBeVisible();
  await expect(firstCard.getByText(/checkout service tripled/)).toBeVisible();

  await expect(
    firstCard.getByRole('list', { name: /blast radius/i }),
  ).toBeVisible();
  await expect(firstCard.getByText('service: checkout')).toBeVisible();
  await expect(firstCard.getByText('connection: gw-checkout')).toBeVisible();
});

test('navigates to the agent feed from the header', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Agent' }).click();
  await expect(page).toHaveURL(/\/agent$/);
});
