import { parse, format } from 'date-fns';
import { api } from 'src/services/api.service';
import { PaginationResponse } from 'src/schemas/pagination.schemas';
import {
  WaterCoolerSanitizationForm,
  WaterCoolerSanitizationListItem,
  WaterCoolerSanitizationListRequest,
  WaterCoolerSanitizationDetail,
} from 'src/schemas/pop/waterCoolerSanitization.schemas';
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

function preparePayload(data: WaterCoolerSanitizationForm) {
  return {
    ...data,
    execution_date: toIsoDate(data.execution_date),
  };
}

function toApiPagination(params: Partial<WaterCoolerSanitizationListRequest>) {
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

export async function getWaterCoolerSanitizations(
  params: Partial<WaterCoolerSanitizationListRequest>
): Promise<PaginationResponse<WaterCoolerSanitizationListItem>> {
  const response = await api.get('/onquality/water_cooler/', {
    params: toApiPagination(params),
  });
  const { items, total, offset, limit } = response.data;
  return fromApiPagination<WaterCoolerSanitizationListItem>(items, total, offset, limit);
}

export async function getWaterCoolerSanitization(id: number): Promise<WaterCoolerSanitizationDetail> {
  const response = await api.get(`/onquality/water_cooler/${id}`);
  const data = response.data;
  return {
    ...data,
    execution_date: fromIsoDate(data.execution_date),
  };
}

export async function createWaterCoolerSanitization(data: WaterCoolerSanitizationForm) {
  await api.post('/onquality/water_cooler/', preparePayload(data));
}

export async function updateWaterCoolerSanitization(id: number, data: WaterCoolerSanitizationForm) {
  await api.put(`/onquality/water_cooler/${id}`, preparePayload(data));
}

export async function deleteWaterCoolerSanitization(id: number) {
  await api.delete(`/onquality/water_cooler/${id}`);
}

export const waterCoolerSanitizationsQuery = definePaginatedQuery(
  'water-cooler-sanitizations',
  getWaterCoolerSanitizations
);

export const waterCoolerSanitizationDetailQuery = defineQuery(
  'water-cooler-sanitization-detail',
  getWaterCoolerSanitization
);
