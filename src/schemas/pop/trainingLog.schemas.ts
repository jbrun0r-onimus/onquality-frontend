import { object, string, boolean, number, InferType } from 'yup';
import { paginationRequestSchema } from 'src/schemas/pagination.schemas';

export const trainingLogParticipantSchema = object({
  employee_name: string().trim().nullable().default(null),
  is_present: boolean().nullable().default(true),
});

export type TrainingLogParticipant = InferType<typeof trainingLogParticipantSchema>;

export const trainingLogFormSchema = object({
  execution_date: string().trim().nullable().default(null),
  instructor: string().trim().nullable().default(null),
  professional_formation: string().trim().nullable().default(null),
  programmatic_content: string().trim().nullable().default(null),
  workload: string().trim().nullable().default(null),
  note: string().trim().nullable().default(null),
});

export type TrainingLogForm = InferType<typeof trainingLogFormSchema>;

export const trainingLogListItemSchema = object({
  id: number().required(),
  execution_date: string().nullable().default(null),
  instructor: string().nullable().default(null),
  professional_formation: string().nullable().default(null),
  programmatic_content: string().nullable().default(null),
  workload: string().nullable().default(null),
  note: string().nullable().default(null),
  participant_count: number().default(0),
});

export type TrainingLogListItem = InferType<typeof trainingLogListItemSchema>;

export const trainingLogListRequestSchema = paginationRequestSchema;
export type TrainingLogListRequest = InferType<typeof trainingLogListRequestSchema>;

export type TrainingLogParticipantDetail = {
  id: number;
  training_log_id: number;
  employee_name: string | null;
  is_present: boolean | null;
};

export type TrainingLogDetail = TrainingLogForm & {
  id: number;
  participants: TrainingLogParticipantDetail[];
};
