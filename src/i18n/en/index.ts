import { LocaleDict } from 'src/i18n';
import { auth } from './auth';
import { common } from './common';
import { pop } from './pop';
import { validation } from './validation';

import quasarEnLang from 'quasar/lang/en-US';

const en: LocaleDict = {
  auth,
  common,
  pop,
  validation,
  quasar: quasarEnLang,
};

export default en;
