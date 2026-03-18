import enFlag from 'assets/img/flags/us.svg';
import ptBrFlag from 'assets/img/flags/br.svg';

export const locales = {
  en: {
    label: 'English',
    loader: () => import('./en').then((m) => m.default),
    flag: enFlag,
  },
  'pt-BR': {
    label: 'Português',
    loader: () => import('./pt-BR').then((m) => m.default),
    flag: ptBrFlag,
  },
};

export type LocaleDict = typeof import('./pt-BR').default;
