import { expect, test } from './fixtures';

test('renders the q = 3 classes by default', async ({ page }) => {
  await page.goto('playgrounds/singer-classes/');
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

test('switching q redraws and updates the URL', async ({ page }) => {
  await page.goto('playgrounds/singer-classes/');
  await page.locator('#q-select').selectOption('7');
  await expect(page.locator('#q-summary')).toContainText('6 distinct classes');
  await expect(page.locator('#q-gallery figure')).toHaveCount(6);
  await expect(page).toHaveURL(/\?q=7$/);

  await page.locator('#q-select').selectOption('17');
  await expect(page.locator('#q-gallery figure')).toHaveCount(51);
});

test('reads q from the URL', async ({ page }) => {
  await page.goto('playgrounds/singer-classes/?q=5');
  await expect(page.locator('#q-select')).toHaveValue('5');
  await expect(page.locator('#q-gallery figure')).toHaveCount(5);
});

test('ignores an invalid q in the URL', async ({ page }) => {
  await page.goto('playgrounds/singer-classes/?q=6');
  await expect(page.locator('#q-select')).toHaveValue('3');
});

test('offers every prime power up to 32', async ({ page }) => {
  await page.goto('playgrounds/singer-classes/');
  const options = await page.locator('#q-select option').allTextContents();
  expect(options).toEqual(['2', '3', '4', '5', '7', '8', '9', '11', '13', '16', '17', '19', '23', '25', '27', '29', '31', '32']);
});
