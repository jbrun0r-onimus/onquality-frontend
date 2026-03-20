import { parse, format } from 'date-fns';
import { api } from 'src/services/api.service';
import { PaginationResponse } from 'src/schemas/pagination.schemas';
import {
  MaintenanceControlForm,
  MaintenanceControlListItem,
  MaintenanceControlListRequest,
  MaintenanceControlDetail,
} from 'src/schemas/pop/maintenanceControl.schemas';
import { definePaginatedQuery, defineQuery } from 'src/helpers/query.helpers';

function toIsoDate(ddmmyyyy: string): string {
  try {
    const parsed = parse(ddmmyyyy, 'dd/MM/yyyy', new Date());
    return format(parsed, "yyyy-MM-dd'T'HH:mm:ss");
  } catch {
    return ddmmyyyy;
  }
}

function fromIsoDate(isoDate: string): string {
  try {
    return format(new Date(isoDate), 'dd/MM/yyyy');
  } catch {
    return isoDate;
  }
}

function preparePayload(data: MaintenanceControlForm) {
  return {
    ...data,
    execution_date: toIsoDate(data.execution_date),
  };
}

function toApiPagination(params: Partial<MaintenanceControlListRequest>) {
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

export async function getMaintenanceControls(
  params: Partial<MaintenanceControlListRequest>
): Promise<PaginationResponse<MaintenanceControlListItem>> {
  const response = await api.get('/onquality/maintenance/', {
    params: toApiPagination(params),
  });
  const { items, total, offset, limit } = response.data;
  return fromApiPagination<MaintenanceControlListItem>(items, total, offset, limit);
}

export async function getMaintenanceControl(id: number): Promise<MaintenanceControlDetail> {
  const response = await api.get(`/onquality/maintenance/${id}`);
  const data = response.data;
  return {
    ...data,
    execution_date: fromIsoDate(data.execution_date),
  };
}

export async function createMaintenanceControl(data: MaintenanceControlForm) {
  await api.post('/onquality/maintenance/', preparePayload(data));
}

export async function updateMaintenanceControl(id: number, data: MaintenanceControlForm) {
  await api.put(`/onquality/maintenance/${id}`, preparePayload(data));
}

export async function deleteMaintenanceControl(id: number) {
  await api.delete(`/onquality/maintenance/${id}`);
}

export const maintenanceControlsQuery = definePaginatedQuery(
  'maintenance-controls',
  getMaintenanceControls
);

export const maintenanceControlDetailQuery = defineQuery(
  'maintenance-control-detail',
  getMaintenanceControl
);
