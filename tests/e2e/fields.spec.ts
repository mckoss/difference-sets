import { expect, test } from './fixtures';

const L5 = 'lessons/05-which-clocks-are-fields/';
const L6 = 'lessons/06-fields-of-prime-order/';
const L7 = 'lessons/07-prime-power-fields/';
const L8 = 'lessons/08-primitive-elements/';
const L9 = 'lessons/09-fields-inside-fields/';

test.describe('Part III widgets', () => {
  test('zn-tables marks permutations, zero divisors, and explains inverses', async ({ page }) => {
    await page.goto(L5);
    const w = page.locator('[data-widget="zn-tables"]');
    await expect(w.locator('.ff-verdict')).toContainText('7 is prime');
    await expect(w.locator('tr.perm')).toHaveCount(6);
    await expect(w.locator('td.zd')).toHaveCount(0);
    await w.locator('tbody th').nth(3).click();
    await expect(w.locator('.ff-info')).toContainText('3⁻¹ = 5');

    await w.locator('.zn-n').selectOption('6');
    await expect(w.locator('.ff-verdict')).toContainText('not prime');
    await expect(w.locator('tr.nonperm')).toHaveCount(3);
    await expect(w.locator('td.zd').first()).toBeVisible();
    await w.locator('tbody th').nth(2).click();
    await expect(w.locator('.ff-info')).toContainText('zero divisor');

    await w.locator('.zn-op').selectOption('add');
    await expect(w.locator('caption')).toHaveText('Addition mod 6');
  });

  test('zn-clock jumps around the clock', async ({ page }) => {
    await page.goto(L5);
    const w = page.locator('[data-widget="zn-clock"]');
    for (let i = 0; i < 5; i++) await w.locator('.clock-step').click();
    await expect(w.locator('.ff-status')).toContainText('3 × 5 = 15 ≡ 1 (mod 7)');
    await expect(w.locator('.ff-status')).toContainText('5 is the inverse of 3');
    await w.locator('.clock-n').selectOption('6');
    await w.locator('.clock-a').selectOption('2');
    for (let i = 0; i < 3; i++) await w.locator('.clock-step').click();
    await expect(w.locator('.ff-status')).toContainText('2 is a zero divisor');
    await expect(w.locator('line.arrow')).toHaveCount(3);
  });

  test('euclid steps to the inverse', async ({ page }) => {
    await page.goto(L5);
    const w = page.locator('[data-widget="euclid"]');
    await expect(w.locator('tbody tr')).toHaveCount(2);
    for (let i = 0; i < 3; i++) await w.locator('.euclid-step').click();
    await expect(w.locator('tbody tr')).toHaveCount(5);
    await expect(w.locator('.ff-status')).toContainText('the inverse of 5 mod 13 is 8');
    await w.locator('.euclid-a').selectOption('6');
    await w.locator('.euclid-n').selectOption('9');
    await w.locator('.euclid-all').click();
    await expect(w.locator('.ff-status')).toContainText('gcd(6, 9) = 3');
  });

  test('scrambled-field counts its way to clock arithmetic', async ({ page }) => {
    await page.goto(L6);
    const w = page.locator('[data-widget="scrambled-field"]');
    const next = w.locator('.scramble-next');
    await expect(next).toHaveText('Find 0');
    await next.click();
    await expect(next).toHaveText('Find 1');
    await next.click();
    for (let i = 0; i < 4; i++) await next.click();
    await expect(next).toHaveText('Snap into order');
    await expect(w.locator('.scramble-log li')).toHaveCount(6);
    await next.click();
    await expect(w.locator('.ff-status')).toContainText('isomorphism onto ℤ/5ℤ');
    const firstRow = await w.locator('table').first().locator('tbody tr').nth(1).locator('td').allTextContents();
    expect(firstRow).toEqual(['1', '2', '3', '4', '0']);
  });

  test('gf-tables shows a field, and zero divisors for a reducible modulus', async ({ page }) => {
    await page.goto(L7);
    const w = page.locator('[data-widget="gf-tables"]');
    await expect(w.locator('.ff-verdict')).toContainText('GF(4)');
    await expect(w.locator('.gf-elements li')).toHaveCount(4);
    await expect(w.locator('td.zd')).toHaveCount(0);
    await w.locator('.ff-poly').selectOption('1,0,1');
    await expect(w.locator('.ff-verdict')).toContainText('reducible');
    await expect(w.locator('td.zd')).toHaveCount(1);
    await w.locator('.ff-p').selectOption('3');
    await expect(w.locator('.ff-verdict')).toContainText('GF(9)');
    await w.locator('.gf-style').selectOption('digits');
    await expect(w.locator('thead th').nth(1)).toHaveText('00');
    await w.locator('tbody th').nth(1).click();
    await expect(w.locator('.ff-info')).toContainText('inverse');
  });

  test('poly-division steps through long division', async ({ page }) => {
    await page.goto(L7);
    const w = page.locator('[data-widget="poly-division"]');
    await w.locator('.div-step').click();
    await expect(w.locator('.div-step-row')).toHaveCount(1);
    await w.locator('.div-all').click();
    await expect(w.locator('.ff-status')).toContainText('remainder is');
    await w.locator('.div-a').fill('x^4');
    await w.locator('.div-all').click();
    await expect(w.locator('.ff-status')).toContainText('remainder is x² + x');
    await w.locator('.div-b').fill('x^^');
    await expect(w.locator('.ff-status')).toContainText('Type polynomials');
  });

  test('field-isomorphism relabels GF(8) and checks it', async ({ page }) => {
    await page.goto(L7);
    const w = page.locator('[data-widget="field-isomorphism"]');
    await expect(w.locator('.iso-table tbody tr')).toHaveCount(8);
    await expect(w.locator('.iso-check')).toContainText('It is an isomorphism');
    await w.locator('.iso-root').selectOption('1');
    await expect(w.locator('.iso-check')).toContainText('It is an isomorphism');
    await w.locator('.iso-e').selectOption('4');
    await expect(w.locator('.iso-table tbody tr')).toHaveCount(16);
    await expect(w.locator('.iso-check')).toContainText('It is an isomorphism');
  });

  test('powers walks the cycle and runs the fast test', async ({ page }) => {
    await page.goto(L8);
    const w = page.locator('[data-widget="powers"]');
    await expect(w.locator('.ff-verdict')).toContainText('g is primitive');
    await w.locator('.pow-step').click();
    await w.locator('.pow-step').click();
    await expect(w.locator('line.arrow')).toHaveCount(2);
    await expect(w.locator('.log-table')).toBeVisible();
    await w.locator('.ff-e').selectOption('4');
    await w.locator('.ff-poly').selectOption('1,1,1,1,1');
    await expect(w.locator('.ff-verdict')).toContainText('order 5');
    await expect(w.locator('.ff-checks li.bad')).toHaveCount(1);
    await expect(w.locator('.log-table')).toHaveCount(0);
  });

  test('frobenius fixes GF(4) inside GF(64)', async ({ page }) => {
    await page.goto(L9);
    const w = page.locator('[data-widget="frobenius"]').nth(1);
    await expect(w.locator('.ff-verdict')).toContainText('fixes 4 elements');
    await expect(w.locator('.ff-verdict')).toContainText('α²¹');
    await expect(w.locator('.fixed-list li')).toHaveCount(4);
    await expect(w.locator('.orbits li')).toHaveCount(3 + 60 / 3);
    await w.locator('.frob-q').selectOption('2');
    await expect(w.locator('.ff-verdict')).toContainText('fixes 2 elements');
    const first = page.locator('[data-widget="frobenius"]').first();
    await first.locator('select.frob-a').selectOption({ index: 3 });
    await expect(first.locator('.dream-result')).toContainText('Equal.');
  });

  test('lessons 5–9 each have a try-it answer and a calculator link', async ({ page }) => {
    for (const path of [L5, L6, L7, L8, L9]) {
      await page.goto(path);
      await expect(page.locator('.try-it details')).toHaveCount(1);
      await expect(page.locator('article a[href*="playgrounds/field-calculator/?"]')).toHaveCount(1);
      await expect(page.locator('.notation').first()).toBeVisible();
    }
  });
});

test.describe('field calculator playground', () => {
  test('defaults to GF(8) and writes its state to the URL', async ({ page }) => {
    await page.goto('playgrounds/field-calculator/');
    await expect(page).toHaveURL(/\?p=2&e=3&poly=1,1,0,1$/);
    await expect(page.locator('.calc-section h2')).toHaveText([
      'Tables',
      'Powers, order, and logs',
      'Frobenius: x ↦ x^q and its fixed points',
      'Isomorphism finder',
    ]);
    await page.locator('.calc-mode .ff-e').selectOption('2');
    await expect(page).toHaveURL(/\?p=2&e=2&poly=1,1,1$/);
    await page.locator('.pow-g').selectOption({ label: 'x + 1' });
    await expect(page).toHaveURL(/&g=1,1$/);
  });

  test('reads GF(p^e) state from the URL', async ({ page }) => {
    await page.goto('playgrounds/field-calculator/?p=3&e=2&poly=1,0,1&g=1,1');
    await expect(page.locator('.calc-mode .ff-p')).toHaveValue('3');
    await expect(page.locator('.calc-mode .ff-poly')).toHaveValue('1,0,1');
    await expect(page.locator('.gf-elements li')).toHaveCount(9);
    await expect(page.locator('.pow-g')).toHaveValue('4');
    await expect(page.locator('[data-widget], .field-calculator').locator('.ff-verdict').nth(1)).toContainText('order 8');
  });

  test('accepts the legacy k parameter and a reducible modulus', async ({ page }) => {
    await page.goto('playgrounds/field-calculator/?p=2&k=2&poly=1,0,1');
    await expect(page).toHaveURL(/\?p=2&e=2&poly=1,0,1$/);
    await expect(page.locator('td.zd')).toHaveCount(1);
    await expect(page.locator('.calc-section h2').nth(1)).toHaveText('Powers and isomorphisms');
  });

  test('ℤ/vℤ mode round-trips through the URL', async ({ page }) => {
    await page.goto('playgrounds/field-calculator/?v=6');
    await expect(page.locator('.calc-mode-select')).toHaveValue('zn');
    await expect(page.locator('.ff-verdict')).toContainText('6 is not prime');
    await page.locator('.calc-n').selectOption('11');
    await expect(page).toHaveURL(/\?v=11$/);
    await expect(page.locator('.ff-verdict')).toContainText('11 is prime');
    await page.locator('.calc-mode-select').selectOption('gf');
    await expect(page).toHaveURL(/\?p=2&e=3/);
  });

  test.describe('on a phone', () => {
    test.use({ viewport: { width: 390, height: 800 } });
    for (const path of ['playgrounds/field-calculator/?p=2&e=6&poly=1,1,0,0,0,0,1', L5, L7, L8, L9]) {
      test(`${path} has no horizontal page scroll`, async ({ page }) => {
        await page.goto(path);
        await page.locator('.ff-widget').first().waitFor();
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  });
});
