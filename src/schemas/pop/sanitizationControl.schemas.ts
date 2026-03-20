import { object, string, boolean, number, InferType } from 'yup';
import { paginationRequestSchema } from 'src/schemas/pagination.schemas';

const q = () => boolean().nullable().default(null);

export const sanitizationControlFormSchema = object({
  employee_name: string().trim().required().max(70),
  box_number: number().required().positive().integer(),
  execution_date: string().trim().required(),
  next_execution_date: string().trim().required(),
  question1: q(),
});

export type SanitizationControlForm = InferType<typeof sanitizationControlFormSchema>;

export const sanitizationControlListItemSchema = object({
  id: number().required(),
  employee_name: string().required(),
  box_number: number().required(),
  execution_date: string().required(),
  created_at: string().required(),
});

export type SanitizationControlListItem = InferType<typeof sanitizationControlListItemSchema>;

export const sanitizationControlListRequestSchema = paginationRequestSchema;
export type SanitizationControlListRequest = InferType<typeof sanitizationControlListRequestSchema>;

export const sanitizationControlDetailSchema = sanitizationControlFormSchema.shape({
  id: number().required(),
  created_at: string().required(),
  updated_at: string().required(),
});

export type SanitizationControlDetail = InferType<typeof sanitizationControlDetailSchema>;
