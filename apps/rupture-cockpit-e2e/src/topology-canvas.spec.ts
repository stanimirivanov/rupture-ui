import { expect, test } from '@playwright/test';

import { expectNoAxeViolations } from './helpers';

test('renders the topology canvas', async ({ page }) => {
  await page.goto('/topology');

  await expect(
    page.getByRole('heading', { level: 1, name: 'System topology' }),
  ).toBeVisible();
  await expect(page.getByText('API Gateway')).toBeVisible();
  await expect(page.getByText('Checkout')).toBeVisible();

  await expectNoAxeViolations(page);
});

test('opens and closes the node details panel keyboard-only', async ({
  page,
}) => {
  await page.goto('/topology');

  const gateway = page.getByRole('button', { name: 'API Gateway' });
  await gateway.focus();
  await expect(gateway).toBeFocused();

  await page.keyboard.press('Enter');
  const panel = page.getByRole('complementary', {
    name: 'API Gateway details',
  });
  await expect(panel).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(gateway).toBeFocused();
});

test('moves focus between topology nodes with arrow keys', async ({ page }) => {
  await page.goto('/topology');

  const gateway = page.getByRole('button', { name: 'API Gateway' });
  await gateway.focus();
  await expect(gateway).toBeFocused();

  await page.keyboard.press('ArrowRight');
  await expect(gateway).not.toBeFocused();

  const focusedLabel = await page.evaluate(
    () => document.activeElement?.getAttribute('aria-label') ?? null,
  );
  expect(focusedLabel).not.toBeNull();
  expect(focusedLabel).not.toBe('API Gateway');
});

test('supports Home and End jump keys', async ({ page }) => {
  await page.goto('/topology');

  const gateway = page.getByRole('button', { name: 'API Gateway' });
  await gateway.focus();

  await page.keyboard.press('End');
  await expect(gateway).not.toBeFocused();

  await page.keyboard.press('Home');
  await expect(gateway).toBeFocused();

  await expectNoAxeViolations(page);
});
