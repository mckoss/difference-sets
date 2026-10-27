import { expect, test } from './fixtures';

const LESSON = 'lessons/17-every-planar-set-singer/';

test.describe('search versus construction', () => {
  test('autoruns n = 7 and streams Singer-type results', async ({ page }) => {
    await page.goto('playgrounds/search-vs-construction/');
    const w = page.locator('.planar-search');
    await expect(w.locator('.search-status')).toContainText('all 12 sets are Singer sets', { timeout: 20_000 });
    await expect(w.locator('.search-results li')).toHaveCount(12);
    await expect(w.locator('.badge.singer')).toHaveCount(12);
    await expect(w.locator('.stat-value').nth(2)).toHaveText('100%');
    await expect(w.locator('.stat-note').first()).toContainText('partial sets tried');
  });

  test('reads and writes ?n=, and finds nothing for n = 6', async ({ page }) => {
    await page.goto('playgrounds/search-vs-construction/?n=4');
    const w = page.locator('.planar-search');
    await expect(w.locator('.order-select')).toHaveValue('4');
    await expect(w.locator('.search-results li')).toHaveCount(2);
    await w.locator('.order-select').selectOption('6');
    await expect(page).toHaveURL(/\?n=6$/);
    await expect(w.locator('.search-intro')).toContainText('Bruck–Ryser already rules it out');
    await w.locator('.run-button').click();
    await expect(w.locator('.search-status')).toContainText('found no planar difference set of order 6');
    await expect(w.locator('.search-results li')).toHaveCount(0);
  });

  test('cancel stops a long search', async ({ page }) => {
    await page.goto('playgrounds/search-vs-construction/?n=12');
    const w = page.locator('.planar-search');
    await expect(w.locator('.search-results li')).toHaveCount(0);
    await w.locator('.run-button').click();
    await expect(w.locator('.cancel-button')).toBeEnabled();
    await expect(w.locator('.stat-note').first()).toContainText('partial sets tried', { timeout: 10_000 });
    await w.locator('.cancel-button').click();
    await expect(w.locator('.search-status')).toContainText('Cancelled');
    await expect(w.locator('.run-button')).toBeEnabled();
    await expect(w.locator('.cancel-button')).toBeDisabled();
  });
});

test.describe('large-q explorer', () => {
  test('builds the default set, verifies λ = 1, and offers a download', async ({ page }) => {
    await page.goto('playgrounds/explorer/');
    const w = page.locator('.large-q-explorer');
    await expect(w.locator('.q-select')).toHaveValue('101');
    await expect(w.locator('.explorer-verdict')).toContainText('occurs exactly once: λ = 1');
    await expect(w.locator('.explorer-summary')).toContainText('(10,303, 102, 1)');
    const text = await w.locator('.set-text').inputValue();
    expect(text.split(', ')).toHaveLength(102);
    const link = w.locator('a.download-link');
    await expect(link).toHaveAttribute('download', 'singer-q101.txt');
    await expect(link).toHaveAttribute('href', /^blob:/);
    const [download] = await Promise.all([page.waitForEvent('download'), link.click()]);
    expect(download.suggestedFilename()).toBe('singer-q101.txt');
  });

  test('hovering a point on the rim shows its index', async ({ page }) => {
    await page.goto('playgrounds/explorer/?q=11');
    const w = page.locator('.large-q-explorer');
    await expect(w.locator('.explorer-verdict')).toContainText('λ = 1');
    const set = (await w.locator('.set-text').inputValue()).split(', ').map(Number);
    await w.locator('.chord-canvas').scrollIntoViewIfNeeded();
    const box = (await w.locator('.chord-canvas').boundingBox())!;
    // Same geometry as the drawing: the rim sits RIM_INSET (8 / 640) of the side inside the edge, 0 at the top.
    const RIM_INSET = 8 / 640;
    const hoverPoint = async (i: number) => {
      const r = box.width / 2 - RIM_INSET * box.width;
      const a = -Math.PI / 2 + (2 * Math.PI * i) / 133;
      await page.mouse.move(box.x + box.width / 2 + r * Math.cos(a), box.y + box.width / 2 + r * Math.sin(a));
    };
    const tip = w.locator('.explorer-tip');
    await hoverPoint(set[3]);
    await expect(tip).toBeVisible();
    await expect(tip).toHaveText(`${set[3]} (in the set)`);
    const outside = [...Array(133).keys()].find((i) => !set.some((d) => Math.min(Math.abs(d - i), 133 - Math.abs(d - i)) < 3))!;
    await hoverPoint(outside);
    await expect(tip).toHaveText(String(outside));
    await page.mouse.move(box.x + box.width / 2, box.y + box.width / 2);
    await expect(tip).toBeHidden();
  });

  test('URL state round-trips and q = 1024 works', async ({ page }) => {
    await page.goto('playgrounds/explorer/?q=1024');
    const w = page.locator('.large-q-explorer');
    await expect(w.locator('.q-select')).toHaveValue('1024');
    await expect(w.locator('.explorer-summary')).toContainText('1,049,601', { timeout: 20_000 });
    await expect(w.locator('.explorer-verdict')).toContainText('λ = 1');
    await w.locator('button[aria-label="Previous prime power"]').click();
    await expect(page).toHaveURL(/\?q=1021$/);
    await expect(w.locator('.explorer-summary')).toContainText('q = 1021');
  });

  test('ignores an invalid q', async ({ page }) => {
    await page.goto('playgrounds/explorer/?q=6');
    await expect(page.locator('.large-q-explorer .q-select')).toHaveValue('101');
  });
});

test.describe('lesson 17 widgets', () => {
  test('polynomial identity checks {0, 1, 3} mod 7 and fails when broken', async ({ page }) => {
    await page.goto(LESSON);
    const w = page.locator('.polynomial-identity');
    await expect(w.locator('.identity-verdict')).toContainText('(7, 3, 1) difference set of order n = 2');
    await expect(w.locator('.product-table td')).toHaveCount(9);
    await expect(w.locator('.arrow-note')).toContainText('1.414');
    await w.locator('.turn-input').fill('3');
    await expect(w.locator('.arrow-note')).toContainText('1.414');
    await w.locator('[data-point="2"]').click();
    await expect(w.locator('.identity-verdict')).toHaveClass(/bad/);
    await expect(w.locator('.product-table td')).toHaveCount(16);
    await w.locator('.preset-select').selectOption({ label: '{0, 1, 3, 9} mod 13 (order 3)' });
    await expect(w.locator('.identity-verdict')).toContainText('order n = 3');
  });

  test('plane orders table switches views and explains an order', async ({ page }) => {
    await page.goto(LESSON);
    const w = page.locator('.plane-orders');
    await expect(w.locator('.order-cell')).toHaveCount(99);
    await expect(w.locator('.order-cell[data-status="computer"]')).toHaveText(['85', '91', '95']);
    await expect(w.locator('.order-detail')).toContainText('Wilbrink');
    await w.locator('.order-cell[data-n="10"]').click();
    await expect(w.locator('.order-detail')).toContainText('10 = 1² + 3²');
    await w.locator('.view-any').click();
    await expect(w.locator('.order-cell[data-n="12"]')).toHaveAttribute('data-status', 'open');
    await expect(w.locator('.order-cell[data-n="10"]')).toHaveAttribute('data-status', 'computer');
  });

  test('Bruck–Ryser checker takes any order', async ({ page }) => {
    await page.goto(LESSON);
    const w = page.locator('.bruck-ryser');
    await expect(w).toContainText('So no projective plane of order 21 exists');
    await w.locator('.order-input').fill('45');
    await w.locator('.order-input').press('Enter');
    await expect(w).toContainText('45 = 3² + 6²');
  });

  test('the lesson search widget runs on demand', async ({ page }) => {
    await page.goto(LESSON);
    const w = page.locator('.planar-search');
    await expect(w.locator('.search-results li')).toHaveCount(0);
    await w.locator('.run-button').click();
    await expect(w.locator('.badge.singer')).toHaveCount(10);
  });
});

test('new pages have no horizontal scroll at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of [LESSON, 'playgrounds/search-vs-construction/', 'playgrounds/explorer/?q=1024']) {
    await page.goto(path);
    await page.waitForTimeout(500);
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(width, path).toBeLessThanOrEqual(390);
  }
});
