import { VueQueryPlugin } from '@tanstack/vue-query';
import { boot } from 'quasar/wrappers';
import { appHandleError } from 'src/helpers/error-handling.helpers';
import { createShouldRetry } from 'src/helpers/query.helpers';

export const defaultNumberOfRetries = 3;

export default boot(({ app }) => {
  app.use(VueQueryPlugin, {
    queryClientConfig: {
      defaultOptions: {
        mutations: {
          onError: appHandleError,
        },
        queries: {
          retry: createShouldRetry(defaultNumberOfRetries),
          onError: appHandleError,
        },
      },
    },
  });
});
