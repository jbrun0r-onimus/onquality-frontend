<template>
  <select-field
    :label="label"
    :icon="icon"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :hint="computedHint"
    :readonly="readonly"
    use-input
    use-chips
    hide-dropdown-icon
    multiple
    new-value-mode="add-unique"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import SelectField from 'src/components/form/SelectField.vue';

const props = defineProps<{
  label?: string;
  icon?: string;
  hint?: true | string;
  modelValue?: string[];
  readonly?: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();

const { t } = useI18n();

const computedHint = computed(() => {
  if (typeof props.hint === 'string') return props.hint;
  return props.hint ? t('common.misc.chipsFieldHint') : undefined;
});
</script>

<style scoped lang="scss">
.q-select > :deep(.q-field__inner > .q-field__control) {
  min-height: 64px;
}
</style>
