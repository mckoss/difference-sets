import { unified } from '@astrojs/markdown-remark';
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import rehypeGlossary from './src/lib/rehypeGlossary.ts';

const base = '/difference-sets';

export default defineConfig({
  site: 'https://mckoss.com',
  base,
  trailingSlash: 'always',
  telemetry: false,
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      // Glossary links go in after KaTeX, so math is already rendered and skipped.
      rehypePlugins: [rehypeKatex, [rehypeGlossary, { base: `${base}/` }]],
    }),
  },
});
