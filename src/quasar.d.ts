/* eslint-disable */
import { Request } from 'miragejs';
import { TranslationComposer } from 'src/boot/i18n';
import { createCanTree } from 'src/composables/permission.composables';

// Forces TS to apply `@quasar/app-vite` augmentations of `quasar` package
// Removing this would break `quasar/wrappers` imports as those typings are declared
//  into `@quasar/app-vite`
// As a side effect, since `@quasar/app-vite` reference `quasar` to augment it,
//  this declaration also apply `quasar` own
//  augmentations (eg. adds `$q` into Vue component context)
/// <reference types="@quasar/app-vite" />

declare module 'vue-router' {
  interface RouteMeta {
    icon?: string;
    name: string | ((i18n: TranslationComposer) => string);
    hideInBreadcrumb?: boolean;
    nonClickableInBreadcrumb?: boolean;
    permission?: (can: ReturnType<typeof createCanTree>) => boolean;
  }
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    meta?: {
      /** Defaults to `true` */
      notify?: boolean;
      /** Defaults to `true` */
      redirectOn401?: boolean;
      /** Defaults to `true`, remove params that have a `undefined` or empty string value */
      cleanParams?: boolean;
    };
  }
}

declare global {
  interface Window {
    Cypress?: Cypress.Cypress;
    handleFromCypress?: (req: Request) => Promise<[number, Headers, any]>;
  }
}

declare module 'yup' {
  interface DateSchema {
    notPast(): DateSchema;
    acceptLocalFormat(): DateSchema;
  }
  interface StringSchema {
    cpf(): StringSchema;
  }
  interface ObjectSchema<TIn, TContext, TDefault, TFlags> {
    overrideDefaults(
      defaults: Partial<TIn>
    ): ObjectSchema<TIn, TContext, TDefault, TFlags>;
  }
}
