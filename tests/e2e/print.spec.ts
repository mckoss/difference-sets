import { readdirSync } from 'node:fs';
import pkg from '../../package.json' with { type: 'json' };
import { expect, test } from './fixtures';

const LESSON_COUNT = readdirSync('src/content/lessons').filter((f) => f.endsWith('.md')).length;

test('the print edition holds the whole text, with version, URL, contents, and index', async ({ page }) => {
  await page.goto('print/');
  const cover = page.locator('.print-cover');
  await expect(cover).toContainText(`Version ${pkg.version}`);
  await expect(cover.getByRole('link', { name: 'mckoss.com/difference-sets' })).toHaveAttribute('href', 'https://mckoss.com/difference-sets/');
  await expect(page.locator('article.print-lesson')).toHaveCount(LESSON_COUNT);
  await expect(page.locator('.print-toc a')).toHaveCount(LESSON_COUNT + 3);
  // Every contents and index link points at something on the page.
  const targets = await page.locator('.print-toc a, .print-index a').evaluateAll((as) =>
    as.map((a) => a.getAttribute('href')!).filter((h) => !document.getElementById(h.slice(1))),
  );
  expect(targets).toEqual([]);
  expect(await page.locator('.print-index li').count()).toBeGreaterThan(60);
  await expect(page.locator('.print-index .print-pref.def[href="#def-trace"]')).toHaveCount(1);
  // Widgets still draw here, so the PDF gets their pictures.
  await expect(page.locator('#lesson-1 [data-widget="clock-difference"] svg').first()).toBeVisible();
});

test('the home page links the printable PDF', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('.print-link a')).toHaveAttribute('href', /singer-difference-sets\.pdf$/);
});
