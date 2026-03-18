<template>
  <q-tabs v-bind="$props" class="self-stretch">
    <slot />
  </q-tabs>
</template>

<script setup lang="ts">
import { QTabsProps } from 'quasar';

withDefaults(defineProps<QTabsProps>(), {
  dense: true,
});
</script>

<style scoped lang="scss">
.q-tabs > :deep(.q-tabs__content > .q-tab) {
  min-height: auto;
  > .q-tab__content {
    padding: 0;
  }
}
</style>
