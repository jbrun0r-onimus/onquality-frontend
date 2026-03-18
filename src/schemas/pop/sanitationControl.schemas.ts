import { object, string, boolean, number, InferType } from 'yup';
import { paginationRequestSchema } from 'src/schemas/pagination.schemas';

const q = () => boolean().nullable().default(null);

export const sanitationControlFormSchema = object({
  execution_date: string().trim().required(),
  question1: q(), question2: q(), question3: q(), question4: q(),
  question5: q(), question6: q(), question7: q(), question8: q(),
  question9: q(), question10: q(), question11: q(), question12: q(),
  question13: q(), question14: q(), question15: q(), question16: q(),
  question17: q(),
});

export type SanitationControlForm = InferType<typeof sanitationControlFormSchema>;

export const sanitationControlListItemSchema = object({
  id: number().required(),
  execution_date: string().required(),
  created_at: string().required(),
});

export type SanitationControlListItem = InferType<typeof sanitationControlListItemSchema>;

export const sanitationControlListRequestSchema = paginationRequestSchema;
export type SanitationControlListRequest = InferType<typeof sanitationControlListRequestSchema>;

export const sanitationControlDetailSchema = sanitationControlFormSchema.shape({
  id: number().required(),
  created_at: string().required(),
  updated_at: string().required(),
});

export type SanitationControlDetail = InferType<typeof sanitationControlDetailSchema>;
