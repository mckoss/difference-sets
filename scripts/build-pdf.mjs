// Renders the print edition (dist/print/) to dist/singer-difference-sets.pdf.
// Run after `npm run build`. Chromium opens the page, the widgets draw their
// opening state, Paged.js lays it out in pages (running heads, page numbers,
// contents and index page references), and Chromium prints it.

import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { chromium } from '@playwright/test';

const root = join(import.meta.dirname, '..');
const port = Number(process.env.PDF_PORT ?? 4199);
const url = `http://127.0.0.1:${port}/difference-sets/print/`;
const out = join(root, 'dist', 'singer-difference-sets.pdf');

const server = spawn(process.execPath, [join(root, 'tests/e2e/serve.mjs'), String(port)], { stdio: 'ignore' });
const browser = await chromium.launch();
try {
  for (let i = 0; ; i++) {
    try {
      if ((await fetch(url)).ok) break;
    } catch {}
    if (i > 50) throw new Error(`Server on port ${port} did not start`);
    await new Promise((r) => setTimeout(r, 100));
  }

  // About the width of the printed text block, so widgets lay out as they will print.
  const page = await browser.newPage({ viewport: { width: 700, height: 1000 } });
  await page.emulateMedia({ colorScheme: 'light' });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => (m.type() === 'error' ? errors.push(m.text()) : m.type() === 'log' && console.log(m.text())));

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => [...document.querySelectorAll('[data-widget]')].every((el) => el.childElementCount > 0), null, {
    timeout: 60_000,
  });
  await page.waitForTimeout(1500);

  // Run a few widgets to their most telling state, the way the lesson text
  // asks the reader to.
  // (Their buttons sit in control rows the print style hides, so click in the page.)
  const clicked = await page.evaluate((actions) => {
    let n = 0;
    for (const [widget, label] of actions) {
      for (const w of document.querySelectorAll(`[data-widget="${widget}"]`)) {
        const b = [...w.querySelectorAll('button')].find((x) => x.textContent.trim() === label);
        if (b) {
          b.click();
          n++;
        }
      }
    }
    return n;
  }, [
    ['coded-aperture', 'Decode'],
    ['echo-finder', 'Find the echo'],
    ['planar-search', 'Run search'],
  ]);
  if (clicked < 3) throw new Error(`Only ${clicked} of 3 print-time widget buttons found`);
  for (const disk of await page.locator('[data-widget="raid-rebuild"] [data-disk="0"]').all()) await disk.click();
  await page.waitForTimeout(1500);

  // PDF_ONLY=18 keeps just that lesson, for debugging the layout.
  if (process.env.PDF_ONLY) {
    await page.evaluate((only) => {
      for (const l of document.querySelectorAll('.print-lesson')) if (l.id !== `lesson-${only}`) l.remove();
    }, process.env.PDF_ONLY);
  }
  if (process.env.PDF_DROP) {
    await page.evaluate((sel) => document.querySelectorAll(sel).forEach((e) => e.remove()), process.env.PDF_DROP);
  }

  await page.evaluate(() => {
    const site = document.body.dataset.site;
    const base = '/difference-sets/';
    const lessonByPath = new Map([...document.querySelectorAll('.print-lesson')].map((a) => [base + a.dataset.path, a.id]));

    // Keep a widget on one page when it fits (the text block is about 900px
    // tall); a taller one may split, since Paged.js can't place it otherwise.
    for (const w of document.querySelectorAll('.print-lesson .widget')) {
      if (w.getBoundingClientRect().height < 800) w.classList.add('print-keep');
    }

    // Canvases don't survive Paged.js's copy of the page; freeze them as images.
    for (const canvas of document.querySelectorAll('canvas')) {
      const img = document.createElement('img');
      img.src = canvas.toDataURL();
      img.className = canvas.className;
      img.style.cssText = canvas.style.cssText;
      img.style.width ||= `${canvas.clientWidth}px`;
      img.style.height ||= `${canvas.clientHeight}px`;
      canvas.replaceWith(img);
    }

    // Show worked answers and asides open, as a book would. A <details> split
    // across pages grows a stray "Details" label, so they become plain blocks.
    for (const d of document.querySelectorAll('details')) {
      const block = document.createElement('div');
      block.className = `${d.className} print-details`;
      for (const child of [...d.childNodes]) {
        if (child.nodeName === 'SUMMARY') {
          const p = document.createElement('p');
          p.className = 'print-summary';
          p.innerHTML = child.innerHTML;
          p.textContent = p.textContent.replace(/^Show the answers?$/, (m) => (m.endsWith('s') ? 'Answers' : 'Answer'));
          block.append(p);
        } else block.append(child);
      }
      d.replaceWith(block);
    }

    // Links to another lesson point at its page; everything else at the live site.
    for (const lesson of document.querySelectorAll('.print-lesson')) {
      const from = new URL(base + lesson.dataset.path, location.origin);
      for (const a of lesson.querySelectorAll('a[href]')) {
        const raw = a.getAttribute('href');
        if (raw.startsWith('#') && document.getElementById(raw.slice(1))) continue;
        const target = new URL(raw, from);
        if (target.origin !== location.origin) continue;
        const id = lessonByPath.get(target.pathname);
        if (id && !a.classList.contains('gloss')) {
          a.setAttribute('href', `#${id}`);
          if (id !== lesson.id) a.classList.add('print-xref');
        } else {
          a.setAttribute('href', site + target.pathname.slice(base.length) + target.search + target.hash);
        }
      }
    }
  });

  // Paged.js waits for every image on a page, and a lazy image far down a long
  // page never loads; load them all now.
  await page.evaluate(async () => {
    const imgs = [...document.images];
    for (const img of imgs) img.loading = 'eager';
    await Promise.all(imgs.map((img) => (img.complete ? null : new Promise((r) => img.addEventListener('load', r, { once: true }) || img.addEventListener('error', r, { once: true })))));
  });

  await page.addScriptTag({ path: join(root, 'node_modules/pagedjs/dist/paged.js') });
  const pages = await page.evaluate(async (debug) => {
    // Paged.js's CSS parser predates media range syntax, which the build emits;
    // hand it the stylesheets with (width<=X) rewritten as (max-width:X).
    const sheets = [];
    for (const el of document.querySelectorAll('link[rel="stylesheet"], style')) {
      const text = el.tagName === 'LINK' ? await (await fetch(el.href)).text() : el.textContent;
      const fixed = text.replace(/\(width\s*<=?\s*([^)]+)\)/g, '(max-width:$1)').replace(/\(width\s*>=?\s*([^)]+)\)/g, '(min-width:$1)');
      sheets.push({ [el.href || location.href]: fixed });
      el.remove();
    }
    // Report progress, so a stuck layout shows where it stuck.
    class Progress extends window.Paged.Handler {
      afterPageLayout(el, page) {
        if (debug || page.position % 25 === 0) console.log(`page ${page.position + 1}: ${el.textContent.trim().slice(-60)}`);
      }
    }
    window.Paged.registerHandlers(Progress);
    const flow = await new window.Paged.Previewer().preview(undefined, sheets);
    return flow.total;
  }, Boolean(process.env.PDF_DEBUG));
  if (errors.length) throw new Error(`Page errors:\n${errors.join('\n')}`);
  if (pages < 50 && !process.env.PDF_ONLY) throw new Error(`Only ${pages} pages; expected the whole text`);

  await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true, tagged: true, outline: true });
  console.log(`Wrote ${out}: ${pages} pages`);

  // PDF_SHOTS=dir saves contact sheets of the pages, eight to an image, for review.
  if (process.env.PDF_SHOTS) {
    await page.addStyleTag({
      content: `.pagedjs_pages { display: grid !important; grid-template-columns: repeat(4, auto); gap: 8px; width: max-content; zoom: 0.5; }
        .pagedjs_page { box-shadow: 0 0 0 2px #888; }`,
    });
    for (let first = 0; first < pages; first += 8) {
      await page.evaluate(([a, b]) => {
        document.querySelectorAll('.pagedjs_page').forEach((p, i) => (p.style.display = i >= a && i < b ? '' : 'none'));
      }, [first, first + 8]);
      await page.screenshot({ path: join(process.env.PDF_SHOTS, `sheet-${String(first + 1).padStart(3, '0')}.png`), fullPage: true });
    }
  }
} finally {
  await browser.close();
  server.kill();
}
