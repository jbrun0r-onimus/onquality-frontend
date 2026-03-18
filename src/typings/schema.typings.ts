import { TypedSchema } from 'vee-validate';
import { Schema, InferType } from 'yup';

type StringInferedTypes = Date | number;

export type FieldIn<T> = T extends StringInferedTypes
  ? string | Exclude<T, StringInferedTypes>
  : T;

export type SchemaIn<TSchema extends Schema> = {
  [K in keyof InferType<TSchema>]: FieldIn<InferType<TSchema>[K]>;
};

export type TypeSchema<TSchema extends Schema> = TSchema &
  TypedSchema<SchemaIn<TSchema>, InferType<TSchema>>;
