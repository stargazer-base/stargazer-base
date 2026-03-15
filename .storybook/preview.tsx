import type { Preview } from '@storybook/react';
import '../src/app/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        default: { name: 'blue-950', value: '#172554' },
        dark: { name: 'Dark', value: '#333' },
      },
    },
  },
};

export default preview;
