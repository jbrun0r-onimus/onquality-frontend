export const validation: typeof import('src/i18n/pt-BR/validation').validation =
  {
    mixed: {
      default: 'Is invalid',
      required: 'Required field',
      oneOf: 'Should be one of the following values: {values}',
      notOneOf: 'Should not be one of the following values: {values}',
      type: 'Should be of type {type}',
    },
    string: {
      length: 'Should have exactly {length} characters',
      min: 'Should have at least {min} characters',
      max: 'Should have at most {max} characters',
      matches: 'Should match the following: "{regex}"',
      email: 'Should be a valid email',
      url: 'Should be a valid URL',
      trim: 'Should not have spaces at the beginning or end',
      lowercase: 'Should be lowercase',
      uppercase: 'Should be uppercase',
    },
    number: {
      min: 'Should be at least {min}',
      max: 'Should be at most {max}',
      valid: 'Should be a valid number',
      lessThan: 'Should be less than {less}',
      moreThan: 'Should be more than {more}',
      positive: 'Should be a positive number',
      negative: 'Should be a negative number',
      integer: 'Should be an integer',
    },
    date: {
      min: 'Should be greater than the date {min}',
      max: 'Should be less than the date {max}',
      valid: 'Should be a valid date',
      notPast: 'Should not be a past date',
    },
    object: {
      noUnknown: 'Should not have unspecified keys in the shape of an object',
    },
    array: {
      length: 'Should have exactly {length} items',
      min: 'Should have at least {min} items',
      max: 'Should have at most {max} items',
    },
    boolean: {
      isValue: 'Should be {value}',
    },
    cpf: 'Should be a valid CPF',
  };
