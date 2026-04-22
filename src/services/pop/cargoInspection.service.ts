import { api } from 'src/services/api.service';
import { PaginationResponse } from 'src/schemas/pagination.schemas';
import {
  CargoInspectionForm,
  CargoInspectionListItem,
  CargoInspectionListRequest,
  CargoInspectionDetail,
} from 'src/schemas/pop/cargoInspection.schemas';
import { definePaginatedQuery, defineQuery } from 'src/helpers/query.helpers';

function toApiPagination(params: Partial<CargoInspectionListRequest>) {
  const pageNumber = params.pageNumber ?? 1;
  const pageSize = params.pageSize ?? 10;
  return { offset: (pageNumber - 1) * pageSize, limit: pageSize };
}

function fromApiPagination<T>(
  items: T[],
  total: number,
  offset: number,
  limit: number,
): PaginationResponse<T> {
  return {
    records: items,
    pageNumber: Math.floor(offset / limit) + 1,
    pageSize: limit,
    totalElements: total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function getCargoInspections(
  params: Partial<CargoInspectionListRequest>,
): Promise<PaginationResponse<CargoInspectionListItem>> {
  const response = await api.get('/onquality/cargo_inspection/', {
    params: toApiPagination(params),
  });
  const { items, total, offset, limit } = response.data;
  return fromApiPagination<CargoInspectionListItem>(
    items,
    total,
    offset,
    limit,
  );
}

export async function getCargoInspection(
  id: number,
): Promise<CargoInspectionDetail> {
  const response = await api.get(`/onquality/cargo_inspection/${id}`);
  return response.data;
}

export async function createCargoInspection(data: CargoInspectionForm) {
  await api.post('/onquality/cargo_inspection/', data);
}

export async function updateCargoInspection(
  id: number,
  data: CargoInspectionForm,
) {
  await api.put(`/onquality/cargo_inspection/${id}`, data);
}

export async function deleteCargoInspection(id: number) {
  await api.delete(`/onquality/cargo_inspection/${id}`);
}

export const cargoInspectionsQuery = definePaginatedQuery(
  'cargo-inspections',
  getCargoInspections,
);

export const cargoInspectionDetailQuery = defineQuery(
  'cargo-inspection-detail',
  getCargoInspection,
);
