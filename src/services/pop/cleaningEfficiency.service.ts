import { parse, format } from 'date-fns';
import { api } from 'src/services/api.service';
import { PaginationResponse } from 'src/schemas/pagination.schemas';
import {
  CleaningEfficiencyForm,
  CleaningEfficiencyListItem,
  CleaningEfficiencyListRequest,
  CleaningEfficiencyDetail,
} from 'src/schemas/pop/cleaningEfficiency.schemas';
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
    return format(new Date(isoDate), 'dd/MM/yyyy');
  } catch {
    return isoDate;
  }
}

function preparePayload(data: CleaningEfficiencyForm) {
  return {
    ...data,
    execution_date: toIsoDate(data.execution_date),
  };
}

function toApiPagination(params: Partial<CleaningEfficiencyListRequest>) {
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

export async function getCleaningEfficiencies(
  params: Partial<CleaningEfficiencyListRequest>
): Promise<PaginationResponse<CleaningEfficiencyListItem>> {
  const response = await api.get('/onquality/check_list_efficiency/', {
    params: toApiPagination(params),
  });
  const { items, total, offset, limit } = response.data;
  return fromApiPagination<CleaningEfficiencyListItem>(items, total, offset, limit);
}

export async function getCleaningEfficiency(id: number): Promise<CleaningEfficiencyDetail> {
  const response = await api.get(`/onquality/check_list_efficiency/${id}`);
  const data = response.data;
  return {
    ...data,
    execution_date: fromIsoDate(data.execution_date),
  };
}

export async function createCleaningEfficiency(data: CleaningEfficiencyForm) {
  await api.post('/onquality/check_list_efficiency/', preparePayload(data));
}

export async function updateCleaningEfficiency(id: number, data: CleaningEfficiencyForm) {
  await api.put(`/onquality/check_list_efficiency/${id}`, preparePayload(data));
}

export async function deleteCleaningEfficiency(id: number) {
  await api.delete(`/onquality/check_list_efficiency/${id}`);
}

export const cleaningEfficienciesQuery = definePaginatedQuery(
  'cleaning-efficiencies',
  getCleaningEfficiencies
);

export const cleaningEfficiencyDetailQuery = defineQuery(
  'cleaning-efficiency-detail',
  getCleaningEfficiency
);
