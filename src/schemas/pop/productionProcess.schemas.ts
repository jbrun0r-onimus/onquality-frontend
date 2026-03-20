import { object, string, number, InferType } from 'yup';
import { paginationRequestSchema } from 'src/schemas/pagination.schemas';

export const productionProcessFormSchema = object({
  frequency: string().trim().required().max(30).default('Diário'),
  product: string().trim().nullable().max(70).default(null),
  execution_date: string().trim().nullable().default(null),
  parameter: string().trim().nullable().max(70).default(null),
  note: string().trim().nullable().max(5000).default(null),
  employee_name: string().trim().nullable().max(70).default(null),
});

export type ProductionProcessForm = InferType<typeof productionProcessFormSchema>;

export const productionProcessListItemSchema = object({
  id: number().required(),
  frequency: string().required(),
  product: string().nullable().default(null),
  execution_date: string().nullable().default(null),
  employee_name: string().nullable().default(null),
  created_at: string().required(),
});

export type ProductionProcessListItem = InferType<typeof productionProcessListItemSchema>;

export const productionProcessListRequestSchema = paginationRequestSchema;
export type ProductionProcessListRequest = InferType<typeof productionProcessListRequestSchema>;

export const productionProcessDetailSchema = productionProcessFormSchema.shape({
  id: number().required(),
  created_at: string().required(),
  updated_at: string().required(),
});

export type ProductionProcessDetail = InferType<typeof productionProcessDetailSchema>;
