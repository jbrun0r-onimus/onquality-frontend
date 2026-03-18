<template>
  <q-item dense v-bind="linkProps">
    <q-item-section>
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
.q-item {
  padding-left: 22px;
  font-size: 12px;
  line-height: 15px;

  &.q-router-link--active {
    font-weight: 600;
  }
}
</style>
