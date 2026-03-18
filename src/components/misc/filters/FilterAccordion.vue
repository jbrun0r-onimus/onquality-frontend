<template>
  <q-list dense bordered class="rounded-borders">
    <q-expansion-item
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <template #header>
        <div class="flex-grow row items-center no-wrap gap-2">
          <q-icon name="o_filter_list" />
          <span>Filtros</span>
          <q-separator vertical inset />
          <div class="flex-grow row">
            <q-chip
              v-for="filter in active"
              :key="filter.value"
              :label="filter.label"
              class="q-mr-sm"
              removable
              dense
              @remove="$emit('remove', filter.value)"
            />
          </div>
        </div>
      </template>
      <q-separator />
      <div class="q-pa-sm">
        <slot></slot>
        <div class="row justify-end gap-2 q-mt-sm">
          <app-button
            :label="$t('common.actions.clearFilters')"
            color="grey-6"
            @click="$emit('clear')"
            outline
          />
          <app-button
            :label="$t('common.actions.applyFilters')"
            @click="$emit('apply')"
            color="primary"
          />
        </div>
      </div>
    </q-expansion-item>
  </q-list>
</template>

<script setup lang="ts" generic="T extends string">
import AppButton from 'src/components/misc/AppButton/AppButton.vue';

type FilterChip = {
  label: string;
  value: T;
};

defineProps<{
  modelValue: boolean;
  active: FilterChip[];
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'remove', value: T): void;
  (e: 'clear'): void;
  (e: 'apply'): void;
}>();
</script>

<style scoped lang="scss">
.q-expansion-item > :deep(.q-expansion-item__container > .q-item) {
  padding: 2px 16px;
  min-height: 32px;
}
</style>
