import { RouteRecordRaw } from 'vue-router';
import { onlyAuthenticated, onlyUnauthenticated } from 'src/router/guards';
import { popRoute, popPrintRoute } from 'src/router/routes/pop.routes';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: onlyAuthenticated,
    children: [
      {
        path: '',
        redirect: '/pop/cargo-inspection',
      },
      popRoute,
    ],
    meta: {
      name: 'root',
      hideInBreadcrumb: true,
    },
  },
  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    beforeEnter: onlyUnauthenticated,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('pages/auth/LoginPage.vue'),
        meta: {
          name: (i18n: any) => i18n.t('auth.login.title'),
          icon: 'o_login',
        },
      },
    ],
  },
  popPrintRoute,
  {
    path: '/:catchAll(.*)*',
    redirect: '/pop/cargo-inspection',
  },
];
