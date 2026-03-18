import axios, { AxiosError } from 'axios';
import { globalI18n } from 'src/boot/i18n';
import { trimObject } from 'src/helpers/misc.helpers';
import { useAuthStore } from 'src/stores/auth.store';

export const baseURL = window.Cypress
  ? 'http://example.org'
  : import.meta.env.VITE_API_BASE_URL;

export const authBaseURL = window.Cypress
  ? 'http://example.org'
  : import.meta.env.VITE_AUTH_API_BASE_URL || import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL,
});

export const authApi = axios.create({
  baseURL: authBaseURL,
});

function addRequestInterceptor(instance: ReturnType<typeof axios.create>) {
  instance.interceptors.request.use((config) => {
    config.headers['Accept-Language'] = globalI18n.locale.value;

    const token = useAuthStore().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;

    if (config.params && config.meta?.cleanParams !== false)
      config.params = trimObject(config.params);

    return config;
  });
}

function addResponseInterceptor(instance: ReturnType<typeof axios.create>) {
  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (
        error.response?.status === 401 &&
        error.config?.meta?.redirectOn401 !== false
      ) {
        useAuthStore().logout();
      }

      return Promise.reject(error);
    }
  );
}

addRequestInterceptor(api);
addResponseInterceptor(api);
addRequestInterceptor(authApi);
addResponseInterceptor(authApi);
