import { Instantiate } from 'miragejs';
import { MockRegistry, MockSchema } from 'mocks/server';
import {
  PaginationRequest,
  PaginationResponse,
} from 'src/schemas/pagination.schemas';

export function mockPaginationResponse<
  K extends keyof MockRegistry,
  Params extends PaginationRequest,
  T
>(
  schema: MockSchema,
  model: K,
  params: Params,
  mapper: (model: Instantiate<MockRegistry, K>) => T,
  filter?: (model: Instantiate<MockRegistry, K>, params: Params) => boolean
): PaginationResponse<T> {
  let records = schema.all(model).models;

  const page = params.pageNumber || 1;
  const pageSize = params.pageSize || 10;

  if (filter) {
    records = records.filter((record) => filter(record, params));
  }

  const total = records.length;

  if (params.pageSize !== -1) {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    records = records.slice(start, end);
  }

  return {
    records: records.map(mapper),
    pageNumber: page,
    pageSize: pageSize,
    totalElements: total,
    totalPages: pageSize === -1 ? 1 : Math.ceil(total / pageSize),
  };
}
