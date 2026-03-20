import { parse, format } from 'date-fns';
import { api } from 'src/services/api.service';
import { PaginationResponse } from 'src/schemas/pagination.schemas';
import {
  ChangeWaterCoolerFilterForm,
  ChangeWaterCoolerFilterListItem,
  ChangeWaterCoolerFilterListRequest,
  ChangeWaterCoolerFilterDetail,
} from 'src/schemas/pop/changeWaterCoolerFilter.schemas';
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

function preparePayload(data: ChangeWaterCoolerFilterForm) {
  return {
    ...data,
    execution_date: toIsoDate(data.execution_date),
  };
}

function toApiPagination(params: Partial<ChangeWaterCoolerFilterListRequest>) {
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

export async function getChangeWaterCoolerFilters(
  params: Partial<ChangeWaterCoolerFilterListRequest>
): Promise<PaginationResponse<ChangeWaterCoolerFilterListItem>> {
  const response = await api.get('/onquality/change_water_cooler/', {
    params: toApiPagination(params),
  });
  const { items, total, offset, limit } = response.data;
  return fromApiPagination<ChangeWaterCoolerFilterListItem>(items, total, offset, limit);
}

export async function getChangeWaterCoolerFilter(id: number): Promise<ChangeWaterCoolerFilterDetail> {
  const response = await api.get(`/onquality/change_water_cooler/${id}`);
  const data = response.data;
  return {
    ...data,
    execution_date: fromIsoDate(data.execution_date),
  };
}

export async function createChangeWaterCoolerFilter(data: ChangeWaterCoolerFilterForm) {
  await api.post('/onquality/change_water_cooler/', preparePayload(data));
}

export async function updateChangeWaterCoolerFilter(id: number, data: ChangeWaterCoolerFilterForm) {
  await api.put(`/onquality/change_water_cooler/${id}`, preparePayload(data));
}

export async function deleteChangeWaterCoolerFilter(id: number) {
  await api.delete(`/onquality/change_water_cooler/${id}`);
}

export const changeWaterCoolerFiltersQuery = definePaginatedQuery(
  'change-water-cooler-filters',
  getChangeWaterCoolerFilters
);

export const changeWaterCoolerFilterDetailQuery = defineQuery(
  'change-water-cooler-filter-detail',
  getChangeWaterCoolerFilter
);
