import { parse, format } from 'date-fns';
import { api } from 'src/services/api.service';
import { PaginationResponse } from 'src/schemas/pagination.schemas';
import {
  SanitationControlForm,
  SanitationControlListItem,
  SanitationControlListRequest,
  SanitationControlDetail,
} from 'src/schemas/pop/sanitationControl.schemas';
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

function preparePayload(data: SanitationControlForm) {
  return {
    ...data,
    execution_date: toIsoDate(data.execution_date),
  };
}

function toApiPagination(params: Partial<SanitationControlListRequest>) {
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

export async function getSanitationControls(
  params: Partial<SanitationControlListRequest>
): Promise<PaginationResponse<SanitationControlListItem>> {
  const response = await api.get('/onquality/check_list_sanitation/', {
    params: toApiPagination(params),
  });
  const { items, total, offset, limit } = response.data;
  return fromApiPagination<SanitationControlListItem>(items, total, offset, limit);
}

export async function getSanitationControl(id: number): Promise<SanitationControlDetail> {
  const response = await api.get(`/onquality/check_list_sanitation/${id}`);
  const data = response.data;
  return {
    ...data,
    execution_date: fromIsoDate(data.execution_date),
  };
}

export async function createSanitationControl(data: SanitationControlForm) {
  await api.post('/onquality/check_list_sanitation/', preparePayload(data));
}

export async function updateSanitationControl(id: number, data: SanitationControlForm) {
  await api.put(`/onquality/check_list_sanitation/${id}`, preparePayload(data));
}

export async function deleteSanitationControl(id: number) {
  await api.delete(`/onquality/check_list_sanitation/${id}`);
}

export const sanitationControlsQuery = definePaginatedQuery(
  'sanitation-controls',
  getSanitationControls
);

export const sanitationControlDetailQuery = defineQuery(
  'sanitation-control-detail',
  getSanitationControl
);
