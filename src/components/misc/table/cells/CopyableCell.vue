<template>
  <cell-wrapper :col="col">
    <span>{{ value }}</span>
    <copy-to-clipboard-button :value="value" />
  </cell-wrapper>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { QTableColumn } from 'quasar';
import CopyToClipboardButton from 'src/components/misc/CopyToClipboardButton.vue';
import CellWrapper from 'src/components/misc/table/cells/CellWrapper.vue';

defineProps<{
  col: QTableColumn<T>;
  value: string;
}>();
</script>

<style lang="scss" scoped>
span {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
