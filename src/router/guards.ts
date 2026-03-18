import { Loading } from 'quasar';
import { globalI18n } from 'src/boot/i18n';
import { usePermissionsCan } from 'src/composables/permission.composables';
import { showErrorFeedback } from 'src/helpers/feedback.helpers';
import { useAuthStore } from 'src/stores/auth.store';
import { NavigationGuardWithThis, NavigationHookAfter } from 'vue-router';

export const onlyAuthenticated: NavigationGuardWithThis<undefined> = (to) => {
  const authStore = useAuthStore();
  if (!authStore.isLoggedIn)
    return { name: 'login', query: { redirect: to.path } };
};

export const onlyUnauthenticated: NavigationGuardWithThis<undefined> = () => {
  const authStore = useAuthStore();
  if (authStore.isLoggedIn) return { name: 'pop.cargoInspection' };
};

export const hasPermission: NavigationGuardWithThis<undefined> = async (to) => {
  if (!to.meta.permission) return;

  const can = usePermissionsCan();

  if (to.meta.permission(can.value)) return;

  showErrorFeedback(globalI18n.t('common.feedback.notAllowed'));

  return { name: 'pop.cargoInspection' };
};

let cancelLoading: (() => void) | undefined;

export const loadingStart: NavigationGuardWithThis<undefined> = () => {
  cancelLoading?.();
  cancelLoading = Loading.show();
};

export const loadingFinish: NavigationHookAfter = () => {
  cancelLoading?.();
  cancelLoading = undefined;
};
