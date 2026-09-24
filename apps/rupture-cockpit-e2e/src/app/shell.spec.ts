import { expect, test } from '@playwright/test';

import { expectNoAxeViolations, primaryNav, requireBox } from '../helpers';

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
  await primaryNav(page).getByRole('link', { name: 'Topology' }).click();
  await expect(page).toHaveURL(/\/topology$/);
});

test('marks the active nav link with a non-color indicator', async ({
  page,
}) => {
  await page.goto('/agent');

  const nav = primaryNav(page);
  const agentLink = nav.getByRole('link', { name: 'Agent' });
  const topologyLink = nav.getByRole('link', { name: 'Topology' });

  await expect(agentLink).toHaveAttribute('aria-current', 'page');
  await expect(topologyLink).not.toHaveAttribute('aria-current');

  const agentBorder = await agentLink.evaluate(
    (el) => getComputedStyle(el).borderBottomColor,
  );
  const topologyBorder = await topologyLink.evaluate(
    (el) => getComputedStyle(el).borderBottomColor,
  );
  expect(agentBorder).not.toBe(topologyBorder);
});

test('shows a visible focus ring on nav links', async ({ page }) => {
  await page.goto('/');

  const agentLink = primaryNav(page).getByRole('link', { name: 'Agent' });
  await agentLink.focus();
  await expect(agentLink).toBeFocused();

  const outlineStyle = await agentLink.evaluate(
    (el) => getComputedStyle(el).boxShadow,
  );
  // The ring is implemented with Tailwind's ring utilities, which compile
  // to box-shadow. A non-empty value means the focus ring is applied.
  expect(outlineStyle).not.toBe('none');
});

test('keeps primary navigation usable at a narrow viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  const nav = primaryNav(page);
  await expect(nav).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Agent' })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Topology' })).toBeVisible();

  await nav.getByRole('link', { name: 'Agent' }).click();
  await expect(page).toHaveURL(/\/agent$/);
  await expect(nav.getByRole('link', { name: 'Agent' })).toHaveAttribute(
    'aria-current',
    'page',
  );

  await expectNoAxeViolations(page);
});

test('keeps the header fixed and scrolls only the content', async ({
  page,
}) => {
  await page.goto('/agent');

  const headerNav = primaryNav(page);
  const agentNavBox = requireBox(await headerNav.boundingBox());
  expect(agentNavBox).not.toBeNull();

  await page.goto('/topology');
  const topologyNavBox = requireBox(await headerNav.boundingBox());
  expect(topologyNavBox).not.toBeNull();

  expect(agentNavBox.x).toBe(topologyNavBox.x);
  expect(agentNavBox.width).toBe(topologyNavBox.width);

  // The document itself must not scroll.
  await page.goto('/agent');
  const documentScrollHeight = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  expect(documentScrollHeight).toBeLessThanOrEqual(viewportHeight + 1);
});
