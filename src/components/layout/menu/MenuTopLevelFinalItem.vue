<template>
  <q-item
    class="top-final-item"
    exact-active-class=""
    active-class="active"
    v-bind="linkProps"
  >
    <menu-top-level-icon-and-label
      :icon="item.icon"
      :label="fullyExpanded ? item.label : undefined"
    />
  </q-item>
</template>

<script lang="ts" setup>
import { toRef } from 'vue';
import { useFinalMenuItem } from 'src/composables/menu.composables';
import MenuTopLevelIconAndLabel from 'src/components/layout/menu/MenuTopLevelIconAndLabel.vue';
import { FinalMenuItem } from 'src/typings/menu.typings';

const props = defineProps<{
  fullyExpanded: boolean;
  item: FinalMenuItem;
}>();

const { linkProps } = useFinalMenuItem(toRef(props, 'item'));
</script>

<style scoped lang="scss">
.top-final-item {
  margin: 1px 8px;
  border-radius: 8px;
  min-height: 40px;
  padding: 0 10px;
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

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 6px;
      bottom: 6px;
      width: 3px;
      background: $primary;
      border-radius: 0 3px 3px 0;
    }
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

      &::before {
        background: #93C5FD;
      }
    }
  }
}
</style>
