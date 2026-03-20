import { object, string, number, InferType } from 'yup';
import { paginationRequestSchema } from 'src/schemas/pagination.schemas';

export const cleaningSuppliesControlFormSchema = object({
  product: string().trim().required().max(70),
  execution_date: string().trim().required(),
  weight: number().required().positive(),
  production_order: string().trim().required().max(70),
  reuse_date: string().trim().nullable().default(null),
  reuse_weight: number().nullable().positive().default(null),
  reuse_production_order: string().trim().nullable().max(70).default(null),
});

export type CleaningSuppliesControlForm = InferType<typeof cleaningSuppliesControlFormSchema>;

export const cleaningSuppliesControlListItemSchema = object({
  id: number().required(),
  product: string().required(),
  execution_date: string().required(),
  weight: string().required(),
  production_order: string().required(),
  created_at: string().required(),
});

export type CleaningSuppliesControlListItem = InferType<typeof cleaningSuppliesControlListItemSchema>;

export const cleaningSuppliesControlListRequestSchema = paginationRequestSchema;
export type CleaningSuppliesControlListRequest = InferType<typeof cleaningSuppliesControlListRequestSchema>;

export const cleaningSuppliesControlDetailSchema = cleaningSuppliesControlFormSchema.shape({
  id: number().required(),
  created_at: string().required(),
  updated_at: string().required(),
});

export type CleaningSuppliesControlDetail = InferType<typeof cleaningSuppliesControlDetailSchema>;
