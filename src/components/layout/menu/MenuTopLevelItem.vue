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
.q-item,
.q-expansion-item > :deep(.q-expansion-item__container > .q-item) {
  &.active {
    background: transparent linear-gradient(90deg, #efefef 0%, #f2f2f2 100%) 0%
      0% no-repeat padding-box;

    &.q-item--dark {
      background: transparent linear-gradient(90deg, #2b2b2b 100%, #1d1d1d 0%)
        0% 0% no-repeat padding-box;
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 4px;
      background-color: $primary;
    }
  }
}
</style>
