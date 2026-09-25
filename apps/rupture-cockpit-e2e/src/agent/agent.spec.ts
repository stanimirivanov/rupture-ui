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

test('highlights the selected hypothesis blast radius on the topology', async ({
  page,
}) => {
  await page.goto('/agent');

  const firstCard = page.getByRole('article', {
    name: /Latency Injector on API Gateway to Checkout/,
  });
  await firstCard.getByRole('link', { name: 'Show on topology' }).click();

  await expect(page).toHaveURL(/\/topology$/);

  const banner = page.getByRole('region', {
    name: /Blast radius preview/,
  });
  await expect(banner).toBeVisible();
  await expect(banner).toContainText('Latency Injector');

  // The blast radius for the first fixture hypothesis includes checkout,
  // payments, gw-checkout, and checkout-payments.
  await expect(
    page.locator('[data-service-node="checkout"][data-in-blast-radius="true"]'),
  ).toBeVisible();
  await expect(
    page.locator('[data-service-node="payments"][data-in-blast-radius="true"]'),
  ).toBeVisible();
  await expect(
    page.locator('[data-service-node="gateway"][data-in-blast-radius="true"]'),
  ).toHaveCount(0);

  // The aria-label carries the non-color signal for screen readers.
  await expect(
    page.getByRole('button', { name: 'Checkout, in blast radius' }),
  ).toBeVisible();

  await expectNoAxeViolations(page);
});

test('clears the blast radius highlight', async ({ page }) => {
  await page.goto('/agent');
  await page
    .getByRole('article', {
      name: /Latency Injector on API Gateway to Checkout/,
    })
    .getByRole('link', { name: 'Show on topology' })
    .click();
  await expect(page).toHaveURL(/\/topology$/);

  await page.getByRole('button', { name: 'Clear' }).click();

  await expect(
    page.getByRole('region', { name: /Blast radius preview/ }),
  ).toHaveCount(0);
  await expect(
    page.locator('[data-service-node="checkout"][data-in-blast-radius="true"]'),
  ).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();
});

test('keeps the blast radius banner accessible at narrow width', async ({
  page,
}) => {
  await page.goto('/agent');
  await page.setViewportSize({ width: 375, height: 812 });
  await page
    .getByRole('article', {
      name: /Latency Injector on API Gateway to Checkout/,
    })
    .getByRole('link', { name: 'Show on topology' })
    .click();
  await expect(page).toHaveURL(/\/topology$/);

  await expect(
    page.getByRole('region', { name: /Blast radius preview/ }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Clear' })).toBeVisible();

  await expectNoAxeViolations(page);
});

test('defaults autonomy to Approve and never to Auto', async ({ page }) => {
  await page.goto('/agent');

  const approve = page.getByRole('radio', { name: /Approve/ });
  const auto = page.getByRole('radio', { name: /Auto/ });
  const suggest = page.getByRole('radio', { name: /Suggest/ });

  await expect(approve).toBeChecked();
  await expect(auto).not.toBeChecked();
  await expect(suggest).not.toBeChecked();
});

test('switches autonomy mode and announces the change', async ({ page }) => {
  await page.goto('/agent');

  await page.getByRole('radio', { name: /Auto/ }).check();

  await expect(page.getByRole('radio', { name: /Auto/ })).toBeChecked();
  await expect(page.getByRole('status')).toHaveText('Autonomy mode: Auto.');
});

test('does not persist autonomy mode across a reload', async ({ page }) => {
  await page.goto('/agent');

  await page.getByRole('radio', { name: /Auto/ }).check();
  await expect(page.getByRole('radio', { name: /Auto/ })).toBeChecked();

  await page.reload();

  await expect(page.getByRole('radio', { name: /Approve/ })).toBeChecked();
  await expect(page.getByRole('radio', { name: /Auto/ })).not.toBeChecked();
});

test('is operable keyboard-only', async ({ page }) => {
  await page.goto('/agent');

  const approve = page.getByRole('radio', { name: /Approve/ });
  await approve.focus();
  await expect(approve).toBeFocused();

  await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio', { name: /Auto/ })).toBeChecked();

  await page.keyboard.press('ArrowUp');
  await expect(page.getByRole('radio', { name: /Approve/ })).toBeChecked();

  await expectNoAxeViolations(page);
});

test('approves a proposal and refetches the feed', async ({ page }) => {
  await page.goto('/agent');

  await page.getByRole('radio', { name: /Approve/ }).check();

  const firstCard = page.getByRole('article', {
    name: /Latency Injector on API Gateway to Checkout/,
  });
  await firstCard.getByRole('button', { name: 'Approve' }).click();

  await expect(firstCard.getByRole('status')).toContainText('Action recorded');
});

test('edits the proposed strength before approving', async ({ page }) => {
  await page.goto('/agent');

  await page.getByRole('radio', { name: /Approve/ }).check();

  const firstCard = page.getByRole('article', {
    name: /Latency Injector on API Gateway to Checkout/,
  });
  await firstCard.getByRole('button', { name: 'Edit' }).click();

  const dialog = page.getByRole('dialog', { name: 'Edit proposed strength' });
  await expect(dialog).toBeVisible();
  const slider = dialog.getByRole('slider', { name: 'Strength' });
  await slider.fill('20');
  await dialog.getByRole('button', { name: 'Save and approve' }).click();

  await expect(dialog).toBeHidden();
  await expect(firstCard.getByRole('status')).toContainText('Action recorded');
});

test('intercepts an auto-launched action', async ({ page }) => {
  await page.goto('/agent');

  await page.getByRole('radio', { name: /Auto/ }).check();

  const firstCard = page.getByRole('article', {
    name: /Latency Injector on API Gateway to Checkout/,
  });
  await firstCard.getByRole('button', { name: 'Intercept' }).click();

  await expect(firstCard.getByRole('status')).toContainText('Action recorded');

  await expectNoAxeViolations(page);
});

test('Suggest mode shows no action buttons', async ({ page }) => {
  await page.goto('/agent');
  await page.getByRole('radio', { name: /Suggest/ }).check();

  const firstCard = page.getByRole('article', {
    name: /Latency Injector on API Gateway to Checkout/,
  });

  await expect(firstCard.getByRole('button', { name: 'Approve' })).toHaveCount(
    0,
  );
  await expect(
    firstCard.getByRole('button', { name: 'Intercept' }),
  ).toHaveCount(0);
  await expect(firstCard.getByRole('button', { name: 'Edit' })).toHaveCount(0);
});
