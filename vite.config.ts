import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/difference-sets/',
  test: { include: ['tests/unit/**/*.test.ts'] },
});
