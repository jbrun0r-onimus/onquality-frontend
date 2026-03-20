import { object, string, boolean, number, InferType } from 'yup';
import { paginationRequestSchema } from 'src/schemas/pagination.schemas';

const q = () => boolean().nullable().default(null);

export const maintenanceControlFormSchema = object({
  employee_name: string().trim().required().max(70),
  box_number: number().required().positive().integer(),
  execution_date: string().trim().required(),
  question1: q(),
  question2: q(),
  question3: q(),
});

export type MaintenanceControlForm = InferType<typeof maintenanceControlFormSchema>;

export const maintenanceControlListItemSchema = object({
  id: number().required(),
  employee_name: string().required(),
  box_number: number().required(),
  execution_date: string().required(),
  created_at: string().required(),
});

export type MaintenanceControlListItem = InferType<typeof maintenanceControlListItemSchema>;

export const maintenanceControlListRequestSchema = paginationRequestSchema;
export type MaintenanceControlListRequest = InferType<typeof maintenanceControlListRequestSchema>;

export const maintenanceControlDetailSchema = maintenanceControlFormSchema.shape({
  id: number().required(),
  created_at: string().required(),
  updated_at: string().required(),
});

export type MaintenanceControlDetail = InferType<typeof maintenanceControlDetailSchema>;
