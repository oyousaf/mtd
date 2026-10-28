// @ts-check
import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://mtd.legxcysol.dev',
  adapter: vercel(),
  integrations: [react(), sitemap()],
  prefetch: { prefetchAll: true },
  env: {
    schema: {
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      ENQUIRY_TO: envField.string({ context: 'server', access: 'public', default: 'mtdbookkeeping.uk@gmail.com' }),
      ENQUIRY_FROM: envField.string({ context: 'server', access: 'public', default: 'MTD Trade Books <enquiries@legxcysol.dev>' }),
    },
  },
  vite: { plugins: [tailwindcss()] },
});
