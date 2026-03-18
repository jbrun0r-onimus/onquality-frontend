<template>
  <cell-wrapper :col="col">
    <div class="circle" :style="style"></div>
    <span>{{ label }}</span>
  </cell-wrapper>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { QTableColumn } from 'quasar';
import { StyleValue, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import CellWrapper from 'src/components/misc/table/cells/CellWrapper.vue';

const props = withDefaults(
  defineProps<{
    col: QTableColumn<T>;
    value: boolean;
    trueColor?: string;
    falseColor?: string;
    trueLabel?: string;
    falseLabel?: string;
  }>(),
  {
    trueColor: '#00D46B',
    falseColor: '#FF4E4E',
  }
);

const { t } = useI18n();

const label = computed(() => {
  return props.value
    ? props.trueLabel ?? t('common.misc.yes')
    : props.falseLabel ?? t('common.misc.no');
});

const style = computed<StyleValue>(() => ({
  backgroundColor: props.value ? props.trueColor : props.falseColor,
}));
</script>

<style lang="scss" scoped>
.circle {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

span {
  font-size: 12px;
  font-weight: 500;
}
</style>
