<template>
  <text-field :placeholder="$t('common.actions.search')" v-bind="$props">
    <template #append>
      <q-icon color="primary" name="o_search" />
    </template>
  </text-field>
</template>

<script setup lang="ts">
import { QInputProps } from 'quasar';
import TextField from 'src/components/form/TextField.vue';

withDefaults(
  defineProps<
    Omit<QInputProps, 'type' | 'dark'> & {
      lighter: boolean;
    }
  >(),
  {
    outlined: undefined,
    dense: undefined,
    hideBottomSpace: true,
    debounce: 500,
  }
);

defineEmits<{
  (e: 'update:search', value: string): void;
}>();
</script>
