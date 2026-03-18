<template>
  <select-field
    v-bind="$props"
    @update:model-value="$emit('update:modelValue', $event)"
    :options="options"
    map-options
    clearable
    emit-value
  />
</template>

<script setup lang="ts">
import SelectField from 'src/components/form/SelectField.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { QSelectProps } from 'quasar';

const props = withDefaults(
  defineProps<
    Omit<
      QSelectProps,
      'modelValue' | 'onUpdate:modelValue' | 'options' | 'dark' | 'optionsDark'
    > & {
      modelValue: boolean | undefined;
      trueLabel?: string;
      falseLabel?: string;
      icon?: string;
    }
  >(),
  {
    outlined: true,
    dense: true,
    optionsDense: true,
    hideBottomSpace: true,
  }
);

defineEmits<{
  (e: 'update:modelValue', value: boolean | undefined): void;
}>();

const { t } = useI18n();

const options = computed(() => [
  {
    value: true,
    label: props.trueLabel ?? t('common.misc.yes'),
  },
  {
    value: false,
    label: props.falseLabel ?? t('common.misc.no'),
  },
]);
</script>
