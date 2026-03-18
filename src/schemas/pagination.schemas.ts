import {
  AnyObject,
  ISchema,
  InferType,
  Maybe,
  array,
  number,
  object,
} from 'yup';

export const createPaginationResponseSchema = <C extends Maybe<AnyObject>, T>(
  elementSchema: ISchema<T, C>
) =>
  object({
    records: array(elementSchema).required(),
    pageNumber: number().required(),
    pageSize: number().required(),
    totalElements: number().required(),
    totalPages: number().required(),
  });

export type PaginationResponse<T> = {
  records: T[];
} & Omit<
  InferType<ReturnType<typeof createPaginationResponseSchema>>,
  'records'
>;

/**
 * You can override these default values in each page by using the .overrideDefaults method, like this:
 * ```js
 * licensesListRequestSchema.overrideDefaults({
 *  pageNumber: 1,
 *  pageSize: 10,
 * });
 * ```
 */
export const paginationRequestSchema = object({
  pageSize: number().default(10),
  pageNumber: number().default(1),
});

export type PaginationRequest = InferType<typeof paginationRequestSchema>;
