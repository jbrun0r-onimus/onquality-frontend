import { parse, format } from 'date-fns';
import { api } from 'src/services/api.service';
import { PaginationResponse } from 'src/schemas/pagination.schemas';
import {
  MaintenanceEquipmentsForm,
  MaintenanceEquipmentsListItem,
  MaintenanceEquipmentsListRequest,
  MaintenanceEquipmentsDetail,
  MaintenanceEquipmentsMonthlyResponse,
} from 'src/schemas/pop/maintenanceEquipments.schemas';
import { definePaginatedQuery, defineQuery } from 'src/helpers/query.helpers';

function toIsoDate(ddmmyyyy: string): string {
  try {
    const parsed = parse(ddmmyyyy, 'dd/MM/yyyy', new Date());
    return format(parsed, "yyyy-MM-dd'T'HH:mm:ss");
  } catch {
    return ddmmyyyy;
  }
}

function fromIsoDate(apiDate: string): string {
  if (!apiDate) return '';
  try {
    const parsed = parse(apiDate, 'dd-MM-yyyy', new Date());
    if (parsed.getFullYear() < 100) parsed.setFullYear(parsed.getFullYear() + 2000);
    return format(parsed, 'dd/MM/yyyy');
  } catch {
    return apiDate;
  }
}

function preparePayload(data: MaintenanceEquipmentsForm) {
  return {
    ...data,
    execution_date: toIsoDate(data.execution_date),
  };
}

function toApiPagination(params: Partial<MaintenanceEquipmentsListRequest>) {
  const pageNumber = params.pageNumber ?? 1;
  const pageSize = params.pageSize ?? 10;
  return { offset: (pageNumber - 1) * pageSize, limit: pageSize };
}

function fromApiPagination<T>(
  items: T[],
  total: number,
  offset: number,
  limit: number
): PaginationResponse<T> {
  return {
    records: items,
    pageNumber: Math.floor(offset / limit) + 1,
    pageSize: limit,
    totalElements: total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function getMaintenanceEquipmentsList(
  params: Partial<MaintenanceEquipmentsListRequest>
): Promise<PaginationResponse<MaintenanceEquipmentsListItem>> {
  const response = await api.get('/onquality/maintenance_equipments/', {
    params: toApiPagination(params),
  });
  const { items, total, offset, limit } = response.data;
  return fromApiPagination<MaintenanceEquipmentsListItem>(items, total, offset, limit);
}

export async function getMaintenanceEquipmentItem(id: number): Promise<MaintenanceEquipmentsDetail> {
  const response = await api.get(`/onquality/maintenance_equipments/${id}`);
  const data = response.data;
  return {
    ...data,
    execution_date: fromIsoDate(data.execution_date),
  };
}

export async function createMaintenanceEquipment(data: MaintenanceEquipmentsForm) {
  await api.post('/onquality/maintenance_equipments/', preparePayload(data));
}

export async function updateMaintenanceEquipment(id: number, data: MaintenanceEquipmentsForm) {
  await api.put(`/onquality/maintenance_equipments/${id}`, preparePayload(data));
}

export async function deleteMaintenanceEquipment(id: number) {
  await api.delete(`/onquality/maintenance_equipments/${id}`);
}

export const maintenanceEquipmentsListQuery = definePaginatedQuery(
  'maintenance-equipments-list',
  getMaintenanceEquipmentsList
);

export const maintenanceEquipmentsDetailQuery = defineQuery(
  'maintenance-equipments-detail',
  getMaintenanceEquipmentItem
);

export async function getMaintenanceEquipmentsMonthly(
  month: number,
  year: number
): Promise<MaintenanceEquipmentsMonthlyResponse> {
  const response = await api.get('/onquality/maintenance_equipments/monthly', {
    params: { month, year },
  });
  return response.data;
}

export function fromIsoDateDisplay(apiDate: string | null | undefined): string {
  if (!apiDate) return '';
  try {
    const d = parse(apiDate, 'dd-MM-yyyy', new Date());
    if (d.getFullYear() < 100) d.setFullYear(d.getFullYear() + 2000);
    return format(d, 'dd/MM/yyyy');
  } catch { return apiDate ?? ''; }
}
