<template>
  <q-input ref="qInputRef" v-bind="$props" :class="{ extraDense, lighter }">
    <template #prepend v-if="$slots.prepend || icon">
      <slot v-if="$slots.prepend" name="prepend" />
      <q-icon v-else :name="icon" />
    </template>
    <template #append v-if="$slots.append">
      <slot name="append" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { QInput, QInputProps } from 'quasar';

withDefaults(
  defineProps<
    Omit<QInputProps, 'dark'> & {
      icon?: string;
      extraDense?: boolean;
      lighter?: boolean;
    }
  >(),
  {
    outlined: true,
    dense: true,
    hideBottomSpace: true,
  }
);

const qInputRef = ref<QInput>();

defineExpose({
  qInputRef,
});
</script>

<style scoped lang="scss">
.extraDense > :deep(.q-field__inner > .q-field__control) {
  height: 24px;

  & > .q-field__marginal {
    height: 24px;
    font-size: 1rem;
  }
}

.lighter > :deep(.q-field__inner > .q-field__control::before) {
  border-color: rgba(0, 0, 0, 0.12);
}

.lighter.q-field--dark > :deep(.q-field__inner > .q-field__control::before) {
  border-color: rgba(255, 255, 255, 0.28);
}

:deep(input) {
  text-overflow: ellipsis;
}
</style>
