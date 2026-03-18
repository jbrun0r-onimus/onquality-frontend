<template>
  <q-item-section v-if="icon" avatar>
    <q-icon size="xs" :name="icon" />
  </q-item-section>

  <q-item-section v-if="label">
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
.q-item__section--avatar {
  min-width: auto;
}
</style>
