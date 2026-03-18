import { UseQueryReturnType, useQuery } from '@tanstack/vue-query';
import { MaybeRef, computed, unref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouteLocationRaw, useRoute, useRouter } from 'vue-router';
import { defaultNumberOfRetries } from 'src/boot/query';
import { showErrorFeedback } from 'src/helpers/feedback.helpers';
import { createShouldRetryWithNotFoundHandler } from 'src/helpers/query.helpers';
import { QueryDefinition } from 'src/typings/query.typings';

export function useDetailsQueryFromRoute<T>(
  query: QueryDefinition<T, [string]>,
  on404: RouteLocationRaw = '/',
  routeParam = 'id',
  numberOfRetries = defaultNumberOfRetries
): UseQueryReturnType<T, unknown> {
  const { t } = useI18n();
  const router = useRouter();
  const route = useRoute();
  const paramRef = computed(() => route.params[routeParam] as string);

  return useQuery([query.name, paramRef], () => query.loader(paramRef.value), {
    enabled: computed(() => !!paramRef.value),
    retry: createShouldRetryWithNotFoundHandler(() => {
      showErrorFeedback(t('common.feedback.resourceNotFound'));
      router.push(on404);
    }, numberOfRetries),
  });
}

export function useFillFormQuery<T, Id = string>({
  query,
  id,
  readonly,
  setValues,
  onNotFound,
  notifyOnNotFound = true,
}: {
  query: QueryDefinition<T, [Id]>;
  id: MaybeRef<Id | null | undefined>;
  setValues: (values: T, validate: boolean) => void;
  readonly?: MaybeRef<boolean>;
  onNotFound?: () => void;
  notifyOnNotFound?: boolean;
}) {
  const { t } = useI18n();

  const { data, refetch, isLoading, isFetching, error } = useQuery({
    queryKey: [query.name, id],
    queryFn: ({ queryKey }) => query.loader(queryKey[1] as Id),
    enabled: computed(() => !!unref(id)),
    retry: createShouldRetryWithNotFoundHandler(() => {
      if (notifyOnNotFound)
        showErrorFeedback(t('common.feedback.resourceNotFound'));
      onNotFound?.();
    }),
  });

  watch(
    data,
    (d) => {
      if (!d || (isFetching.value && !unref(readonly))) return;
      setValues(d, false);
    },
    {
      immediate: true,
    }
  );

  const isQueryLoading = computed(() =>
    unref(readonly) ? isLoading.value : isFetching.value
  );

  return {
    fillData: data,
    fillRefetch: refetch,
    isFillLoading: isQueryLoading,
    fillError: error,
  };
}
