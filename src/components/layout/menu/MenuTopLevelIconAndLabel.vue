<template>
  <q-item-section v-if="icon" avatar class="menu-icon-section">
    <q-icon :name="icon" size="18px" class="menu-icon" />
  </q-item-section>

  <q-item-section v-if="label" class="menu-label-section">
    {{ label }}
  </q-item-section>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string;
  label?: string;
  active?: boolean;
}>();
</script>

<style scoped lang="scss">
.menu-icon-section {
  min-width: 28px;
}

.menu-icon {
  opacity: 0.7;
  transition: opacity 0.15s ease, color 0.15s ease;

  .q-item.active & {
    opacity: 1;
    color: $primary;
  }

  .body--dark .q-item.active & {
    color: #93C5FD;
  }
}

.menu-label-section {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
