import { expect, test } from '@playwright/test';

import { expectNoAxeViolations } from './helpers';

test('adjusts a nozzle dial and updates the wire severity signal', async ({
  page,
}) => {
  await page.goto('/topology');

  await page.getByRole('button', { name: /Latency Injector/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'API Gateway to Checkout' }).click();
  await expect(dialog).toBeHidden();

  const nozzleItem = page.getByRole('button', {
    name: /Latency Injector.*API Gateway to Checkout/,
  });
  await expect(nozzleItem).toBeVisible();
  await nozzleItem.click();

  const slider = page.getByRole('slider', { name: 'Strength' });
  await expect(slider).toBeVisible();
  await slider.fill('80');

  await expect(
    page.getByRole('img', {
      name: 'Latency Injector nozzle, critical severity',
    }),
  ).toBeVisible();
  await expect(nozzleItem).toContainText('Critical');

  await expectNoAxeViolations(page);
});

test('operates the nozzle dial keyboard-only', async ({ page }) => {
  await page.goto('/topology');

  await page.getByRole('button', { name: /Latency Injector/ }).focus();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter'); // choose the first edge option

  const nozzleItem = page.getByRole('button', {
    name: /Latency Injector.*API Gateway to Checkout/,
  });
  await expect(nozzleItem).toBeVisible();
  await nozzleItem.focus();
  await page.keyboard.press('Enter');

  const slider = page.getByRole('slider', { name: 'Strength' });
  await slider.focus();
  await expect(slider).toBeFocused();

  await page.keyboard.press('ArrowUp');
  await expect(slider).toHaveValue('1');

  await page.keyboard.press('End');
  await expect(slider).toHaveValue('100');

  await expect(
    page.getByRole('img', {
      name: 'Latency Injector nozzle, critical severity',
    }),
  ).toBeVisible();
});
