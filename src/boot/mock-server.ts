import { boot } from 'quasar/wrappers';
import { baseURL } from 'src/services/api.service';

export default boot(() => {
  if (window.Cypress) {
    return import('mocks/server').then(({ startMockServerProxy }) => {
      startMockServerProxy(baseURL);
    });
  } else if (import.meta.env.VITE_USE_MOCK_SERVER?.toLowerCase() === 'true') {
    return import('mocks/server').then(({ startMockServer }) => {
      startMockServer(baseURL);
    });
  }
});
