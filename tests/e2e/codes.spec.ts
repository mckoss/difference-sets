import { expect, test } from './fixtures';

const page21 = 'lessons/21-majority-rules/';

test.describe('majority decoder', () => {
  test('flipping a bit fails all of its checks, and the vote repairs two errors', async ({ page }) => {
    await page.goto(page21);
    const w = page.locator('[data-widget="majority-decoder"]').first();
    await expect(w.locator('.bit')).toHaveCount(21);
    await expect(w.locator('.check-list li.pass')).toHaveCount(5);
    await expect(w.locator('.error-status')).toContainText('No errors');

    const before = await w.locator('.bit[data-bit="5"] .bit-value').textContent();
    await w.locator('.bit[data-bit="5"]').click();
    await expect(w.locator('.bit[data-bit="5"] .bit-value')).not.toHaveText(before ?? '');
    await expect(w.locator('.bit[data-bit="5"]')).toHaveClass(/err/);
    await expect(w.locator('.check-list li.fail')).toHaveCount(5);
    await expect(w.locator('.code-circle .check.fail')).toHaveCount(5);
    await expect(w.locator('.vote-line')).toContainText('flips bit 5');

    // A second error, by keyboard.
    await w.locator('.bit[data-bit="12"]').focus();
    await page.keyboard.press('Enter');
    await expect(w.locator('.error-status')).toContainText('2 bits differ');
    await expect(w.locator('.bit.err')).toHaveCount(2);

    await w.locator('.decode-button').click();
    await expect(w.locator('.decode-result')).toHaveText(/flipped bits 5 and 12 and recovered/);
    await expect(w.locator('.bit.err')).toHaveCount(0);
    await expect(w.locator('.bit.fixed')).toHaveCount(2);
  });

  test('the slider inspects a bit without flipping it', async ({ page }) => {
    await page.goto(page21);
    const w = page.locator('[data-widget="majority-decoder"]').first();
    await w.locator('.inspect-range').fill('9');
    await expect(w.locator('.check-head')).toContainText('Bit 9');
    await expect(w.locator('.bit.inspect')).toHaveAttribute('data-bit', '9');
    await expect(w.locator('.bit.err')).toHaveCount(0);
  });

  test('three errors fool the vote', async ({ page }) => {
    await page.goto(page21);
    const w = page.locator('[data-widget="majority-decoder"]').nth(1);
    await expect(w.locator('.bit.err')).toHaveCount(3);
    await expect(w.locator('.error-status')).toHaveClass(/bad/);
    await expect(w.locator('.check-list li.fail')).toHaveCount(3);
    await w.locator('.decode-button').click();
    await expect(w.locator('.decode-result')).toContainText('got it wrong');
    await w.locator('.reset-button').click();
    await expect(w.locator('.bit.err')).toHaveCount(0);
  });

  test('the order-2 plane has 7 bits and 3 checks per bit', async ({ page }) => {
    await page.goto(page21);
    const w = page.locator('[data-widget="majority-decoder"]').first();
    await w.locator('.plane-select').selectOption('2');
    await expect(w.locator('.bit')).toHaveCount(7);
    await expect(w.locator('.check-list li')).toHaveCount(3);
    await w.locator('.bit[data-bit="2"]').click();
    await w.locator('.decode-button').click();
    await expect(w.locator('.decode-result')).toHaveText(/flipped bit 2 and recovered/);
  });
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 800 } });

  test('lesson 21 has no horizontal scroll', async ({ page }) => {
    await page.goto(page21);
    await page.locator('.majority-decoder .bit').first().waitFor();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
