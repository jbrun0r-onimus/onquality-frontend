import { object, string, boolean, number, InferType } from 'yup';
import { paginationRequestSchema } from 'src/schemas/pagination.schemas';

const q = () => boolean().nullable().default(null);

export const cleaningEfficiencyFormSchema = object({
  execution_date: string().trim().required(),
  question1: q(), question2: q(), question3: q(), question4: q(),
  question5: q(), question6: q(), question7: q(), question8: q(),
  question9: q(), question10: q(), question11: q(), question12: q(),
  note: string().trim().nullable().max(5000).default(null),
});

export type CleaningEfficiencyForm = InferType<typeof cleaningEfficiencyFormSchema>;

export const cleaningEfficiencyListItemSchema = object({
  id: number().required(),
  execution_date: string().required(),
  note: string().nullable().default(null),
  created_at: string().required(),
});

export type CleaningEfficiencyListItem = InferType<typeof cleaningEfficiencyListItemSchema>;

export const cleaningEfficiencyListRequestSchema = paginationRequestSchema;
export type CleaningEfficiencyListRequest = InferType<typeof cleaningEfficiencyListRequestSchema>;

export const cleaningEfficiencyDetailSchema = cleaningEfficiencyFormSchema.shape({
  id: number().required(),
  created_at: string().required(),
  updated_at: string().required(),
});

export type CleaningEfficiencyDetail = InferType<typeof cleaningEfficiencyDetailSchema>;
