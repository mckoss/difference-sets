import { expect, test } from '@playwright/test';
import pkg from '../../package.json' with { type: 'json' };

let errors: string[] = [];

test.beforeEach(async ({ page }) => {
  errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto('./');
});

test.afterEach(() => {
  expect(errors).toEqual([]);
});

test('shows the title and version', async ({ page }) => {
  await expect(page).toHaveTitle('Singer Difference Sets');
  await expect(page.locator('#app-version')).toHaveText(`v${pkg.version}`);
});

test('renders the q = 3 classes by default', async ({ page }) => {
  await expect(page.locator('#q-select')).toHaveValue('3');
  await expect(page.locator('#q-summary')).toContainText('(13, 4, 1)');
  const figures = page.locator('#q-gallery figure');
  await expect(figures).toHaveCount(2);
  await expect(figures.locator('figcaption')).toHaveText(['{0, 1, 3, 9}', '{0, 1, 4, 6}']);
  const first = figures.first().locator('svg');
  await expect(first.locator('circle.member')).toHaveCount(4);
  await expect(first.locator('line.chord')).toHaveCount(6);
  await expect(first.locator('.diff-label')).toHaveCount(6);
});

test('switches q and redraws', async ({ page }) => {
  await page.locator('#q-select').selectOption('7');
  await expect(page.locator('#q-summary')).toContainText('6 distinct classes');
  await expect(page.locator('#q-gallery figure')).toHaveCount(6);
  await expect(page.locator('#q-gallery figure svg').first().locator('circle.member')).toHaveCount(8);

  await page.locator('#q-select').selectOption('17');
  await expect(page.locator('#q-gallery figure')).toHaveCount(51);
});

test('offers every prime power up to 32', async ({ page }) => {
  const options = await page.locator('#q-select option').allTextContents();
  expect(options).toEqual(['2', '3', '4', '5', '7', '8', '9', '11', '13', '16', '17', '19', '23', '25', '27', '29', '31', '32']);
});

test('fits a phone-width viewport without horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.locator('#q-select').selectOption('8');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
