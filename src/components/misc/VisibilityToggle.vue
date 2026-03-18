<template>
  <q-checkbox
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    unchecked-icon="o_visibility"
    checked-icon="o_visibility_off"
    keep-color
    color="grey-6"
  />
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>
