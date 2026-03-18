import { Quasar } from 'quasar';
import { boot } from 'quasar/wrappers';
import { Composer, I18n, UseI18nOptions, createI18n } from 'vue-i18n';

import { locales } from 'src/i18n';

export type MessageLanguages = keyof typeof locales;
// Type-define 'pt-BR' as the master schema for the resource
export type MessageSchema = Awaited<
  ReturnType<(typeof locales)['pt-BR']['loader']>
>;

export type TranslationComposer = Composer<
  NonNullable<UseI18nOptions['messages']>,
  NonNullable<UseI18nOptions['datetimeFormats']>,
  NonNullable<UseI18nOptions['numberFormats']>,
  NonNullable<UseI18nOptions['locale']>
>;

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-interface */
declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}

  // define the datetime format schema
  export interface DefineDateTimeFormat {}

  // define the number format schema
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-interface */

function getPreferredLocales(): string[] {
  const preferedLocales = new Set<string>();

  const storedLocale = localStorage.getItem('locale');
  if (storedLocale) {
    preferedLocales.add(storedLocale);
  }

  if ('language' in navigator) {
    preferedLocales.add(navigator.language);
  }

  if ('languages' in navigator) {
    for (const language of navigator.languages) {
      preferedLocales.add(language);
    }
  }

  return Array.from(preferedLocales);
}

function getInitialLocale(fallback: MessageLanguages): MessageLanguages {
  const supportedLocales = Object.keys(locales);
  const preferedLocales = getPreferredLocales();

  for (const locale of preferedLocales) {
    // Exact match, ex: 'pt-BR' prefered and 'pt-BR' supported
    if (supportedLocales.includes(locale)) {
      return locale as MessageLanguages;
    }

    // Partial match, ex: 'en-GB' prefered and 'en' supported
    const splitLocale = locale.split('-');
    if (splitLocale.length > 1 && supportedLocales.includes(splitLocale[0])) {
      return splitLocale[0] as MessageLanguages;
    }

    // Partial match on the first part, ex: 'en-GB' prefered and 'en-US' supported
    for (const supportedLocale of supportedLocales) {
      if (supportedLocale.startsWith(splitLocale[0] + '-')) {
        return supportedLocale as MessageLanguages;
      }
    }
  }

  return fallback;
}

type AppI18n = I18n<
  {
    [key in MessageLanguages]: MessageSchema;
  },
  Record<string, never>,
  Record<string, never>,
  MessageLanguages,
  false
>;

export let globalI18n: AppI18n['global'];

export default boot(async ({ app }) => {
  const locale = getInitialLocale('pt-BR');

  const localeDict = await locales[locale].loader();
  Quasar.lang.set(localeDict.quasar);

  const i18n: AppI18n = createI18n({
    locale: locale,
    legacy: false,
    messages: {
      [locale]: localeDict,
    },
  });
  globalI18n = i18n.global;

  // Set i18n instance on app
  app.use(i18n);
});
