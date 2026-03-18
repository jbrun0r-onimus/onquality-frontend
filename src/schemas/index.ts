import { parse } from 'date-fns';
import { globalI18n } from 'src/boot/i18n';
import { checkCpf } from 'src/helpers/validation.helpers';
import { Message, addMethod, date, object, setLocale, string } from 'yup';

function createYupMessageFactory<Extra extends Record<string, unknown>>(
  key: string
): Message<Extra> {
  return (params) => globalI18n.t('validation.' + key, params);
}

function createYupPluralizedMessageFactory<
  Extra extends Record<string, unknown>
>(key: string, pluralKey: string): Message<Extra> {
  return (params) =>
    globalI18n.t(
      'validation.' + key,
      params[pluralKey as keyof typeof params],
      params
    );
}

setLocale({
  mixed: {
    default: createYupMessageFactory('mixed.default'),
    required: createYupMessageFactory('mixed.required'),
    oneOf: createYupMessageFactory('mixed.oneOf'),
    notOneOf: createYupMessageFactory('mixed.notOneOf'),
    notType: ({ type }) => {
      if (type === 'number') return globalI18n.t('validation.number.valid');
      if (type === 'date') return globalI18n.t('validation.date.valid');
      return globalI18n.t('validation.mixed.type', { type });
    },
  },
  string: {
    length: createYupPluralizedMessageFactory('string.length', 'length'),
    min: createYupPluralizedMessageFactory('string.min', 'min'),
    max: createYupPluralizedMessageFactory('string.max', 'max'),
    matches: createYupMessageFactory('string.matches'),
    email: createYupMessageFactory('string.email'),
    url: createYupMessageFactory('string.url'),
    trim: createYupMessageFactory('string.trim'),
    lowercase: createYupMessageFactory('string.lowercase'),
    uppercase: createYupMessageFactory('string.uppercase'),
  },
  number: {
    min: createYupMessageFactory('number.min'),
    max: createYupMessageFactory('number.max'),
    lessThan: createYupMessageFactory('number.lessThan'),
    moreThan: createYupMessageFactory('number.moreThan'),
    positive: createYupMessageFactory('number.positive'),
    negative: createYupMessageFactory('number.negative'),
    integer: createYupMessageFactory('number.integer'),
  },
  date: {
    min: createYupMessageFactory('date.min'),
    max: createYupMessageFactory('date.max'),
  },
  boolean: {
    isValue: createYupMessageFactory('boolean.isValue'),
  },
  object: {
    noUnknown: createYupMessageFactory('object.noUnknown'),
  },
  array: {
    length: createYupPluralizedMessageFactory('array.length', 'length'),
    min: createYupPluralizedMessageFactory('array.min', 'min'),
    max: createYupPluralizedMessageFactory('array.max', 'max'),
  },
});

addMethod(date, 'notPast', function () {
  return this.test(
    'not-past',
    () => globalI18n.t('validation.date.notPast'),
    (value) => {
      if (!value) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return value >= today;
    }
  );
});

addMethod(date, 'acceptLocalFormat', function () {
  return this.transform((value, originalValue, ctx) => {
    if (ctx.isType(originalValue)) return value;
    return parse(
      originalValue,
      globalI18n.t('common.formats.date'),
      new Date()
    );
  });
});

addMethod(string, 'cpf', function () {
  return this.test(
    'cpf',
    () => globalI18n.t('validation.cpf'),
    (value) => {
      if (!value) return true;
      return checkCpf(value);
    }
  );
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
addMethod(object, 'overrideDefaults', function (defaults: Record<string, any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const overrideShape: Record<string, any> = {};
  for (const key in defaults) {
    const field = this.fields[key];
    if ('default' in field && typeof field.default === 'function') {
      overrideShape[key] = field.default(defaults[key]);
    }
  }

  return this.shape(overrideShape);
});
