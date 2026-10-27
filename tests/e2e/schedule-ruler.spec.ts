import { expect, test } from './fixtures';

const wake = '[data-widget="wake-up"]';
const ruler = '[data-widget="golomb-ruler"]';

test.describe('wake-up schedules (Lesson 22)', () => {
  test('radios on {0, 1, 3} always meet; a random schedule can miss', async ({ page }) => {
    await page.goto('lessons/22-always-meet/');
    const w = page.locator(wake);
    await expect(w.locator('.wake-timeline rect.slot')).toHaveCount(21);
    await expect(w.locator('.wake-pairs li')).toHaveCount(3);
    await expect(w.locator('.wake-pairs li.miss')).toHaveCount(0);
    await expect(w.locator('.verdict')).toHaveClass(/ok/);

    // Move radio B's clock through every offset: A and B always share one slot.
    const b = w.locator('.offset-b');
    for (let t = 0; t < 7; t++) {
      await b.fill(String(t));
      await expect(w.locator('.wake-pairs li').first()).not.toHaveClass(/miss/);
    }
    await b.fill('4');
    await expect(w.locator('.wake-pairs li').first()).toHaveText('Radio A and B are both awake in slot 0.');

    await w.locator('.schedule-random').click();
    await expect(w.locator('.schedule-random')).toHaveAttribute('aria-pressed', 'true');
    await expect(w.locator('.verdict')).toHaveClass(/bad/);
    await w.locator('.miss-button').click();
    await expect(w.locator('.wake-pairs li.miss').first()).toBeVisible();

    await w.locator('.schedule-singer').click();
    await expect(w.locator('.verdict')).toHaveClass(/ok/);
  });

  test('relabels slots as keys and quorums, and changes the cycle', async ({ page }) => {
    await page.goto('lessons/22-always-meet/');
    const w = page.locator(wake);
    await w.locator('.view-select').selectOption('keys');
    await expect(w.locator('.wake-pairs li').first()).toContainText('share key');
    await w.locator('.view-select').selectOption('quorum');
    await expect(w.locator('.wake-pairs li').first()).toContainText('quorums of Server A');
    await w.locator('.preset-select').selectOption({ index: 2 });
    await expect(w.locator('.wake-timeline rect.slot')).toHaveCount(63);
    await w.locator('.shuffle-button').click();
    await expect(w.locator('.verdict')).toHaveClass(/ok/);
  });
});

test.describe('Golomb ruler (Lesson 23)', () => {
  test('measures both ways round and tallies every distance once', async ({ page }) => {
    await page.goto('lessons/23-a-ruler-with-no-repeats/');
    const r = page.locator(ruler);
    await expect(r.locator('.tally-cell.once')).toHaveCount(12);
    await r.locator('[data-mark="1"]').click();
    await r.locator('[data-mark="9"]').click();
    await expect(r.locator('.ruler-info')).toHaveText('From 1 to 9 is 8 steps clockwise, and 5 the other way round.');
    await expect(r.locator('.tally-cell.hot-a')).toHaveAttribute('data-d', '8');
    await expect(r.locator('.tally-cell.hot-b')).toHaveAttribute('data-d', '5');

    // Keyboard selection.
    await r.locator('[data-mark="3"]').focus();
    await page.keyboard.press('Enter');
    await expect(r.locator('.ruler-info')).toHaveText('Now click a second mark.');
  });

  test('unwinds at the longest gap into a straight Golomb ruler', async ({ page }) => {
    await page.goto('lessons/23-a-ruler-with-no-repeats/');
    const r = page.locator(ruler);
    await r.locator('.view-unwind').click();
    await expect(r.locator('.antenna')).toHaveCount(4);
    await expect(r.locator('.antenna .mark-label')).toHaveText(['0', '4', '5', '7']);
    await expect(r.locator('.table-note')).toHaveText(
      '6 pairs of antennas, 6 different spacings, none repeated. The array is 7 long, so spacing 6 is missing.',
    );
    await expect(r.locator('.coarray .spacing.missing')).toHaveCount(1);

    await r.locator('.cut-select').selectOption('0');
    await expect(r.locator('.antenna .mark-label')).toHaveText(['0', '2', '8', '12']);

    await r.locator('.preset-select').selectOption({ index: 2 });
    await expect(r.locator('.antenna .mark-label')).toHaveText(['0', '2', '7', '8', '11']);
    await expect(r.locator('.coarray .spacing.repeat')).toHaveCount(0);
  });
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 800 } });

  for (const path of ['lessons/22-always-meet/', 'lessons/23-a-ruler-with-no-repeats/']) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path);
      await page.locator('h1').waitFor();
      if (path.includes('23')) await page.locator('.view-unwind').click();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
