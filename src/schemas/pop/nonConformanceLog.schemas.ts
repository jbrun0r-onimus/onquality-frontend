import { object, string, boolean, number, InferType } from 'yup';
import { paginationRequestSchema } from 'src/schemas/pagination.schemas';

export const nonConformanceLogFormSchema = object({
  product: string().trim().required().max(70),
  supplier: string().trim().nullable().max(70).default(null),
  address: string().trim().nullable().max(70).default(null),
  receiving_date: string().trim().required(),
  map_record: string().trim().nullable().max(30).default(null),
  details: string().trim().required(),
  corrective_action: string().trim().nullable().max(5000).default(null),
  deadline: string().trim().nullable().max(70).default(null),
  is_approved: boolean().required().default(false),
  notes: string().trim().nullable().max(5000).default(null),
});

export type NonConformanceLogForm = InferType<typeof nonConformanceLogFormSchema>;

export const nonConformanceLogListItemSchema = object({
  id: number().required(),
  product: string().required(),
  address: string().nullable().default(null),
  receiving_date: string().required(),
  is_approved: boolean().nullable().default(null),
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
