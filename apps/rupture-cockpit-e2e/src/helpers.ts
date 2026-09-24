import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

export interface Box {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/**
 * Runs an axe-core scan over the current page and asserts zero violations.
 * Centralised because every accessibility-bearing spec uses it and the
 * options (tags, exclusions, disabled rules) must be identical everywhere.
 */
export async function expectNoAxeViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
}

/**
 * Narrows a Playwright `boundingBox()` result, which is `Box | null`, to a
 * `Box`. Throws with a clear message rather than silently passing, so a
 * missing element fails the test at the point of the mistake instead of
 * producing a confusing downstream assertion failure.
 */
export function requireBox(box: Box | null): Box {
  if (!box) {
    throw new Error('Expected element to have a bounding box, but got null');
  }
  return box;
}
