import { parse, format } from 'date-fns';
import { api } from 'src/services/api.service';
import { PaginationResponse } from 'src/schemas/pagination.schemas';
import {
  NonConformanceLogForm,
  NonConformanceLogListItem,
  NonConformanceLogListRequest,
  NonConformanceLogDetail,
} from 'src/schemas/pop/nonConformanceLog.schemas';
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

function preparePayload(data: NonConformanceLogForm) {
  return {
    ...data,
    receiving_date: toIsoDate(data.receiving_date),
  };
}

function toApiPagination(params: Partial<NonConformanceLogListRequest>) {
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

export async function getNonConformanceLogs(
  params: Partial<NonConformanceLogListRequest>
): Promise<PaginationResponse<NonConformanceLogListItem>> {
  const response = await api.get('/onquality/non_conformance/', {
    params: toApiPagination(params),
  });
  const { items, total, offset, limit } = response.data;
  return fromApiPagination<NonConformanceLogListItem>(items, total, offset, limit);
}

export async function getNonConformanceLog(id: number): Promise<NonConformanceLogDetail> {
  const response = await api.get(`/onquality/non_conformance/${id}`);
  const data = response.data;
  return {
    ...data,
    receiving_date: fromIsoDate(data.receiving_date),
  };
}

export async function createNonConformanceLog(data: NonConformanceLogForm) {
  await api.post('/onquality/non_conformance/', preparePayload(data));
}

export async function updateNonConformanceLog(id: number, data: NonConformanceLogForm) {
  await api.put(`/onquality/non_conformance/${id}`, preparePayload(data));
}

export async function deleteNonConformanceLog(id: number) {
  await api.delete(`/onquality/non_conformance/${id}`);
}

export const nonConformanceLogsQuery = definePaginatedQuery(
  'non-conformance-logs',
  getNonConformanceLogs
);

export const nonConformanceLogDetailQuery = defineQuery(
  'non-conformance-log-detail',
  getNonConformanceLog
);
