<template>
  <q-td :props="{ col }">
    <div
      class="row gap-1 items-center no-wrap"
      :class="getFlexAlignmentClass(col.align)"
    >
      <slot></slot>
    </div>
  </q-td>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { QTableColumn } from 'quasar';
import { getFlexAlignmentClass } from 'src/helpers/style.helpers';

defineProps<{
  col: QTableColumn<T>;
}>();
</script>
