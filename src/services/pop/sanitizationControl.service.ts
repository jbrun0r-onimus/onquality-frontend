import { parse, format } from 'date-fns';
import { api } from 'src/services/api.service';
import { PaginationResponse } from 'src/schemas/pagination.schemas';
import {
  SanitizationControlForm,
  SanitizationControlListItem,
  SanitizationControlListRequest,
  SanitizationControlDetail,
} from 'src/schemas/pop/sanitizationControl.schemas';
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

function preparePayload(data: SanitizationControlForm) {
  return {
    ...data,
    execution_date: toIsoDate(data.execution_date),
    next_execution_date: toIsoDate(data.next_execution_date),
  };
}

function toApiPagination(params: Partial<SanitizationControlListRequest>) {
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

export async function getSanitizationControls(
  params: Partial<SanitizationControlListRequest>
): Promise<PaginationResponse<SanitizationControlListItem>> {
  const response = await api.get('/onquality/sanitization/', {
    params: toApiPagination(params),
  });
  const { items, total, offset, limit } = response.data;
  return fromApiPagination<SanitizationControlListItem>(items, total, offset, limit);
}

export async function getSanitizationControl(id: number): Promise<SanitizationControlDetail> {
  const response = await api.get(`/onquality/sanitization/${id}`);
  const data = response.data;
  return {
    ...data,
    execution_date: fromIsoDate(data.execution_date),
    next_execution_date: fromIsoDate(data.next_execution_date),
  };
}

export async function createSanitizationControl(data: SanitizationControlForm) {
  await api.post('/onquality/sanitization/', preparePayload(data));
}

export async function updateSanitizationControl(id: number, data: SanitizationControlForm) {
  await api.put(`/onquality/sanitization/${id}`, preparePayload(data));
}

export async function deleteSanitizationControl(id: number) {
  await api.delete(`/onquality/sanitization/${id}`);
}

export const sanitizationControlsQuery = definePaginatedQuery(
  'sanitization-controls',
  getSanitizationControls
);

export const sanitizationControlDetailQuery = defineQuery(
  'sanitization-control-detail',
  getSanitizationControl
);
