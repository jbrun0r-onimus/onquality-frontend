import { object, string, boolean, number, InferType } from 'yup';
import { paginationRequestSchema } from 'src/schemas/pagination.schemas';

export const monitoringEquipmentsFormSchema = object({
  execution_date: string().trim().required(),
  equipment: string().trim().required().max(40),
  is_cleaning: boolean().nullable().default(null),
});

export type MonitoringEquipmentsForm = InferType<typeof monitoringEquipmentsFormSchema>;

export const monitoringEquipmentsListItemSchema = object({
  id: number().required(),
  execution_date: string().required(),
  equipment: string().required(),
  is_cleaning: boolean().nullable().default(null),
  created_at: string().required(),
});

export type MonitoringEquipmentsListItem = InferType<typeof monitoringEquipmentsListItemSchema>;

export const monitoringEquipmentsListRequestSchema = paginationRequestSchema;
export type MonitoringEquipmentsListRequest = InferType<typeof monitoringEquipmentsListRequestSchema>;

export const monitoringEquipmentsDetailSchema = monitoringEquipmentsFormSchema.shape({
  id: number().required(),
  created_at: string().required(),
  updated_at: string().required(),
});

export type MonitoringEquipmentsDetail = InferType<typeof monitoringEquipmentsDetailSchema>;

export type MonitoringEquipmentsMonthlyRow = {
  equipment: string;
  days: Record<number, boolean | null>;
};

export type MonitoringEquipmentsMonthlyResponse = {
  month: number;
  year: number;
  days_in_month: number;
  rows: MonitoringEquipmentsMonthlyRow[];
};
