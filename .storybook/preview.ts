import { setup, type Preview } from '@storybook/vue3';
import { Quasar } from 'quasar';
import { createPinia } from 'pinia';

import 'quasar/dist/quasar.css';
import 'src/css/app.scss';

setup((app) => {
  app.use(Quasar, {});
  app.use(createPinia());
});

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
