import { parse, format } from 'date-fns';
import { api } from 'src/services/api.service';
import { PaginationResponse } from 'src/schemas/pagination.schemas';
import {
  CleaningSuppliesControlForm,
  CleaningSuppliesControlListItem,
  CleaningSuppliesControlListRequest,
  CleaningSuppliesControlDetail,
} from 'src/schemas/pop/cleaningSuppliesControl.schemas';
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

function preparePayload(data: CleaningSuppliesControlForm) {
  return {
    ...data,
    execution_date: toIsoDate(data.execution_date),
    reuse_date: data.reuse_date ? toIsoDate(data.reuse_date) : null,
  };
}

function toApiPagination(params: Partial<CleaningSuppliesControlListRequest>) {
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

export async function getCleaningSuppliesControls(
  params: Partial<CleaningSuppliesControlListRequest>
): Promise<PaginationResponse<CleaningSuppliesControlListItem>> {
  const response = await api.get('/onquality/cleaning_supplies/', {
    params: toApiPagination(params),
  });
  const { items, total, offset, limit } = response.data;
  return fromApiPagination<CleaningSuppliesControlListItem>(items, total, offset, limit);
}

export async function getCleaningSuppliesControl(id: number): Promise<CleaningSuppliesControlDetail> {
  const response = await api.get(`/onquality/cleaning_supplies/${id}`);
  const data = response.data;
  return {
    ...data,
    execution_date: fromIsoDate(data.execution_date),
    reuse_date: data.reuse_date ? fromIsoDate(data.reuse_date) : null,
    weight: Number(data.weight),
    reuse_weight: data.reuse_weight != null ? Number(data.reuse_weight) : null,
  };
}

export async function createCleaningSuppliesControl(data: CleaningSuppliesControlForm) {
  await api.post('/onquality/cleaning_supplies/', preparePayload(data));
}

export async function updateCleaningSuppliesControl(id: number, data: CleaningSuppliesControlForm) {
  await api.put(`/onquality/cleaning_supplies/${id}`, preparePayload(data));
}

export async function deleteCleaningSuppliesControl(id: number) {
  await api.delete(`/onquality/cleaning_supplies/${id}`);
}

export const cleaningSuppliesControlsQuery = definePaginatedQuery(
  'cleaning-supplies-controls',
  getCleaningSuppliesControls
);

export const cleaningSuppliesControlDetailQuery = defineQuery(
  'cleaning-supplies-control-detail',
  getCleaningSuppliesControl
);
