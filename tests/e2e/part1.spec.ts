import { expect, test } from './fixtures';

const workbench = '[data-widget="difference-workbench"]';

test.describe('difference workbench', () => {
  test('clicking points updates the tally and verdict', async ({ page }) => {
    await page.goto('lessons/01-differences-on-a-circle/');
    const w = page.locator(workbench);
    await expect(w.locator('.verdict')).toHaveText(/\(7, 3, 1\) difference set/);
    await expect(w.locator('.verdict')).toHaveClass(/ok/);
    await expect(w.locator('.bar.ok')).toHaveCount(6);

    await w.locator('[data-point="3"]').click();
    await w.locator('[data-point="2"]').click();
    await expect(w.locator('.set-line')).toHaveText('D = {0, 1, 2} mod 7, k = 3');
    await expect(w.locator('.verdict')).toHaveText('Not a difference set. Missing: 3, 4. Repeated: 1, 6.');
    await expect(w.locator('.bar.many')).toHaveCount(2);
    await expect(w.locator('.bar.few')).toHaveCount(2);
    await expect(w.locator('.circle-set line.chord-a')).toHaveCount(3);

    // Keyboard toggling.
    await w.locator('[data-point="2"]').focus();
    await page.keyboard.press('Enter');
    await expect(w.locator('.set-line')).toHaveText('D = {0, 1} mod 7, k = 2');
    await expect(w.locator('.verdict')).toContainText("can't be shared evenly");
  });

  test('hovering a bar highlights the chords with that difference', async ({ page }) => {
    await page.goto('lessons/01-differences-on-a-circle/');
    const w = page.locator(workbench);
    await w.locator('.bar[data-d="2"]').hover();
    await expect(w.locator('line.chord-a.hot')).toHaveCount(1);
  });

  test('presets, v, and clear', async ({ page }) => {
    await page.goto('lessons/01-differences-on-a-circle/');
    const w = page.locator(workbench);
    await w.locator('.preset-select').selectOption({ label: '{1, 3, 4, 5, 9} mod 11: a (11, 5, 2) difference set' });
    await expect(w.locator('.v-input')).toHaveValue('11');
    await expect(w.locator('.verdict')).toHaveText(/\(11, 5, 2\) difference set/);
    await w.locator('.v-input').fill('9');
    await w.locator('.v-input').press('Enter');
    await expect(w.locator('.circle-set .pt')).toHaveCount(9);
    await expect(w.locator('.set-line')).toHaveText('D = {1, 3, 4, 5} mod 9, k = 4');
    await w.locator('.clear-button').click();
    await expect(w.locator('.verdict')).toHaveText(/Pick at least two points/);
  });

  test('pairs list shows which pairs give each difference', async ({ page }) => {
    await page.goto('lessons/01-differences-on-a-circle/');
    const w = page.locator(workbench);
    await w.locator('.pairs summary').click();
    await expect(w.locator('.pairs li')).toHaveText([
      '1: 1 − 0',
      '2: 3 − 1',
      '3: 3 − 0',
      '4: 0 − 3',
      '5: 1 − 3',
      '6: 0 − 1',
    ]);
  });
});

test.describe('workbench playground', () => {
  test('reads and writes URL state, and the translates follow it', async ({ page }) => {
    await page.goto('playgrounds/difference-workbench/?v=13&set=0,1,3,9');
    const w = page.locator(workbench);
    await expect(w.locator('.v-input')).toHaveValue('13');
    await expect(w.locator('.verdict')).toHaveText(/\(13, 4, 1\) difference set/);
    const t = page.locator('[data-widget="translates"]');
    await expect(t.locator('.meet-table .cell')).toHaveCount(169);
    await expect(t.locator('.table-note')).toContainText('exactly λ = 1');

    await w.locator('[data-point="9"]').click();
    await w.locator('[data-point="2"]').click();
    await expect(page).toHaveURL(/\?v=13&set=0%2C1%2C2%2C3$|\?v=13&set=0,1,2,3$/);
    await expect(t.locator('.table-note')).toContainText('not all equal');

    await page.reload();
    await expect(w.locator('.set-line')).toHaveText('D = {0, 1, 2, 3} mod 13, k = 4');
  });

  test('ignores an invalid v and junk in the set', async ({ page }) => {
    await page.goto('playgrounds/difference-workbench/?v=500&set=0,x,1,3,99');
    const w = page.locator(workbench);
    await expect(w.locator('.v-input')).toHaveValue('7');
    await expect(w.locator('.set-line')).toHaveText('D = {0, 1, 3} mod 7, k = 3');
  });
});

test.describe('translates', () => {
  test('stepping j and clicking the table', async ({ page }) => {
    await page.goto('lessons/02-rotations/');
    const t = page.locator('[data-widget="translates"]');
    await expect(t.locator('.shared')).toHaveText(/share 1 point: \{1\}/);
    await t.locator('.step-button').click();
    await expect(t.locator('.j-range')).toHaveValue('2');
    await expect(t.locator('.key-b')).toHaveText('D + 2 = {2, 3, 5}');
    await expect(t.locator('.circle-set .pt.in-both')).toHaveCount(1);

    await t.locator('.preset-select').selectOption({ label: 'D = {0, 1, 2} mod 7: not a difference set' });
    await t.locator('.cell[data-i="0"][data-j="1"]').click();
    await expect(t.locator('.shared')).toHaveText(/share 2 points: \{1, 2\}/);
    await expect(t.locator('.circle-set .pt.in-both')).toHaveCount(2);
    await t.locator('.cell[data-i="0"][data-j="3"]').click();
    await expect(t.locator('.shared')).toHaveText(/share 0 points/);
    await expect(t.locator('.table-note')).toContainText('not all equal');
  });

  test('every off-diagonal entry is λ for {0, 1, 3, 9} mod 13', async ({ page }) => {
    await page.goto('lessons/04-projective-planes/');
    const t = page.locator('[data-widget="translates"]');
    const off = await t.locator('.cell.off text').allTextContents();
    expect(off).toHaveLength(13 * 12);
    expect(new Set(off)).toEqual(new Set(['1']));
  });
});

test.describe('clock widgets', () => {
  test('clock-mod wraps any integer', async ({ page }) => {
    await page.goto('lessons/01-differences-on-a-circle/');
    const c = page.locator('[data-widget="clock-mod"]');
    await expect(c.locator('.clock-equation strong')).toHaveText('10 = 1·7 + 3');
    await expect(c.locator('.pt.in-a')).toHaveAttribute('data-point', '3');
    await c.locator('.n-input').fill('-1');
    await expect(c.locator('.clock-equation strong')).toHaveText('−1 = (−1)·7 + 6');
    await expect(c.locator('.pt.in-a')).toHaveAttribute('data-point', '6');
    await c.locator('.n-plus').click();
    await expect(c.locator('.clock-equation strong')).toHaveText('0 = 0·7 + 0');
  });

  test('clock-difference shows both differences', async ({ page }) => {
    await page.goto('lessons/01-differences-on-a-circle/');
    const c = page.locator('[data-widget="clock-difference"]');
    await c.locator('[data-point="5"]').click();
    await expect(c.locator('.clock-equation')).toContainText('Point 5 picked');
    await c.locator('[data-point="2"]').click();
    await expect(c.locator('.key-a')).toHaveText('5 − 2 = 3');
    await expect(c.locator('.key-b')).toHaveText('2 − 5 = −3 ≡ 4 (mod 7)');
    await expect(c.locator('path.walk')).toHaveCount(2);
  });
});

test.describe('brute-force count', () => {
  test('table and live search', async ({ page }) => {
    await page.goto('lessons/01-differences-on-a-circle/');
    const b = page.locator('[data-widget="brute-force-count"]');
    await expect(b.locator('tbody tr').first()).toContainText('35');
    await expect(b.locator('tbody tr').nth(3)).toContainText('736,281');
    await b.locator('.run-button').click();
    await expect(b.locator('.search-progress')).toHaveText(
      /Checked 35 of 35 subsets and found 14 difference sets in \d+ ms\./,
    );
    await expect(b.locator('.search-found')).toHaveText(/^First found: \{0, 1, 3\}/);
    await b.locator('.search-select').selectOption('3');
    await b.locator('.run-button').click();
    await expect(b.locator('.search-progress')).toHaveText(/Checked 715 of 715 subsets and found 52 difference sets/);
  });
});

test.describe('Fano plane', () => {
  const fano = '[data-widget="fano-plane"]';

  test('two points give their line', async ({ page }) => {
    await page.goto('lessons/03-fano-plane/');
    const f = page.locator(fano);
    await f.locator('.fano-point[data-point="2"]').click();
    await f.locator('.fano-point[data-point="6"]').click();
    await expect(f.locator('.fano-info')).toHaveText(
      /Points 2 and 6 lie on exactly one line: \{0, 2, 6\} = \{0, 1, 3\} \+ 6/,
    );
    await expect(f.locator('.fano-line.result')).toHaveAttribute('data-line', '6');
    await expect(f.locator('.fano-point.result')).toHaveAttribute('data-point', '0');
  });

  test('two lines give their meeting point, from the picture or the list', async ({ page }) => {
    await page.goto('lessons/03-fano-plane/');
    const f = page.locator(fano);
    await f.locator('.line-list button[data-line="1"]').click();
    await f.locator('.line-list button[data-line="3"]').click();
    await expect(f.locator('.fano-info')).toHaveText(/meet in exactly one point: 4/);
    await expect(f.locator('.fano-point.result')).toHaveAttribute('data-point', '4');
    // Clicking a selected line again deselects it.
    await f.locator('.line-list button[data-line="1"]').click();
    await expect(f.locator('.fano-info')).toHaveText(/\{3, 4, 6\} has 3 points/);
  });

  test('every pair of points has exactly one line', async ({ page }) => {
    await page.goto('lessons/03-fano-plane/');
    const f = page.locator(fano);
    for (let a = 0; a < 7; a++) {
      for (let b = a + 1; b < 7; b++) {
        await f.locator('.clear-button').click();
        await f.locator(`.fano-point[data-point="${a}"]`).click();
        await f.locator(`.fano-point[data-point="${b}"]`).click();
        await expect(f.locator('.fano-line.result')).toHaveCount(1);
      }
    }
  });

  test('rotation steps each line to the next', async ({ page }) => {
    await page.goto('lessons/03-fano-plane/');
    const f = page.locator(fano);
    await f.locator('.rotate-toggle').click();
    await expect(f.locator('.rotate-toggle')).toHaveAttribute('aria-pressed', 'true');
    await expect(f.locator('.fano-info')).toHaveText(/sends the line \{0, 1, 3\} to \{1, 2, 4\}/);
    await expect(f.locator('path.arrow')).toHaveCount(3);
    await f.locator('.rotate-step').click();
    await expect(f.locator('.fano-info')).toHaveText(/sends the line \{1, 2, 4\} to \{2, 3, 5\}/);
    await expect(f.locator('.fano-line.result')).toHaveAttribute('data-line', '2');
  });
});
