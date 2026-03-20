import { object, string, number, InferType } from 'yup';
import { paginationRequestSchema } from 'src/schemas/pagination.schemas';

export const changeWaterCoolerFilterFormSchema = object({
  employee_signature: string().trim().required().max(70),
  execution_date: string().trim().required(),
  note: string().trim().nullable().max(5000).default(null),
});

export type ChangeWaterCoolerFilterForm = InferType<typeof changeWaterCoolerFilterFormSchema>;

export const changeWaterCoolerFilterListItemSchema = object({
  id: number().required(),
  employee_signature: string().required(),
  execution_date: string().required(),
  created_at: string().required(),
});

export type ChangeWaterCoolerFilterListItem = InferType<typeof changeWaterCoolerFilterListItemSchema>;

export const changeWaterCoolerFilterListRequestSchema = paginationRequestSchema;
export type ChangeWaterCoolerFilterListRequest = InferType<typeof changeWaterCoolerFilterListRequestSchema>;

export const changeWaterCoolerFilterDetailSchema = changeWaterCoolerFilterFormSchema.shape({
  id: number().required(),
  created_at: string().required(),
  updated_at: string().required(),
});

export type ChangeWaterCoolerFilterDetail = InferType<typeof changeWaterCoolerFilterDetailSchema>;
