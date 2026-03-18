<template>
  <q-select ref="qSelectRef" v-bind="$props">
    <template #prepend v-if="$slots.prepend || icon">
      <slot v-if="$slots.prepend" name="prepend" />
      <q-icon v-else :name="icon" />
    </template>
    <template #append v-if="$slots.append">
      <slot name="append" />
    </template>
    <template #no-option v-if="noOptionLabel || $slots['no-option']">
      <slot v-if="$slots['no-option']" name="no-option" />
      <div v-else class="q-pa-sm text-grey-6">
        {{
          noOptionLabel === true
            ? $t('common.feedback.noRecordsFound')
            : noOptionLabel
        }}
      </div>
    </template>
    <template #selected-item="props" v-if="$slots['selected-item']">
      <slot name="selected-item" v-bind="props" />
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { QSelect, QSelectProps } from 'quasar';
import { ref } from 'vue';

withDefaults(
  defineProps<
    Omit<QSelectProps, 'dark' | 'optionsDark'> & {
      icon?: string;
      noOptionLabel?: boolean | string;
    }
  >(),
  {
    outlined: true,
    dense: true,
    optionsDense: true,
    hideBottomSpace: true,
  }
);

const qSelectRef = ref<QSelect>();

defineExpose({
  qSelectRef,
});
</script>
