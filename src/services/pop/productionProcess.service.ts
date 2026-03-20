import { parse, format } from 'date-fns';
import { api } from 'src/services/api.service';
import { PaginationResponse } from 'src/schemas/pagination.schemas';
import {
  ProductionProcessForm,
  ProductionProcessListItem,
  ProductionProcessListRequest,
  ProductionProcessDetail,
} from 'src/schemas/pop/productionProcess.schemas';
import { definePaginatedQuery, defineQuery } from 'src/helpers/query.helpers';

function toIsoDatetime(ddmmyyyyHHmm: string): string {
  try {
    const parsed = parse(ddmmyyyyHHmm, 'dd/MM/yyyy HH:mm', new Date());
    return format(parsed, "yyyy-MM-dd'T'HH:mm:ss");
  } catch {
    try {
      const parsed = parse(ddmmyyyyHHmm, 'dd/MM/yyyy', new Date());
      return format(parsed, "yyyy-MM-dd'T'HH:mm:ss");
    } catch {
      return ddmmyyyyHHmm;
    }
  }
}

function fromIsoDatetime(isoDate: string): string {
  try {
    return format(new Date(isoDate), 'dd/MM/yyyy HH:mm');
  } catch {
    return isoDate;
  }
}

function preparePayload(data: ProductionProcessForm) {
  return {
    ...data,
    execution_date: data.execution_date ? toIsoDatetime(data.execution_date) : null,
  };
}

function toApiPagination(params: Partial<ProductionProcessListRequest>) {
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

export async function getProductionProcesses(
  params: Partial<ProductionProcessListRequest>
): Promise<PaginationResponse<ProductionProcessListItem>> {
  const response = await api.get('/onquality/production_process/', {
    params: toApiPagination(params),
  });
  const { items, total, offset, limit } = response.data;
  return fromApiPagination<ProductionProcessListItem>(items, total, offset, limit);
}

export async function getProductionProcess(id: number): Promise<ProductionProcessDetail> {
  const response = await api.get(`/onquality/production_process/${id}`);
  const data = response.data;
  return {
    ...data,
    execution_date: data.execution_date ? fromIsoDatetime(data.execution_date) : null,
  };
}

export async function createProductionProcess(data: ProductionProcessForm) {
  await api.post('/onquality/production_process/', preparePayload(data));
}

export async function updateProductionProcess(id: number, data: ProductionProcessForm) {
  await api.put(`/onquality/production_process/${id}`, preparePayload(data));
}

export async function deleteProductionProcess(id: number) {
  await api.delete(`/onquality/production_process/${id}`);
}

export const productionProcessesQuery = definePaginatedQuery(
  'production-processes',
  getProductionProcesses
);

export const productionProcessDetailQuery = defineQuery(
  'production-process-detail',
  getProductionProcess
);
