import { object, string, boolean, number, InferType } from 'yup';
import { paginationRequestSchema } from 'src/schemas/pagination.schemas';

export const nonConformanceLogFormSchema = object({
  product: string().trim().required().max(70),
  address: string().trim().required().max(70),
  receiving_date: string().trim().required(),
  map_record: string().trim().nullable().max(30).default(null),
  details: string().trim().required(),
  deadline: string().trim().required().max(70),
  is_approved: boolean().required().default(false),
  notes: string().trim().nullable().max(5000).default(null),
});

export type NonConformanceLogForm = InferType<typeof nonConformanceLogFormSchema>;

export const nonConformanceLogListItemSchema = object({
  id: number().required(),
  product: string().required(),
  address: string().required(),
  receiving_date: string().required(),
  is_approved: boolean().required(),
  created_at: string().required(),
});

export type NonConformanceLogListItem = InferType<typeof nonConformanceLogListItemSchema>;

export const nonConformanceLogListRequestSchema = paginationRequestSchema;
export type NonConformanceLogListRequest = InferType<typeof nonConformanceLogListRequestSchema>;

export const nonConformanceLogDetailSchema = nonConformanceLogFormSchema.shape({
  id: number().required(),
  created_at: string().required(),
  updated_at: string().required(),
});

export type NonConformanceLogDetail = InferType<typeof nonConformanceLogDetailSchema>;
