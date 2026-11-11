import { expect, test } from './fixtures';

const raid = '[data-widget="raid-rebuild"]';
const path = 'lessons/28-rebuilding-a-disk/';

test.describe('rebuilding a disk (Lesson 28)', () => {
  test('a failed disk on the Fano layout costs every survivor one read', async ({ page }) => {
    await page.goto(path);
    const w = page.locator(raid);
    await expect(w.locator('.raid-figure .disk')).toHaveCount(7);
    await expect(w.locator('.raid-figure .chunk-g')).toHaveCount(21);
    await expect(w.locator('.layout-declustered')).toHaveAttribute('aria-pressed', 'true');

    await w.locator('[data-disk="0"]').click();
    await expect(w.locator('[data-disk="0"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(w.locator('.raid-figure .bar')).toHaveCount(6);
    await expect(w.locator('.raid-figure .bar[data-reads="1"]')).toHaveCount(6);
    await expect(w.locator('.verdict')).toHaveClass(/ok/);
    await expect(w.locator('.verdict')).toHaveText(
      'Disk 0 failed, losing a chunk of stripes S0, S4 and S6. Every survivor reads 1 chunk. Rebuild takes 1 read-time.',
    );
    await expect(w.locator('.xor-note')).toContainText('They match');
    await w.locator('.xor-stripe').selectOption('4');
    await expect(w.locator('.xor-note')).toContainText('They match');

    // Keyboard: fail disk 3 instead.
    await w.locator('[data-disk="3"]').focus();
    await page.keyboard.press('Enter');
    await expect(w.locator('[data-disk="3"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(w.locator('[data-disk="3"]')).toBeFocused();
    await expect(w.locator('.raid-figure .bar[data-reads="1"]')).toHaveCount(6);
  });

  test('classic and random layouts load some survivors and idle others', async ({ page }) => {
    await page.goto(path);
    const w = page.locator(raid);
    await w.locator('[data-disk="0"]').click();
    await w.locator('.layout-classic').click();
    await expect(w.locator('.raid-figure .bar[data-reads="3"]')).toHaveCount(2);
    await expect(w.locator('.raid-figure .bar[data-reads="0"]')).toHaveCount(4);
    await expect(w.locator('.verdict')).toHaveClass(/bad/);
    await expect(w.locator('.verdict')).toContainText('rebuild takes 3 read-times. 4 survivors read nothing.');

    await w.locator('.layout-random').click();
    await expect(w.locator('.verdict')).toHaveClass(/bad/);
    await expect(w.locator('.verdict')).toContainText(/reads? nothing/);
    expect(await w.locator('.raid-figure .bar[data-reads="0"]').count()).toBeGreaterThan(0);

    await w.locator('.layout-declustered').click();
    await w.locator('.preset-select').selectOption({ index: 2 });
    await expect(w.locator('.raid-figure .disk')).toHaveCount(21);
    await expect(w.locator('.raid-figure .bar[data-reads="1"]')).toHaveCount(20);
    await expect(w.locator('.verdict')).toHaveClass(/ok/);
  });
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 800 } });

  test(`${path} has no horizontal scroll`, async ({ page }) => {
    await page.goto(path);
    await page.locator(`${raid} [data-disk="0"]`).click();
    await page.locator(`${raid} .preset-select`).selectOption({ index: 2 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
