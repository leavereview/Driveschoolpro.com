import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { buildLastmodMap, lastmodSerializer } from './scripts/sitemap-lastmod.mjs';

const lastmod = buildLastmodMap(dirname(fileURLToPath(import.meta.url)));

export default defineConfig({
  site: 'https://driveschoolpro.com',
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/blog/tag/') && !page.includes('/ads/') && !/\/start\//.test(page),
      serialize: lastmodSerializer(lastmod),
    }),
    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
          collapseWhitespace: true,
          removeComments: true,
        }
      },
      Image: false, // We'll handle images separately
      JavaScript: true,
      SVG: true,
    })
  ],
  build: {
    inlineStylesheets: 'auto',
    assets: '_astro'
  },
  vite: {
    build: {
      minify: 'esbuild',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        }
      }
    }
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  }
});
