<template>
  <label class="row items-center">
    <span v-if="label" class="text-caption q-mr-sm">
      {{ label }}
    </span>
    <text-field
      v-bind="$props"
      :label="undefined"
      :error-message="undefined"
      class="q-mr-sm"
      extra-dense
    />
    <span v-if="errorMessage" class="text-negative error-message">
      {{ errorMessage }}
    </span>
  </label>
</template>

<script setup lang="ts">
import { QInputProps } from 'quasar';
import TextField from 'src/components/form/TextField.vue';

withDefaults(
  defineProps<
    Omit<QInputProps, 'dark'> & {
      icon?: string;
      min?: number;
      max?: number;
    }
  >(),
  {
    outlined: false,
    dense: true,
    hideBottomSpace: true,
  }
);
</script>

<style scoped lang="scss">
.error-message {
  font-size: 11px;
  flex-basis: 100%;
  text-align: right;
}

.q-field {
  width: 64px;
}
</style>
