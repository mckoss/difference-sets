import { expect, test } from './fixtures';

const L10 = 'lessons/10-vectors-over-a-finite-field/';
const L11 = 'lessons/11-coordinates/';
const L12 = 'lessons/12-field-inside-the-plane/';
const L13 = 'lessons/13-singer-cycle/';
const PG = 'playgrounds/pg2-explorer/';

test.describe('Part IV widgets', () => {
  test('vector-grid draws GF(q)³ in a three.js canvas and describes it in text', async ({ page }) => {
    await page.goto(L10);
    const w = page.locator('[data-widget="vector-grid"]');
    await expect(w).toHaveAttribute('data-three', 'ready', { timeout: 15_000 });
    const canvas = w.locator('canvas.vg-canvas');
    await expect(canvas).toBeVisible();
    const box = await canvas.boundingBox();
    expect(box!.width).toBeGreaterThan(200);
    expect(box!.height).toBeGreaterThan(200);
    await expect(w.locator('.vg-desc')).toContainText('27 vectors');
    await expect(w.locator('.vg-desc')).toContainText('(0, 0, 0), (1, 0, 1), (2, 0, 2)');

    await w.locator('.vg-line').selectOption({ label: '(1, 2, 2)' });
    await w.locator('.vg-plane').selectOption({ label: 'x + y + z = 0' });
    await expect(w.locator('.vg-desc')).toContainText('(0, 0, 0), (1, 2, 2), (2, 1, 1)');
    await expect(w.locator('.vg-desc')).toContainText('holds 9 vectors');
    await expect(w.locator('.vg-desc')).toContainText('meets the plane only at the origin');
    await w.locator('.vg-line').selectOption({ label: '(1, 1, 1)' });
    await expect(w.locator('.vg-desc')).toContainText('lies inside the plane');

    await w.locator('.vg-mode[data-mode="all"]').click();
    await expect(w.locator('.vg-desc')).toContainText('13 × 2 = 26');
    await w.locator('.vg-q').selectOption('4');
    await expect(w.locator('.vg-desc')).toContainText('0, 1, ω, ω²');
    await expect(w.locator('.vg-desc')).toContainText('21 × 3 = 63');
    // Dragging turns the view without errors.
    const b = (await canvas.boundingBox())!;
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
    await page.mouse.down();
    await page.mouse.move(b.x + b.width / 2 + 80, b.y + b.height / 2 + 20, { steps: 5 });
    await page.mouse.up();
  });

  test('three.js loads only on the page with the 3D widget', async ({ page }) => {
    const scripts: string[] = [];
    page.on('request', (r) => {
      if (r.resourceType() === 'script') scripts.push(r.url());
    });
    await page.goto(L11);
    await expect(page.locator('.pg-explorer .pg-verdict')).toBeVisible();
    expect(scripts.some((s) => s.includes('three.module'))).toBe(false);
  });

  test('pg2-explorer joins two points with the cross product and checks the dot products', async ({ page }) => {
    await page.goto(L11);
    const w = page.locator('[data-widget="pg2-explorer"]');
    await expect(w.locator('.pg-verdict')).toContainText('PG(2, 3): 13 points and 13 lines');
    await expect(w.locator('.pg-verdict')).toContainText('Checked all 78 pairs');
    await expect(w.locator('.pg-pt')).toHaveCount(13);
    await w.locator('.pg-pt[data-point="1"]').click();
    await expect(w.locator('.pg-info')).toContainText('lies on 4 lines');
    await w.locator('.pg-pt[data-point="10"]').click();
    await expect(w.locator('.pg-info')).toContainText('[1 : 0 : 1] and [0 : 1 : 1] is [1 : 1 : 2]');
    await expect(w.locator('.pg-info')).toContainText('(2, 2, 1), scaled to [1 : 1 : 2]');
    await expect(w.locator('.pg-info')).toContainText('1·1 + 1·0 + 2·1 = 3 ≡ 0 (mod 3)');
    await expect(w.locator('.pg-pt.result')).toHaveCount(2);

    await w.locator('.pg-lines button').nth(0).click();
    await w.locator('.pg-lines button').nth(12).click();
    await expect(w.locator('.pg-info')).toContainText('meet in exactly one point, [0 : 1 : 0]');

    await w.locator('.pg-q').selectOption('2');
    await expect(w.locator('.pg-verdict')).toContainText('PG(2, 2): 7 points');
    await w.locator('.pg-q').selectOption('7');
    await expect(w.locator('.pg-verdict')).toContainText('57 points');
  });

  test('field-points numbers points by powers of α', async ({ page }) => {
    await page.goto(L12);
    const w = page.locator('[data-widget="field-points"]');
    await expect(w.locator('.fp-rule')).toContainText('α³ = α + 2');
    await expect(w.locator('.fp-current')).toContainText('α⁴ = α² + 2α');
    await expect(w.locator('.fp-current')).toContainText('[0 : 1 : 2]');
    await expect(w.locator('.fp-same-table tbody tr')).toHaveCount(2);
    for (let i = 0; i < 13; i++) await w.locator('.fp-next').click();
    await expect(w.locator('.fp-current')).toContainText('α¹⁷ = 2α² + α');
    await expect(w.locator('.fp-current')).toContainText('17 mod 13 = 4');
    await expect(w.locator('.fp-all-table tbody tr')).toHaveCount(13);
    await w.locator('.fp-all-table tbody th').nth(9).click();
    await expect(w.locator('.fp-current')).toContainText('α⁹ = α + 1');
    await w.locator('.fp-q').selectOption('4');
    await expect(w.locator('.fp-rule')).toContainText('α³ = α² + α + ω');
    await expect(w.locator('.fp-all-table tbody tr')).toHaveCount(21);
  });

  test('lesson 12 explorer shows both numberings', async ({ page }) => {
    await page.goto(L12);
    const w = page.locator('[data-widget="pg2-explorer"]');
    await expect(w.locator('.plane-circle .pt')).toHaveCount(13);
    await expect(w.locator('.pg-lines')).toContainText('[0 : 0 : 1] = {0, 1, 3, 9}');
    await w.locator('.plane-circle .pt[data-point="0"]').click();
    await w.locator('.plane-circle .pt[data-point="3"]').click();
    await expect(w.locator('.plane-circle .pt.on-line')).toHaveCount(4);
    await expect(w.locator('.pg-info')).toContainText('[0 : 0 : 1]');
  });

  test('singer-cycle turns the line z = 0 through every translate', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(L13);
    const w = page.locator('[data-widget="singer-cycle"]');
    await expect(w.locator('.sc-status')).toContainText('Line D + 0 = {0, 1, 3, 9}');
    await expect(w.locator('.sc-table')).toContainText('(0, 1, 2)4 = [0 : 1 : 2]');
    await w.locator('.sc-step').click();
    await expect(w.locator('.sc-status')).toContainText('Line D + 1 = {1, 2, 4, 10}, with coordinates [1 : 0 : 0]');
    for (let i = 0; i < 12; i++) await w.locator('.sc-step').click();
    await expect(w.locator('.sc-status')).toContainText('All 13 lines have appeared');
    await w.locator('.sc-q').selectOption('4');
    await expect(w.locator('.sc-status')).toContainText('{0, 1, 4, 14, 16}');
    for (let i = 0; i < 7; i++) await w.locator('.sc-step').click();
    await expect(w.locator('.sc-status')).toContainText('{0, 2, 7, 8, 11}');
  });

  test('singer-cycle animates with Play and Pause', async ({ page }) => {
    await page.goto(L13);
    const w = page.locator('[data-widget="singer-cycle"]');
    await w.locator('.sc-play').click();
    await expect(w.locator('.sc-play')).toHaveAttribute('aria-pressed', 'true');
    await expect(w.locator('.sc-chips li.seen')).toHaveCount(3, { timeout: 5000 });
    await w.locator('.sc-play').click();
    await expect(w.locator('.sc-play')).toHaveText('Play');
  });
});

test('the PG(2, q) explorer playground keeps its state in the URL', async ({ page }) => {
  await page.goto(`${PG}?q=4&points=0,1`);
  const w = page.locator('[data-widget="pg2-explorer"]');
  await expect(w.locator('.pg-verdict')).toContainText('PG(2, 4): 21 points');
  await expect(w.locator('.pg-pt.selected')).toHaveCount(2);
  await expect(w.locator('.plane-circle .pt.on-line')).toHaveCount(5);
  await w.locator('.pg-q').selectOption('9');
  await expect(w.locator('.pg-verdict')).toContainText('91 points');
  await w.locator('.pg-lines button').nth(3).click();
  await expect(page).toHaveURL(/q=9&lines=3/);
  await page.reload();
  await expect(w.locator('.pg-lines button.selected')).toHaveCount(1);
  await expect(w.locator('.plane-circle .pt.on-line')).toHaveCount(10);
});

test.describe('Part IV at phone width', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  for (const path of [L10, L11, L12, L13, `${PG}?q=9`]) {
    test(`no horizontal scroll on ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForTimeout(400);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
