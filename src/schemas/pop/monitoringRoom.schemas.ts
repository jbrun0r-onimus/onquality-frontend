import { object, string, boolean, number, InferType } from 'yup';
import { paginationRequestSchema } from 'src/schemas/pagination.schemas';

export const monitoringRoomFormSchema = object({
  execution_date: string().trim().required(),
  location: string().trim().required().max(40),
  is_cleaning: boolean().nullable().default(null),
});

export type MonitoringRoomForm = InferType<typeof monitoringRoomFormSchema>;

export const monitoringRoomListItemSchema = object({
  id: number().required(),
  execution_date: string().required(),
  location: string().required(),
  is_cleaning: boolean().nullable().default(null),
  created_at: string().required(),
});

export type MonitoringRoomListItem = InferType<typeof monitoringRoomListItemSchema>;

export const monitoringRoomListRequestSchema = paginationRequestSchema;
export type MonitoringRoomListRequest = InferType<typeof monitoringRoomListRequestSchema>;

export const monitoringRoomDetailSchema = monitoringRoomFormSchema.shape({
  id: number().required(),
  created_at: string().required(),
  updated_at: string().required(),
});

export type MonitoringRoomDetail = InferType<typeof monitoringRoomDetailSchema>;

export type MonitoringRoomMonthlyRow = {
  location: string;
  days: Record<number, boolean | null>;
};

export type MonitoringRoomMonthlyResponse = {
  month: number;
  year: number;
  days_in_month: number;
  rows: MonitoringRoomMonthlyRow[];
};
