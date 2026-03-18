<template>
  <select-field
    ref="selectFieldRef"
    v-bind="$props"
    use-input
    :options="options"
    :loading="isFetching"
    @virtual-scroll="onScroll"
    @filter="onFitler"
    :no-option-label="!isFetching"
  >
    <template #selected-item="{ opt, removeAtIndex, index }" v-if="useChips">
      <q-chip
        :dense="dense"
        :removable="!readonly"
        @remove="removeAtIndex(index)"
        :clickable="selectedClickable"
        @click="$emit('selectedClick', opt)"
      >
        {{ getLabel(opt) }}
      </q-chip>
    </template>
  </select-field>
</template>

<script
  setup
  lang="ts"
  generic="Item extends Record<string, any>, Params extends PaginationRequest"
>
import { QSelectProps, QSelect } from 'quasar';
import { PaginationRequest } from 'src/schemas/pagination.schemas';
import { PaginatedQueryDefinition } from 'src/typings/query.typings';
import SelectField from 'src/components/form/SelectField.vue';
import { computed, ref } from 'vue';
import { useInfiniteQuery } from '@tanstack/vue-query';

const props = withDefaults(
  defineProps<
    Omit<QSelectProps, 'options' | 'dark' | 'optionsDark'> & {
      query: PaginatedQueryDefinition<Item, PaginationRequest>;
      filterParam?: string;
      icon?: string;
      selectedClickable?: boolean;
    }
  >(),
  {
    outlined: true,
    filterParam: 'search',
    dense: true,
    optionsDense: true,
    hideBottomSpace: true,
  }
);

defineEmits<{
  (e: 'selectedClick', opt: Item): void;
}>();

const selectFieldRef = ref<InstanceType<typeof SelectField>>();
const search = ref<string>();

const params = computed(() => ({
  pageNumber: 1,
  pageSize: 50,
  [props.filterParam]: search.value,
}));

const { data, fetchNextPage, isFetching, hasNextPage } = useInfiniteQuery({
  enabled: computed(() => search.value !== undefined),
  queryKey: [props.query.name, params] as const,
  queryFn: ({ queryKey, pageParam }) => {
    const p = queryKey[1] as unknown as Params;
    return props.query.loader({
      ...p,
      pageNumber: pageParam ?? p.pageNumber,
    });
  },
  getNextPageParam: (lastPage) =>
    lastPage.pageNumber < lastPage.totalPages
      ? lastPage.pageNumber + 1
      : undefined,
  keepPreviousData: true,
  refetchOnWindowFocus: false,
});

const options = computed(
  () => data.value?.pages.flatMap((page) => page.records) ?? []
);

const onScroll = (e: { to: number; ref: QSelect; index: number }) => {
  if (e.index !== e.to || !hasNextPage?.value) return;
  fetchNextPage().then((result) => {
    if (result.status === 'success') e.ref.refresh();
  });
};

const onFitler: QSelectProps['onFilter'] = (val, update) => {
  search.value = val;
  update(() => undefined);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getLabel(opt: any) {
  if (typeof props.optionLabel === 'function') {
    return props.optionLabel(opt);
  }

  return opt[props.optionLabel || 'name'];
}
</script>
