<template>
  <menu-top-level-parent-item
    v-if="'children' in item"
    :fully-expanded="fullyExpanded"
    :item="item"
    @expand="$emit('expand')"
  />
  <menu-top-level-final-item
    v-else
    :fully-expanded="fullyExpanded"
    :item="item"
  />
</template>

<script lang="ts" setup>
import { MenuItem } from 'src/typings/menu.typings';
import MenuTopLevelParentItem from 'src/components/layout/menu/MenuTopLevelParentItem.vue';
import MenuTopLevelFinalItem from 'src/components/layout/menu/MenuTopLevelFinalItem.vue';

defineProps<{
  fullyExpanded: boolean;
  item: MenuItem;
}>();
defineEmits<{
  (e: 'expand'): void;
}>();
</script>

<style scoped lang="scss">
// Parent expansion item active state
.q-expansion-item > :deep(.q-expansion-item__container > .q-item) {
  margin: 1px 8px;
  border-radius: 8px;
  color: #475569;
  font-weight: 500;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: rgba(14, 50, 114, 0.06);
    color: $primary;
  }

  &.active {
    background: rgba(14, 50, 114, 0.08);
    color: $primary;
    font-weight: 600;
  }

  .body--dark & {
    color: #94A3B8;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
      color: #93C5FD;
    }

    &.active {
      background: rgba(147, 197, 253, 0.1);
      color: #93C5FD;
    }
  }
}
</style>
