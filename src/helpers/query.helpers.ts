import { AxiosError } from 'axios';
import { defaultNumberOfRetries } from 'src/boot/query';
import {
  PaginationRequest,
  PaginationResponse,
} from 'src/schemas/pagination.schemas';
import {
  PaginatedQueryDefinition,
  QueryDefinition,
} from 'src/typings/query.typings';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const defineQuery = <T, Args extends any[] = any[]>(
  name: string,
  loader: (...args: Args) => Promise<T>
): QueryDefinition<T, Args> => ({
  name,
  loader,
  invalidate: (client) => client.invalidateQueries([name]),
});

export const definePaginatedQuery = defineQuery as <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Item extends Record<string, any>,
  Params extends PaginationRequest
>(
  name: string,
  loader: (params: Partial<Params>) => Promise<PaginationResponse<Item>>
) => PaginatedQueryDefinition<Item, Params>;

export function createShouldRetry(numberOfRetries: number) {
  return (count: number, error: unknown) => {
    /** Will only retry server errors */
    if (!(error instanceof AxiosError)) return false;

    /** Will not retry requests with status in the 4xx range */
    if (
      error.response?.status &&
      error.response?.status >= 400 &&
      error.response?.status < 500
    ) {
      return false;
    }

    return count + 1 < numberOfRetries;
  };
}

export function createShouldRetryWithNotFoundHandler(
  onNotFound: (error: AxiosError) => void,
  numberOfRetries = defaultNumberOfRetries
) {
  const defaultShouldRetry = createShouldRetry(numberOfRetries);

  return (count: number, error: unknown) => {
    if (error instanceof AxiosError && error.response?.status === 404) {
      onNotFound(error);
      return false;
    }

    return defaultShouldRetry(count, error);
  };
}
