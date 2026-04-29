import { parse, format } from 'date-fns';
import { api } from 'src/services/api.service';
import { PaginationResponse } from 'src/schemas/pagination.schemas';
import {
  MonitoringEquipmentsForm,
  MonitoringEquipmentsListItem,
  MonitoringEquipmentsListRequest,
  MonitoringEquipmentsDetail,
  MonitoringEquipmentsMonthlyResponse,
} from 'src/schemas/pop/monitoringEquipments.schemas';
import { definePaginatedQuery, defineQuery } from 'src/helpers/query.helpers';

/** Converts from DD/MM/YYYY (DateField output) to ISO datetime string */
function toIsoDate(ddmmyyyy: string): string {
  try {
    const parsed = parse(ddmmyyyy, 'dd/MM/yyyy', new Date());
    return format(parsed, "yyyy-MM-dd'T'HH:mm:ss");
  } catch {
    return ddmmyyyy;
  }
}

/** Converts from ISO datetime to DD/MM/YYYY (for filling the form) */
function fromIsoDate(isoDate: string): string {
  try {
    return format(parse(isoDate, 'dd-MM-yyyy', new Date()), 'dd/MM/yyyy');
  } catch {
    return isoDate;
  }
}

function preparePayload(data: MonitoringEquipmentsForm) {
  return {
    ...data,
    execution_date: toIsoDate(data.execution_date),
  };
}

function toApiPagination(params: Partial<MonitoringEquipmentsListRequest>) {
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

export async function getMonitoringEquipments(
  params: Partial<MonitoringEquipmentsListRequest>
): Promise<PaginationResponse<MonitoringEquipmentsListItem>> {
  const response = await api.get('/onquality/monitoring_equipments/', {
    params: toApiPagination(params),
  });
  const { items, total, offset, limit } = response.data;
  return fromApiPagination<MonitoringEquipmentsListItem>(items, total, offset, limit);
}

export async function getMonitoringEquipment(id: number): Promise<MonitoringEquipmentsDetail> {
  const response = await api.get(`/onquality/monitoring_equipments/${id}`);
  const data = response.data;
  return {
    ...data,
    execution_date: fromIsoDate(data.execution_date),
  };
}

export async function createMonitoringEquipment(data: MonitoringEquipmentsForm) {
  await api.post('/onquality/monitoring_equipments/', preparePayload(data));
}

export async function updateMonitoringEquipment(id: number, data: MonitoringEquipmentsForm) {
  await api.put(`/onquality/monitoring_equipments/${id}`, preparePayload(data));
}

export async function deleteMonitoringEquipment(id: number) {
  await api.delete(`/onquality/monitoring_equipments/${id}`);
}

export const monitoringEquipmentsQuery = definePaginatedQuery(
  'monitoring-equipments',
  getMonitoringEquipments
);

export const monitoringEquipmentDetailQuery = defineQuery(
  'monitoring-equipment-detail',
  getMonitoringEquipment
);

export async function getMonitoringEquipmentsMonthly(
  month: number,
  year: number
): Promise<MonitoringEquipmentsMonthlyResponse> {
  const response = await api.get('/onquality/monitoring_equipments/monthly', {
    params: { month, year },
  });
  return response.data;
}
