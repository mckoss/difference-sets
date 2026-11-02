import { expect, test } from './fixtures';

test.describe('glossary', () => {
  test('the glossary page lists terms alphabetically, each linked to its lesson', async ({ page }) => {
    await page.goto('glossary/');
    await expect(page.locator('h1')).toHaveText('Glossary');
    const terms = await page.locator('.glossary-group:not([aria-labelledby="symbols"]) dt').allTextContents();
    expect(terms.length).toBeGreaterThan(80);
    expect(terms).toEqual([...terms].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })));
    const trace = page.locator('#trace');
    await expect(trace.locator('dd')).toContainText('Tr(x) = x + xq + xq²');
    await trace.getByRole('link', { name: 'Lesson 9: Fields inside fields' }).click();
    await expect(page).toHaveURL(/lessons\/09-fields-inside-fields\/#def-trace$/);
    await expect(page.locator('#def-trace')).toHaveText('trace');
  });

  test('a term in the text shows its definition on hover, then opens the glossary on click', async ({ page }) => {
    await page.goto('lessons/14-writing-down-a-difference-set/');
    const term = page.locator('a.gloss[data-term="Frobenius map"]');
    await expect(term).toHaveCount(1);
    const tip = page.locator('#gloss-tip');
    await expect(tip).toBeHidden();
    await term.hover();
    await expect(tip).toBeVisible();
    await expect(tip).toContainText('Frobenius map');
    await expect(tip).toContainText('x ↦ xp');
    await expect(tip.locator('sup').first()).toHaveText('p');
    await expect(term).toHaveAttribute('aria-describedby', 'gloss-tip');
    await page.mouse.move(0, 0);
    await expect(tip).toBeHidden();

    await term.hover();
    await expect(tip).toBeVisible();
    await term.click();
    await expect(page).toHaveURL(/glossary\/#frobenius-map$/);
  });

  test('a tap shows the definition first; Escape closes it', async ({ page }) => {
    await page.goto('lessons/14-writing-down-a-difference-set/');
    const term = page.locator('a.gloss[data-term="Frobenius map"]');
    await term.focus();
    const tip = page.locator('#gloss-tip');
    await expect(tip).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(tip).toBeHidden();
    // A click before the definition shows just shows it.
    await term.dispatchEvent('click');
    await expect(tip).toBeVisible();
    await expect(page).toHaveURL(/14-writing-down-a-difference-set\/$/);
  });

  test('the introducing lesson anchors a term instead of linking it', async ({ page }) => {
    await page.goto('lessons/09-fields-inside-fields/');
    await expect(page.locator('a.gloss[data-term="trace"]')).toHaveCount(0);
    await expect(page.locator('#def-trace')).toHaveCount(1);
  });

  test('the last lesson leads on to the glossary', async ({ page }) => {
    await page.goto('lessons/26-secrets-that-look-like-noise/');
    await page.locator('.pager a.next').click();
    await expect(page).toHaveURL(/glossary\/$/);
  });
});

test.describe('topic search', () => {
  test('finds sections by text and jumps to their anchors', async ({ page }) => {
    await page.goto('');
    const input = page.getByRole('combobox', { name: 'Search topics' });
    await input.fill('freshman');
    const results = page.locator('#topic-search-results [role="option"]');
    await expect(results.first()).toBeVisible();
    await expect(page.locator('.topic-result-title').first()).toContainText(/freshman/i);
    const titles = await page.locator('.topic-result-where').allTextContents();
    expect(titles).toContain('Lesson 9 · Fields inside fields');

    await input.fill('freshmans dream');
    await page.keyboard.press('ArrowDown');
    await expect(results.first()).toHaveAttribute('aria-selected', 'true');
    const href = await results.first().locator('a').getAttribute('href');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`${href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
  });

  test('says when nothing matches, and Escape clears', async ({ page }) => {
    await page.goto('');
    const input = page.getByRole('combobox', { name: 'Search topics' });
    await input.fill('zzzzqx');
    await expect(page.locator('.topic-search-empty')).toHaveText('No sections match.');
    await page.keyboard.press('Escape');
    await expect(input).toHaveValue('');
    await expect(page.locator('#topic-search-results')).toBeHidden();
  });
});

test.describe('glossary and search at phone width', () => {
  test.use({ viewport: { width: 375, height: 740 } });

  test('no sideways scroll, and the popup fits on screen', async ({ page }) => {
    await page.goto('glossary/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.goto('lessons/14-writing-down-a-difference-set/');
    const term = page.locator('a.gloss[data-term="Frobenius map"]');
    await term.scrollIntoViewIfNeeded();
    await term.dispatchEvent('click');
    const box = (await page.locator('#gloss-tip').boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(375);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  });
});
