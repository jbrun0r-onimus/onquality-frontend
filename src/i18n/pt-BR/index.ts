import { auth } from './auth';
import { common } from './common';
import { pop } from './pop';
import { validation } from './validation';

import quasarPtBrLang from 'quasar/lang/pt-BR';

const ptBr = {
  auth,
  common,
  pop,
  validation,
  quasar: quasarPtBrLang,
};

export default ptBr;
