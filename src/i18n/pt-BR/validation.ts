export const validation = {
  mixed: {
    default: 'Não é válido',
    required: 'Campo obrigatório',
    oneOf: 'Deve ser um dos seguintes valores: {values}',
    notOneOf: 'Não deve ser um dos seguintes valores: {values}',
    type: 'Deve ser do tipo {type}',
  },
  string: {
    length:
      'Deve ter exatamente 1 caractere | Deve ter exatamente {n} caracteres',
    min: 'Deve ter pelo menos 1 caractere | Deve ter pelo menos {n} caracteres',
    max: 'Deve ter no máximo 1 caractere | Deve ter no máximo {n} caracteres',
    matches: 'Deve corresponder ao seguinte: "{regex}"',
    email: 'Deve ser um e-mail válido',
    url: 'Deve ser uma URL válida',
    trim: 'Não deve conter espaços no início ou no fim.',
    lowercase: 'Deve estar em mínusculo',
    uppercase: 'Deve estar em maiúsculo',
  },
  number: {
    min: 'Deve ser no mínimo {min}',
    max: 'Deve ser no máximo {max}',
    valid: 'Deve ser um número válido',
    lessThan: 'Deve ser menor que {less}',
    moreThan: 'Deve ser maior que {more}',
    positive: 'Deve ser um número positivo',
    negative: 'Deve ser um número negativo',
    integer: 'Deve ser um número inteiro',
  },
  date: {
    min: 'Deve ser maior que a data {min}',
    max: 'Deve ser menor que a data {max}',
    valid: 'Deve ser uma data válida',
    notPast: 'Não deve ser uma data passada',
  },
  object: {
    noUnknown: 'Não deve ter chaves não especificadas na forma do objeto',
  },
  array: {
    length: 'Deve ter exatamente 1 item | Deve ter exatamente {n} itens',
    min: 'Deve ter pelo menos 1 item | Deve ter pelo menos {n} itens',
    max: 'Deve ter no máximo 1 item | Deve ter no máximo {n} itens',
  },
  boolean: {
    isValue: 'Deve ser {value}',
  },
  cpf: 'Deve ser um CPF válido',
};
