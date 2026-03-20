import { api } from 'src/services/api.service';
import { PaginationResponse } from 'src/schemas/pagination.schemas';
import {
  CheckListPestForm,
  CheckListPestListItem,
  CheckListPestListRequest,
  CheckListPestDetail,
} from 'src/schemas/pop/checkListPest.schemas';
import { definePaginatedQuery, defineQuery } from 'src/helpers/query.helpers';

function toApiPagination(params: Partial<CheckListPestListRequest>) {
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

export async function getCheckListPests(
  params: Partial<CheckListPestListRequest>
): Promise<PaginationResponse<CheckListPestListItem>> {
  const response = await api.get('/onquality/check_list_pest/', {
    params: toApiPagination(params),
  });
  const { items, total, offset, limit } = response.data;
  return fromApiPagination<CheckListPestListItem>(items, total, offset, limit);
}

export async function getCheckListPest(id: number): Promise<CheckListPestDetail> {
  const response = await api.get(`/onquality/check_list_pest/${id}`);
  return response.data;
}

export async function createCheckListPest(data: CheckListPestForm) {
  await api.post('/onquality/check_list_pest/', data);
}

export async function updateCheckListPest(id: number, data: CheckListPestForm) {
  await api.put(`/onquality/check_list_pest/${id}`, data);
}

export async function deleteCheckListPest(id: number) {
  await api.delete(`/onquality/check_list_pest/${id}`);
}

export const checkListPestsQuery = definePaginatedQuery(
  'check-list-pests',
  getCheckListPests
);

export const checkListPestDetailQuery = defineQuery(
  'check-list-pest-detail',
  getCheckListPest
);
