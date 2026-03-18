<template>
  <q-table v-bind="$props" class="app-table" :class="{ stickyHeaders }">
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
    <template v-if="$slots.pagination" v-slot:pagination="props">
      <slot name="pagination" v-bind="props" />
    </template>
    <template v-if="$slots['bottom-row']" v-slot:bottom-row="props">
      <slot name="bottom-row" v-bind="props" />
    </template>
  </q-table>
</template>

<script setup lang="ts" generic="Row extends Record<string, any>">
import { QTableColumn, QTableProps } from 'quasar';

withDefaults(
  defineProps<
    {
      // defineProps compiler is doing some weird stuff here, so we need this omit and a very specific prop order to ensure it works as expected
      'onUpdate:selected'?: QTableProps['onUpdate:selected'];
      columns?: QTableColumn<Row>[];
      rows?: Row[];
      'onUpdate:expanded'?: QTableProps['onUpdate:expanded'];
      stickyHeaders?: boolean;
    } & Omit<QTableProps, 'dark' | 'onUpdate:selected' | 'onUpdate:expanded'>
  >(),
  {
    separator: 'none',
  }
);
</script>

<style lang="scss" scoped>
:deep(thead) {
  tr:first-child {
    height: 32px;
    background-color: #e6e6e6;
  }

  th {
    font-weight: 600;
  }
}

.app-table.q-dark :deep(thead tr:first-child) {
  background-color: #313131;
}

.app-table.stickyHeaders {
  :deep(thead tr th) {
    position: sticky;
    z-index: 1;
  }

  :deep(thead tr:first-child th) {
    top: 0;
  }

  /* prevent scrolling behind sticky top row on focus */
  :deep(tbody) {
    /* height of all previous header rows */
    scroll-margin-top: 48px;
  }
}
</style>
