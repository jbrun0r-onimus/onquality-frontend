<template>
  <app-table
    :columns="columns"
    :rows="data?.records ?? []"
    :pagination="pagination"
    :loading="isFetching"
    @request="onRequest"
    @update:pagination="() => {}"
  >
    <template
      v-for="column in columns"
      :key="column.name"
      v-slot:[`body-cell-${column.name}`]="props"
    >
      <slot :name="`body-cell-${column.name}`" v-bind="props">
        <q-td :props="props">
          {{ props.value }}
        </q-td>
      </slot>
    </template>
  </app-table>
</template>

<script
  setup
  lang="ts"
  generic="Item extends Record<string, any>, Params extends PaginationRequest"
>
import { computed } from 'vue';
import { QTableColumn, QTableProps } from 'quasar';
import { useQuery } from '@tanstack/vue-query';
import { PaginationRequest } from 'src/schemas/pagination.schemas';
import { PaginatedQueryDefinition } from 'src/typings/query.typings';
import AppTable from './AppTable.vue';

const props = defineProps<{
  columns: QTableColumn<Item>[];
  query: PaginatedQueryDefinition<Item, PaginationRequest>;
  params: Params;
}>();

const emit = defineEmits<{
  (e: 'update:params', value: Params): void;
}>();

const pagination = computed<QTableProps['pagination']>(() => ({
  rowsPerPage:
    data.value?.pageSize ??
    (props.params.pageSize === -1 ? 0 : props.params.pageSize),
  page: data.value?.pageNumber ?? props.params.pageNumber,
  rowsNumber: data.value?.totalElements ?? 0,
}));

const queryKey = computed(() => [props.query.name, props.params] as const);

const { data, isFetching } = useQuery({
  queryKey,
  queryFn: ({ queryKey }) => props.query.loader(queryKey[1]),
  onSuccess: (data) => {
    emit('update:params', {
      ...props.params,
      pageNumber:
        data.totalPages > 0 && data.pageNumber > data.totalPages
          ? data.totalPages
          : data.pageNumber,
      pageSize: data.pageSize,
    });
  },
  keepPreviousData: true,
});

const onRequest: QTableProps['onRequest'] = ({ pagination }) => {
  emit('update:params', {
    ...props.params,
    pageNumber: pagination.page,
    pageSize: pagination.rowsPerPage === 0 ? -1 : pagination.rowsPerPage,
  });
};
</script>
