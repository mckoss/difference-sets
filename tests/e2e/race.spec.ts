import { expect, test } from './fixtures';

const race = '[data-widget="race-chart"]';

test.describe('race chart (Lesson 24)', () => {
  test('13 cars on 4 lanes: every pair meets once; a click follows a car', async ({ page }) => {
    await page.goto('lessons/24-a-fair-race/');
    const w = page.locator(race);
    await expect(w.locator('.race-table tbody tr')).toHaveCount(13);
    await expect(w.locator('.verdict')).toHaveClass(/ok/);
    await expect(w.locator('.race-opponents .tally-cell')).toHaveCount(12);
    await expect(w.locator('.race-opponents .tally-cell.missing')).toHaveCount(0);

    await w.locator('button.car[data-car="7"]').first().click();
    await expect(w.locator('button.car.selected')).toHaveCount(4);
    await expect(w.locator('.race-car')).toContainText('Car 7 races in heat 4 (lane 3)');
    await expect(w.locator('.race-opponents .tally-cell[data-car="2"] small')).toHaveText('× 1');
  });

  test('a typed lineup can be unfair, and Fairest restores the chart', async ({ page }) => {
    await page.goto('lessons/24-a-fair-race/');
    const w = page.locator(race);
    await w.locator('.lineup-input').fill('0, 1, 2');
    await expect(w.locator('.lineup-message')).toHaveText('Heat 0 needs one car in each of the 4 lanes.');
    await w.locator('.lineup-input').fill('0, 1, 2, 3');
    await expect(w.locator('.verdict')).toHaveClass(/bad/);
    await expect(w.locator('.verdict')).toContainText('never meet');
    await expect(w.locator('.verdict')).toContainText('Fairer: {0, 1, 3, 9}');
    await w.locator('.fairest-button').click();
    await expect(w.locator('.lineup-input')).toHaveValue('{0, 1, 3, 9}');
    await expect(w.locator('.verdict')).toHaveClass(/ok/);
  });

  test('loads the fairest chart for other tracks', async ({ page }) => {
    await page.goto('lessons/24-a-fair-race/');
    const w = page.locator(race);
    await w.locator('.cars-select').selectOption('20');
    await expect(w.locator('.lineup-input')).toHaveValue('{0, 1, 3, 7}');
    await expect(w.locator('.verdict')).toContainText('Every two cars meet 0 or 1');
    await w.locator('.lanes-select').selectOption('6');
    await w.locator('.cars-select').selectOption('16');
    await expect(w.locator('.verdict')).toContainText('(16, 6, 2) difference set mod 16, and there is none');
    await w.locator('.cars-select').selectOption('31');
    await expect(w.locator('.verdict')).toContainText('(31, 6, 1) difference set');
    await expect(w.locator('.race-table tbody tr')).toHaveCount(31);
  });
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 800 } });

  test('lessons/24-a-fair-race/ has no horizontal scroll', async ({ page }) => {
    await page.goto('lessons/24-a-fair-race/');
    await page.locator(`${race} .race-table`).waitFor();
    await page.locator(`${race} .lanes-select`).selectOption('8');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
