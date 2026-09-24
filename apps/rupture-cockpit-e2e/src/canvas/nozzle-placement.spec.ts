import { expect, test } from '@playwright/test';

import { expectNoAxeViolations } from '../helpers';

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

  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole('img', { name: /Latency Injector nozzle/ }),
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

  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole('img', { name: /Latency Injector nozzle/ }),
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

  await expect(dialog).toBeHidden();
  await expect(
    page.getByRole('img', { name: /Latency Injector nozzle/ }),
  ).toBeHidden();

  await expectNoAxeViolations(page);
});
