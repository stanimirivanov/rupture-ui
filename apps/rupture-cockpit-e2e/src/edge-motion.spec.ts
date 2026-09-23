import { expect, test } from '@playwright/test';

import { expectNoAxeViolations } from './helpers';

test('animates edge flow only after a nozzle is placed', async ({ page }) => {
  await page.goto('/topology');

  const untouchedEdge = page
    .locator('[data-id="checkout-payments"] .react-flow__edge-path')
    .first();
  await expect(untouchedEdge).toBeVisible();
  expect(
    await untouchedEdge.evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');

  await page.getByRole('button', { name: /Latency Injector/ }).click();
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Checkout to Payments' })
    .click();

  const animatedEdge = page
    .locator('[data-id="checkout-payments"] .react-flow__edge-path')
    .first();
  expect(
    await animatedEdge.evaluate((el) => getComputedStyle(el).animationName),
  ).not.toBe('none');
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('suppresses edge flow but keeps the severity signal', async ({
    page,
  }) => {
    await page.goto('/topology');

    await page.getByRole('button', { name: /Latency Injector/ }).click();
    await page
      .getByRole('dialog')
      .getByRole('button', { name: 'API Gateway to Checkout' })
      .click();

    // The marker still names the severity, so the non-motion signal survives.
    await expect(
      page.getByRole('img', {
        name: 'Latency Injector nozzle, ok severity',
      }),
    ).toBeVisible();

    // But the path itself has no animation.
    const edgePath = page
      .locator('[data-id="gw-checkout"] .react-flow__edge-path')
      .first();
    expect(
      await edgePath.evaluate((el) => getComputedStyle(el).animationName),
    ).toBe('none');

    await expectNoAxeViolations(page);
  });
});
