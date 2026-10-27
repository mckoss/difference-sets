import { expect, test } from './fixtures';

const APERTURE = 'lessons/19-pictures-without-a-lens/';
const ECHO = 'lessons/20-finding-an-echo/';

test.describe('coded aperture', () => {
  test('decoding the Singer mask gives sharp peaks on a flat floor; a random mask leaves ghosts', async ({ page }) => {
    await page.goto(APERTURE);
    const w = page.locator('[data-widget="coded-aperture"]');
    await expect(w.locator('.ap-mask .hole')).toHaveCount(127);
    await expect(w.locator('.ap-sky .star')).toHaveCount(2);
    await expect(w.locator('.ap-decoded')).toHaveCount(0);

    await w.locator('.decode-button').click();
    await expect(w.locator('.floor-report')).toHaveClass(/ok/);
    await expect(w.locator('.floor-report')).toContainText('flat floor');
    await expect(w.locator('.ap-decoded .peak')).toHaveCount(2);

    // Click an empty cell of the sky to add a third star.
    const sky = w.locator('.ap-sky');
    await sky.scrollIntoViewIfNeeded();
    const box = (await sky.boundingBox())!;
    await page.mouse.click(box.x + box.width * (2.5 / 17), box.y + box.height * (12.5 / 15));
    await expect(w.locator('.ap-sky .star')).toHaveCount(3);
    await expect(w.locator('.ap-decoded .peak')).toHaveCount(3);
    await expect(w.locator('.floor-report')).toContainText('3 sharp peaks');

    // Clicking a star again removes it.
    await page.mouse.click(box.x + box.width * (2.5 / 17), box.y + box.height * (12.5 / 15));
    await expect(w.locator('.ap-sky .star')).toHaveCount(2);

    await w.locator('.mask-random').click();
    await expect(w.locator('.mask-random')).toHaveAttribute('aria-pressed', 'true');
    await expect(w.locator('.floor-report')).toHaveClass(/bad/);
    await expect(w.locator('.floor-report')).toContainText('Ghosts');

    await w.locator('.clear-button').click();
    await expect(w.locator('.ap-sky .star')).toHaveCount(0);
  });

  test('a star can be dragged and placed with the keyboard', async ({ page }) => {
    await page.goto(APERTURE);
    const w = page.locator('[data-widget="coded-aperture"]');
    const sky = w.locator('.ap-sky');
    await sky.scrollIntoViewIfNeeded();
    const box = (await sky.boundingBox())!;
    const at = (r: number, c: number) => [box.x + box.width * ((c + 0.5) / 17), box.y + box.height * ((r + 0.5) / 15)];
    const [x0, y0] = at(4, 5);
    const [x1, y1] = at(8, 1);
    await page.mouse.move(x0, y0);
    await page.mouse.down();
    await page.mouse.move(x1, y1, { steps: 5 });
    await page.mouse.up();
    await expect(w.locator('.ap-sky .star[data-r="8"][data-c="1"]')).toHaveCount(1);
    await expect(w.locator('.ap-sky .star[data-r="4"][data-c="5"]')).toHaveCount(0);

    await sky.focus();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await expect(w.locator('.ap-sky .star')).toHaveCount(3);
  });
});

test.describe('echo finder', () => {
  test('the m-sequence has a flat −1 floor, the random code does not, and the echo is found', async ({ page }) => {
    await page.goto(ECHO);
    const w = page.locator('[data-widget="echo-finder"]');
    await expect(w.locator('.print-m figcaption')).toContainText('31 at shift 0, every other shift: exactly −1');
    await expect(w.locator('.print-random figcaption')).toContainText('anywhere from');
    await expect(w.locator('.echo-scores .bar')).toHaveCount(31);

    await w.locator('.shift-range').fill('3');
    await expect(w.locator('.echo-score figcaption')).toContainText('C(3)');
    await expect(w.locator('.echo-scores .bar.current')).toHaveCount(1);

    await w.locator('.noise-range').fill('0');
    await w.locator('.find-echo').click();
    await expect(w.locator('.echo-result')).toHaveClass(/ok/);
    await expect(w.locator('.echo-result')).toContainText('really was delayed');
    await expect(w.locator('.echo-scores .bar.found')).toHaveCount(1);

    await w.locator('.length-select').selectOption('7');
    await expect(w.locator('.echo-scores .bar')).toHaveCount(127);
    await expect(w.locator('.shift-range')).toHaveAttribute('max', '126');
    await expect(w.locator('.print-m figcaption')).toContainText('127 at shift 0, every other shift: exactly −1');

    await w.locator('.code-random').click();
    await expect(w.locator('.code-random')).toHaveAttribute('aria-pressed', 'true');
    await expect(w.locator('.echo-received figcaption')).toContainText('random code');
  });
});

test.describe('applications on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  for (const path of [APERTURE, ECHO]) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await page.locator('h1').waitFor();
      await page.locator('.widget').first().waitFor();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
