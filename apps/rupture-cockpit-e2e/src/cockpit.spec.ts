import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('presents the workbench foundation', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Rupture Cockpit');
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /Inject chaos\.\s*Prove resilience\./i,
    }),
  ).toBeVisible();
  await expect(page.getByText('Cockpit shell ready')).toBeVisible();

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
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

test('renders the topology canvas', async ({ page }) => {
  await page.goto('/topology');

  await expect(
    page.getByRole('heading', { level: 1, name: 'System topology' }),
  ).toBeVisible();
  await expect(page.getByText('API Gateway')).toBeVisible();
  await expect(page.getByText('Checkout')).toBeVisible();

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});

test('navigates to the topology from the header', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Topology' }).click();
  await expect(page).toHaveURL(/\/topology$/);
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
  await expect(panel).not.toBeVisible();
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

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});

test('places a nozzle on an edge through the palette picker', async ({
  page,
}) => {
  await page.goto('/topology');

  await page.getByRole('button', { name: /Latency Injector/ }).click();

  const dialog = page.getByRole('dialog', {
    name: 'Place Latency Injector nozzle',
  });
  await expect(dialog).toBeVisible();

  await dialog.getByRole('button', { name: 'API Gateway to Checkout' }).click();

  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole('img', { name: 'Latency Injector nozzle' }),
  ).toBeVisible();
});

test('places a nozzle keyboard-only', async ({ page }) => {
  await page.goto('/topology');

  const latency = page.getByRole('button', { name: /Latency Injector/ });
  await latency.focus();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  // Focus lands on the first edge option; Enter places the nozzle there.
  await page.keyboard.press('Enter');

  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole('img', { name: 'Latency Injector nozzle' }),
  ).toBeVisible();
});

test('cancels the picker with Escape without placing a nozzle', async ({
  page,
}) => {
  await page.goto('/topology');

  await page.getByRole('button', { name: /Latency Injector/ }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole('img', { name: 'Latency Injector nozzle' }),
  ).not.toBeVisible();

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations).toEqual([]);
});
