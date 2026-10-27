import { expect, test } from './fixtures';

const L14 = 'lessons/14-writing-down-a-difference-set/';
const L15 = 'lessons/15-many-sets-few-shapes/';
const STEPPER = 'playgrounds/singer-stepper/';

test.describe('Part V widgets', () => {
  test('singer-stepper computes each trace and keeps the zeros', async ({ page }) => {
    await page.goto(L14);
    const w = page.locator('[data-widget="singer-stepper"]');
    await expect(w.locator('.ss-rule')).toContainText('α³ = α + 1');
    await expect(w.locator('.ss-current')).toContainText('Press Next i');
    await w.locator('.ss-next').click();
    await expect(w.locator('.ss-current')).toContainText('Tr(1) = 1');
    await expect(w.locator('.ss-verdict')).toContainText('0 is not in D');
    await w.locator('.ss-next').click();
    await expect(w.locator('.ss-current')).toContainText('α^(1·2)');
    await expect(w.locator('.ss-current')).toContainText('α⁴ = α² + α');
    await expect(w.locator('.ss-verdict')).toContainText('1 joins D');
    await expect(w.locator('.ss-table tbody tr')).toHaveCount(2);
    await expect(w.locator('.ss-figure figcaption')).toContainText('D so far: {1}');
    for (let i = 0; i < 5; i++) await w.locator('.ss-next').click();
    await expect(w.locator('.ss-done')).toContainText('D = {1, 2, 4} is a (7, 3, 1) difference set');
    await expect(w.locator('.ss-line')).toContainText('[1 : 0 : 0]');
    await expect(w.locator('.ss-line')).toContainText('D = {0, 1, 3} + 1');
    await expect(w.locator('.ss-diffs li')).toHaveCount(6);
    await expect(w.locator('.ss-diagram circle.member')).toHaveCount(3);
    await expect(w.locator('.ss-cost')).toContainText('21 field multiplications');
    await expect(w.locator('.ss-cost')).toContainText('C(7, 3) = 35');
    await expect(w.locator('.ss-next')).toBeDisabled();

    await w.locator('.ss-q').selectOption('3');
    await expect(w.locator('.ss-table tbody tr')).toHaveCount(0);
    await w.locator('.ss-next').click();
    await expect(w.locator('.ss-verdict')).toContainText('0 joins D');
    await w.locator('.ss-finish').click();
    await expect(w.locator('.ss-done')).toContainText('D = {0, 1, 3, 9} is a (13, 4, 1) difference set');
    await expect(w.locator('.ss-line')).toContainText('It is the line z = 0 from Lesson 13');

    await w.locator('.ss-q').selectOption('4');
    await w.locator('.ss-finish').click();
    await expect(w.locator('.ss-done')).toContainText('{7, 9, 14, 15, 18}');
    await expect(w.locator('.ss-line')).toContainText('+ 14');
    await w.locator('.ss-reset').click();
    await expect(w.locator('.ss-table tbody tr')).toHaveCount(0);
  });

  test('singer-stepper plays and pauses', async ({ page }) => {
    await page.goto(L14);
    const w = page.locator('[data-widget="singer-stepper"]');
    await w.locator('.ss-play').click();
    await expect(w.locator('.ss-play')).toHaveAttribute('aria-pressed', 'true');
    await expect(w.locator('.ss-table tbody tr')).toHaveCount(3, { timeout: 5000 });
    await w.locator('.ss-play').click();
    await expect(w.locator('.ss-play')).toHaveText('Play');
  });

  test('singer-stepper handles q = 13', async ({ page }) => {
    await page.goto(L14);
    const w = page.locator('[data-widget="singer-stepper"]');
    await w.locator('.ss-q').selectOption('13');
    await w.locator('.ss-finish').click();
    await expect(w.locator('.ss-done')).toContainText('(183, 14, 1) difference set');
    await expect(w.locator('.ss-diffs li')).toHaveCount(182);
    await expect(w.locator('.ss-cost')).toContainText('549 field multiplications');
  });

  test('multiplier-explorer finds multipliers and groups the classes', async ({ page }) => {
    await page.goto(L15);
    const w = page.locator('[data-widget="multiplier-explorer"]');
    await expect(w.locator('.me-verdict')).toContainText('D = {0, 1, 3, 9} mod 13');
    await expect(w.locator('.me-verdict')).toContainText('2·D = {0, 2, 5, 6}');
    await expect(w.locator('.me-result')).toContainText('not a translate of D or of its mirror image');
    await expect(w.locator('.me-class')).toHaveCount(4);
    await expect(w.locator('.me-summary')).toContainText('12 / 3 = 4 classes');
    await expect(w.locator('.me-summary')).toContainText('2 up to translation and mirror images');
    await expect(w.locator('.me-class.now .me-t-chip')).toHaveText(['2', '5', '6']);
    await expect(w.locator('.me-figures figure')).toHaveCount(2);

    await w.locator('.me-t-chip[data-t="3"]').click();
    await expect(w.locator('.me-result')).toContainText('3·D = D + 0');
    await expect(w.locator('.me-result')).toContainText('a power of p = 3');
    await w.locator('.me-t').selectOption('12');
    await expect(w.locator('.me-result')).toContainText('−D + 0');
    await expect(w.locator('.me-class.now .me-t-chip')).toHaveText(['4', '10', '12']);

    await w.locator('.me-q').selectOption('4');
    await expect(w.locator('.me-class')).toHaveCount(2);
    await expect(w.locator('.me-summary')).toContainText('{1, 2, 4, 8, 11, 16}');
    await w.locator('.me-q').selectOption('13');
    await expect(w.locator('.me-class')).toHaveCount(40);
    await expect(w.locator('.me-more a')).toHaveAttribute('href', /singer-classes\/\?q=13$/);
  });
});

test('the Singer stepper playground keeps q and the step in the URL', async ({ page }) => {
  await page.goto(`${STEPPER}?q=5&i=4`);
  const w = page.locator('[data-widget="singer-stepper"]');
  await expect(w.locator('.ss-q')).toHaveValue('5');
  await expect(w.locator('.ss-table tbody tr')).toHaveCount(4);
  await w.locator('.ss-next').click();
  await expect(page).toHaveURL(/q=5&i=5/);
  await w.locator('.ss-q').selectOption('7');
  await expect(page).toHaveURL(/q=7&i=0/);
  await page.goto(`${STEPPER}?q=6&i=2`);
  await expect(w.locator('.ss-q')).toHaveValue('3');
});

test.describe('Part V at phone width', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  for (const path of [L14, L15, `${STEPPER}?q=13&i=183`]) {
    test(`no horizontal scroll on ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.waitForTimeout(400);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('no horizontal scroll with the q = 13 classes listed', async ({ page }) => {
    await page.goto(L15);
    await page.locator('.me-q').selectOption('13');
    await page.locator('.me-t').selectOption('2');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
