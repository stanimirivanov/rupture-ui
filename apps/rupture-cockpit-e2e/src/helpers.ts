import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

/**
 * Runs an axe-core scan over the current page and asserts zero violations.
 * Centralised because every accessibility-bearing spec uses it and the
 * options (tags, exclusions, disabled rules) must be identical everywhere.
 */
export async function expectNoAxeViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
}
