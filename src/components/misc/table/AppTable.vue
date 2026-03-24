<template>
  <q-table v-bind="$props" class="app-table" :class="{ 'app-table--sticky': stickyHeaders }">
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
.app-table {
  border-radius: 0;
  box-shadow: none;

  // ─── Header ────────────────────────────────────────────────────────────────

  :deep(thead tr:first-child) {
    height: 36px;
    background-color: #F1F5F9;
  }

  :deep(thead th) {
    font-weight: 700;
    font-size: 11.5px;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    color: #64748B;
    border-bottom: 1px solid #E2E8F0;
  }

  // ─── Rows ──────────────────────────────────────────────────────────────────

  :deep(tbody tr) {
    transition: background 0.1s ease;

    &:not(:last-child) td {
      border-bottom: 1px solid #F1F5F9;
    }

    &:hover td {
      background: rgba(14, 50, 114, 0.03);
    }
  }

  :deep(td) {
    font-size: 13.5px;
    color: #334155;
    padding: 10px 12px;
  }

  // ─── Dark Mode ─────────────────────────────────────────────────────────────

  &.q-dark,
  .body--dark & {
    :deep(thead tr:first-child) {
      background-color: #162033;
    }

    :deep(thead th) {
      color: #64748B;
      border-bottom-color: rgba(255, 255, 255, 0.07);
    }

    :deep(tbody tr:not(:last-child) td) {
      border-bottom-color: rgba(255, 255, 255, 0.05);
    }

    :deep(tbody tr:hover td) {
      background: rgba(147, 197, 253, 0.04);
    }

    :deep(td) {
      color: #CBD5E1;
    }
  }

  // ─── Sticky Headers ────────────────────────────────────────────────────────

  &--sticky {
    :deep(thead tr th) {
      position: sticky;
      z-index: 1;
    }

    :deep(thead tr:first-child th) {
      top: 0;
    }

    :deep(tbody) {
      scroll-margin-top: 48px;
    }
  }
}
</style>
