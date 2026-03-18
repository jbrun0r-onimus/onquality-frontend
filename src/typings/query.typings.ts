/* eslint-disable @typescript-eslint/no-explicit-any */

import { QueryClient } from '@tanstack/vue-query';
import {
  PaginationRequest,
  PaginationResponse,
} from 'src/schemas/pagination.schemas';

export type QueryDefinition<T, Args extends any[] = any[]> = {
  name: string;
  loader: (...args: Args) => Promise<T>;
  invalidate: (client: QueryClient) => void;
};

export type PaginatedQueryDefinition<
  Row extends Record<string, any>,
  Params extends PaginationRequest
> = QueryDefinition<PaginationResponse<Row>, [Partial<Params>]>;

export type RequestFilters<Params extends PaginationRequest> = Omit<
  Params,
  keyof PaginationRequest
>;
