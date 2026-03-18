import { parse, format } from 'date-fns';
import { api } from 'src/services/api.service';
import { PaginationResponse } from 'src/schemas/pagination.schemas';
import {
  MaterialReceivingForm,
  MaterialReceivingListItem,
  MaterialReceivingListRequest,
  MaterialReceivingDetail,
} from 'src/schemas/pop/materialReceiving.schemas';
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

function preparePayload(data: MaterialReceivingForm) {
  return {
    ...data,
    receiving_date: toIsoDate(data.receiving_date),
    expiration_date: toIsoDate(data.expiration_date),
  };
}

function toApiPagination(params: Partial<MaterialReceivingListRequest>) {
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

export async function getMaterialReceivings(
  params: Partial<MaterialReceivingListRequest>
): Promise<PaginationResponse<MaterialReceivingListItem>> {
  const response = await api.get('/onquality/material_receiving_control/', {
    params: toApiPagination(params),
  });
  const { items, total, offset, limit } = response.data;
  return fromApiPagination<MaterialReceivingListItem>(items, total, offset, limit);
}

export async function getMaterialReceiving(id: number): Promise<MaterialReceivingDetail> {
  const response = await api.get(`/onquality/material_receiving_control/${id}`);
  const data = response.data;
  return {
    ...data,
    receiving_date: fromIsoDate(data.receiving_date),
    expiration_date: fromIsoDate(data.expiration_date),
  };
}

export async function createMaterialReceiving(data: MaterialReceivingForm) {
  await api.post('/onquality/material_receiving_control/', preparePayload(data));
}

export async function updateMaterialReceiving(id: number, data: MaterialReceivingForm) {
  await api.put(`/onquality/material_receiving_control/${id}`, preparePayload(data));
}

export async function deleteMaterialReceiving(id: number) {
  await api.delete(`/onquality/material_receiving_control/${id}`);
}

export const materialReceivingsQuery = definePaginatedQuery(
  'material-receivings',
  getMaterialReceivings
);

export const materialReceivingDetailQuery = defineQuery(
  'material-receiving-detail',
  getMaterialReceiving
);
