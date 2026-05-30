import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://nuclearplayer.com',
  output: 'static',
  integrations: [react(), mdx(), sitemap(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
});
