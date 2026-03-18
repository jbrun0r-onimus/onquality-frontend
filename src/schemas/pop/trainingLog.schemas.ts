import { object, string, boolean, number, InferType } from 'yup';
import { paginationRequestSchema } from 'src/schemas/pagination.schemas';

export const trainingLogFormSchema = object({
  employee_name: string().trim().required().max(70),
  is_present: boolean().required().default(false),
});

export type TrainingLogForm = InferType<typeof trainingLogFormSchema>;

export const trainingLogListItemSchema = object({
  id: number().required(),
  employee_name: string().required(),
  is_present: boolean().required(),
});

export type TrainingLogListItem = InferType<typeof trainingLogListItemSchema>;

export const trainingLogListRequestSchema = paginationRequestSchema;
export type TrainingLogListRequest = InferType<typeof trainingLogListRequestSchema>;

export const trainingLogDetailSchema = trainingLogFormSchema.shape({
  id: number().required(),
});

export type TrainingLogDetail = InferType<typeof trainingLogDetailSchema>;
