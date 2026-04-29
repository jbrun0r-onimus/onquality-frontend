import { object, string, boolean, number, InferType } from 'yup';
import { paginationRequestSchema } from 'src/schemas/pagination.schemas';

export const maintenanceEquipmentsFormSchema = object({
  execution_date: string().trim().required(),
  is_corrective: boolean().required().default(false),
  descriptions: string().trim().required().max(200),
  executed_by: string().trim().required().max(70),
  is_ok: boolean().nullable().default(null),
});

export type MaintenanceEquipmentsForm = InferType<typeof maintenanceEquipmentsFormSchema>;

export const maintenanceEquipmentsListItemSchema = object({
  id: number().required(),
  execution_date: string().required(),
  is_corrective: boolean().required(),
  descriptions: string().required(),
  executed_by: string().required(),
  is_ok: boolean().nullable().default(null),
  created_at: string().required(),
});

export type MaintenanceEquipmentsListItem = InferType<typeof maintenanceEquipmentsListItemSchema>;

export const maintenanceEquipmentsListRequestSchema = paginationRequestSchema;
export type MaintenanceEquipmentsListRequest = InferType<typeof maintenanceEquipmentsListRequestSchema>;

export const maintenanceEquipmentsDetailSchema = maintenanceEquipmentsFormSchema.shape({
  id: number().required(),
  created_at: string().required(),
  updated_at: string().required(),
});

export type MaintenanceEquipmentsDetail = InferType<typeof maintenanceEquipmentsDetailSchema>;

export type MaintenanceEquipmentsMonthlyItem = {
  id: number;
  execution_date: string | null;
  is_corrective: boolean | null;
  descriptions: string | null;
  executed_by: string | null;
  is_ok: boolean | null;
};

export type MaintenanceEquipmentsMonthlyResponse = {
  month: number;
  year: number;
  items: MaintenanceEquipmentsMonthlyItem[];
};
