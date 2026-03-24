<template>
  <q-item dense class="menu-sub-item" v-bind="linkProps" exact-active-class="menu-sub-item--active">
    <q-item-section class="sub-item-label">
      {{ item.label }}
    </q-item-section>
  </q-item>
</template>

<script lang="ts" setup>
import { toRef } from 'vue';
import { useFinalMenuItem } from 'src/composables/menu.composables';
import { FinalMenuItem } from 'src/typings/menu.typings';

const props = defineProps<{
  item: FinalMenuItem;
}>();

const { isActive, linkProps } = useFinalMenuItem(toRef(props, 'item'));

defineExpose({
  isActive,
});
</script>

<style scoped lang="scss">
.menu-sub-item {
  padding: 5px 12px 5px 40px;
  min-height: 32px;
  border-radius: 6px;
  margin: 1px 8px;
  color: #64748B;
  font-size: 12.5px;
  font-weight: 500;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: rgba(14, 50, 114, 0.06);
    color: $primary;
  }

  &--active,
  &.q-router-link--active {
    background: rgba(14, 50, 114, 0.08);
    color: $primary;
    font-weight: 600;

    .sub-item-label::before {
      content: '';
      display: inline-block;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: $secondary;
      margin-right: 8px;
      flex-shrink: 0;
    }
  }

  .body--dark & {
    color: #94A3B8;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
      color: #93C5FD;
    }

    &--active,
    &.q-router-link--active {
      background: rgba(147, 197, 253, 0.1);
      color: #93C5FD;
    }
  }
}

.sub-item-label {
  display: flex;
  align-items: center;
  font-size: inherit;
}
</style>
