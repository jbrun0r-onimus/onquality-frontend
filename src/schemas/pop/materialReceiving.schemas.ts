import { object, string, boolean, number, mixed, InferType } from 'yup';
import { paginationRequestSchema } from 'src/schemas/pagination.schemas';

const questionField = () => boolean().nullable().default(null);

export const materialReceivingFormSchema = object({
  supplier: string().trim().required().max(70),
  product: string().trim().required().max(70),
  receiving_date: string().trim().required(),
  batch_number: string().trim().required().max(70),
  weight: number().required().positive(),
  expiration_date: string().trim().required(),
  invoice: string().trim().required().max(30),
  performed_by: string().trim().required().max(70),
  question1: questionField(),
  question2: questionField(),
  question3: questionField(),
  question4: questionField(),
});

export type MaterialReceivingForm = InferType<typeof materialReceivingFormSchema>;

export const materialReceivingListItemSchema = object({
  id: number().required(),
  supplier: string().trim().required(),
  product: string().trim().required(),
  receiving_date: string().required(),
  batch_number: string().trim().required(),
  invoice: string().trim().required(),
  performed_by: string().trim().required(),
  created_at: string().required(),
});

export type MaterialReceivingListItem = InferType<typeof materialReceivingListItemSchema>;

export const materialReceivingListRequestSchema = paginationRequestSchema;
export type MaterialReceivingListRequest = InferType<typeof materialReceivingListRequestSchema>;

export const materialReceivingDetailSchema = materialReceivingFormSchema.shape({
  id: number().required(),
  created_at: string().required(),
  updated_at: string().required(),
});

export type MaterialReceivingDetail = InferType<typeof materialReceivingDetailSchema>;
