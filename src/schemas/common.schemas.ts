import { object, string, date, InferType } from 'yup';

export const baseEntitySchema = object({
  id: string().required(),
  createdAt: date().required(),
  updatedAt: date().required(),
});

export const idAndNameSchema = object({
  id: string().required(),
  name: string().required(),
});

export type IdAndName = InferType<typeof idAndNameSchema>;
