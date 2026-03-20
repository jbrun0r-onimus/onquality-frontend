import { object, string, number, InferType } from 'yup';
import { paginationRequestSchema } from 'src/schemas/pagination.schemas';

export const waterCoolerSanitizationFormSchema = object({
  employee_signature: string().trim().required().max(70),
  execution_date: string().trim().required(),
  note: string().trim().nullable().max(5000).default(null),
});

export type WaterCoolerSanitizationForm = InferType<typeof waterCoolerSanitizationFormSchema>;

export const waterCoolerSanitizationListItemSchema = object({
  id: number().required(),
  employee_signature: string().required(),
  execution_date: string().required(),
  created_at: string().required(),
});

export type WaterCoolerSanitizationListItem = InferType<typeof waterCoolerSanitizationListItemSchema>;

export const waterCoolerSanitizationListRequestSchema = paginationRequestSchema;
export type WaterCoolerSanitizationListRequest = InferType<typeof waterCoolerSanitizationListRequestSchema>;

export const waterCoolerSanitizationDetailSchema = waterCoolerSanitizationFormSchema.shape({
  id: number().required(),
  created_at: string().required(),
  updated_at: string().required(),
});

export type WaterCoolerSanitizationDetail = InferType<typeof waterCoolerSanitizationDetailSchema>;
