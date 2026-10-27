import { readdirSync } from 'node:fs';
import pkg from '../../package.json' with { type: 'json' };
import { expect, test } from './fixtures';

const LESSON_COUNT = readdirSync('src/content/lessons').filter((f) => f.endsWith('.md')).length;

test('home page shows the title, version, hook, and path', async ({ page }) => {
  await page.goto('./');
  await expect(page).toHaveTitle('Singer Difference Sets');
  await expect(page.locator('#app-version')).toHaveText(`v${pkg.version}`);
  await expect(page.locator('.hero .chord-diagram circle.member')).toHaveCount(3);
  await expect(page.locator('.path-part')).toHaveCount(6);
  await expect(page.locator('.path-part li')).toHaveCount(LESSON_COUNT);
});

test('sidebar is a numbered outline of every lesson, grouped by part', async ({ page }) => {
  await page.goto('./');
  const sidebar = page.locator('#sidebar');
  await expect(sidebar.locator('.sidebar-part h3')).toHaveText([
    /Part I\b.*The puzzle/,
    /Part II\b.*Projective planes/,
    /Part III\b.*Finite fields/,
    /Part IV\b.*Planes from fields/,
    /Part V\b.*Singer's algorithm/,
    /Part VI\b.*The frontier/,
  ]);
  const numbers = await sidebar.locator('.sidebar-part .num').allTextContents();
  expect(numbers).toEqual(Array.from({ length: LESSON_COUNT }, (_, i) => String(i + 1)));
  await expect(sidebar.locator('.sidebar-playgrounds a')).toHaveText(['Singer classes gallery']);
});

test('every sidebar page loads and is marked current in the sidebar', async ({ page }) => {
  await page.goto('./');
  const links = await page.locator('#sidebar a').evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).href));
  expect(links).toHaveLength(LESSON_COUNT + 1);
  for (const link of links) {
    await page.goto(link);
    await expect(page.locator('h1')).toBeVisible();
    const current = page.locator('#sidebar a[aria-current="page"]');
    await expect(current).toHaveCount(1);
    expect(await current.evaluate((a) => (a as HTMLAnchorElement).href)).toBe(link);
  }
});

test('next links chain through the lessons in sidebar order', async ({ page }) => {
  await page.goto('./');
  const titles = await page.locator('#sidebar .sidebar-part .title').allTextContents();
  await page.locator('.hero .button').click();
  const visited: string[] = [];
  for (;;) {
    visited.push((await page.locator('h1').textContent()) ?? '');
    const next = page.locator('.pager a[rel="next"]');
    if ((await next.count()) === 0) break;
    await next.click();
  }
  expect(visited).toEqual(titles);

  await page.locator('.pager a[rel="prev"]').click();
  await expect(page.locator('h1')).toHaveText(titles[LESSON_COUNT - 2]);
});

test('lesson 1 has a previous link to home', async ({ page }) => {
  await page.goto('lessons/01-differences-on-a-circle/');
  await page.locator('.pager a[rel="prev"]').click();
  await expect(page).toHaveTitle('Singer Difference Sets');
});

test('math is typeset by KaTeX at build time', async ({ page }) => {
  await page.goto('lessons/06-fields-of-prime-order/');
  await expect(page.locator('.katex').first()).toBeVisible();
  expect(await page.locator('article').textContent()).not.toContain('$');
  await page.goto('lessons/01-differences-on-a-circle/');
  await expect(page.locator('.katex-display')).toHaveCount(1);
  await expect(page.locator('article .chord-diagram')).toHaveCount(1);
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test('the sidebar folds behind a Contents button', async ({ page }) => {
    await page.goto('lessons/05-which-clocks-are-fields/');
    const sidebar = page.locator('#sidebar');
    const toggle = page.getByRole('button', { name: 'Contents' });
    await expect(sidebar).toBeHidden();
    await toggle.click();
    await expect(sidebar).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await toggle.click();
    await expect(sidebar).toBeHidden();
  });

  for (const path of ['./', 'lessons/01-differences-on-a-circle/', 'playgrounds/singer-classes/?q=8']) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await page.locator('h1').waitFor();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
