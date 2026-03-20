import { object, boolean, number, string, InferType } from 'yup';
import { paginationRequestSchema } from 'src/schemas/pagination.schemas';

const q = () => boolean().nullable().default(null);

export const checkListPestFormSchema = object({
  question1: q(), question2: q(), question3: q(), question4: q(),
  question5: q(), question6: q(), question7: q(), question8: q(),
  question9: q(), question10: q(), question11: q(), question12: q(),
  question13: q(), question14: q(), question15: q(), question16: q(),
  question17: q(),
  note: string().trim().nullable().max(5000).default(null),
});

export type CheckListPestForm = InferType<typeof checkListPestFormSchema>;

export const checkListPestListItemSchema = object({
  id: number().required(),
  created_at: string().required(),
});

export type CheckListPestListItem = InferType<typeof checkListPestListItemSchema>;

export const checkListPestListRequestSchema = paginationRequestSchema;
export type CheckListPestListRequest = InferType<typeof checkListPestListRequestSchema>;

export const checkListPestDetailSchema = checkListPestFormSchema.shape({
  id: number().required(),
  created_at: string().required(),
  updated_at: string().required(),
});

export type CheckListPestDetail = InferType<typeof checkListPestDetailSchema>;
