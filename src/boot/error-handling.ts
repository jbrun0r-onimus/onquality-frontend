import { boot } from 'quasar/wrappers';
import { appHandleError } from 'src/helpers/error-handling.helpers';

export default boot(({ app }) => {
  app.config.errorHandler = appHandleError;

  window.addEventListener('unhandledrejection', (event) => {
    appHandleError(event.reason);
  });
});
