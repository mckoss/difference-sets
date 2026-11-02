import { expect, test } from './fixtures';

const LESSON = 'lessons/26-secrets-that-look-like-noise/';
const bent = '[data-widget="bent-function"]';

test.describe('bent functions (Lesson 26)', () => {
  test('x1x2 ⊕ x3x4 is a (16, 6, 2) difference set and far from every linear rule', async ({ page }) => {
    await page.goto(LESSON);
    const w = page.locator(bent);
    await expect(w.locator('.bent-cell')).toHaveCount(16);
    await expect(w.locator('.bent-cell.on')).toHaveCount(6);
    await expect(w.locator('.xor-overlap .overlap')).toHaveCount(15);
    await expect(w.locator('.xor-overlap .overlap .value')).toHaveText(new Array(15).fill('2'));
    await expect(w.locator('.overlap-note')).toHaveText(
      'Every shift overlaps D in exactly 2 inputs: D is a (16, 6, 2) difference set under XOR.',
    );
    await expect(w.locator('.rule-list li')).toHaveCount(16);
    await expect(w.locator('.rule-list li.close')).toHaveCount(0);
    await expect(w.locator('.verdict')).toHaveText('Bent: every linear rule is wrong on at least 6 of 16 inputs.');
    await expect(w.locator('.verdict')).toHaveClass(/ok/);
  });

  test('toggling inputs by mouse and keyboard breaks and restores bentness', async ({ page }) => {
    await page.goto(LESSON);
    const w = page.locator(bent);
    await w.locator('[data-x="0"]').click();
    await expect(w.locator('[data-x="0"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(w.locator('.bent-cell.on')).toHaveCount(7);
    await expect(w.locator('.preset-select')).toHaveValue('custom');
    await expect(w.locator('.verdict')).toHaveClass(/bad/);
    await expect(w.locator('.overlap-note')).toContainText('not a difference set');

    // Keyboard: the clicked cell keeps focus, so Space toggles it back.
    await expect(w.locator('[data-x="0"]')).toBeFocused();
    await page.keyboard.press('Space');
    await expect(w.locator('.bent-cell.on')).toHaveCount(6);
    await expect(w.locator('.verdict')).toHaveClass(/ok/);
  });

  test('presets: a linear rule is caught, the complement-style bent function has 10 ones', async ({ page }) => {
    await page.goto(LESSON);
    const w = page.locator(bent);
    await w.locator('.preset-select').selectOption('x1+x3');
    await expect(w.locator('.verdict')).toHaveText(
      'Rule x1 ⊕ x3 matches f on 16 of 16 inputs — a linear attack would use it.',
    );
    await expect(w.locator('.rule-list li.best')).toHaveAttribute('data-a', '10');

    await w.locator('.preset-select').selectOption('x1x4+x2x3+1');
    await expect(w.locator('.bent-cell.on')).toHaveCount(10);
    await expect(w.locator('.overlap-note')).toContainText('(16, 10, 6) difference set');
    await expect(w.locator('.verdict')).toHaveClass(/ok/);

    await w.locator('.preset-select').selectOption('majority');
    await expect(w.locator('.verdict')).toHaveClass(/bad/);
    await w.locator('.random-button').click();
    await expect(w.locator('.preset-select')).toHaveValue('custom');
    await expect(w.locator('.rule-list li')).toHaveCount(16);
  });
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 800 } });

  test(`${LESSON} has no horizontal scroll`, async ({ page }) => {
    await page.goto(LESSON);
    await page.locator(`${bent} .bent-cell`).first().waitFor();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
