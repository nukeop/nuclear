import type { Preview } from '@storybook/react-vite';

import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/bricolage-grotesque/800.css';
import '@fontsource/space-mono/400.css';
import '@nuclearplayer/tailwind-config';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#f2f0f0',
        },
        {
          name: 'dark',
          value: '#000000',
        },
      ],
    },
  },
};

export default preview;
