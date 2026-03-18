<template>
  <div>
    <div class="text-caption text-grey-6 q-mb-xs">{{ label }}</div>
    <q-option-group
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :options="options"
      type="radio"
      inline
      dense
    />
    <div v-if="error && errorMessage" class="text-negative text-caption">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  label: string;
  modelValue: boolean | null | undefined;
  error?: boolean;
  errorMessage?: string;
  readonly?: boolean;
  simLabel?: string;
  naoLabel?: string;
  naLabel?: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean | null): void;
}>();

const { t } = useI18n();

const options = computed(() => [
  { label: props.simLabel ?? t('pop.common.sim'), value: true, disable: props.readonly },
  { label: props.naoLabel ?? t('pop.common.nao'), value: false, disable: props.readonly },
  { label: props.naLabel ?? t('pop.common.na'), value: null, disable: props.readonly },
]);
</script>
