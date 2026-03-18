<template>
  <q-card-section class="card-page-section">
    <h2 v-if="title" class="q-mt-none q-mb-md">{{ title }}</h2>
    <slot></slot>
  </q-card-section>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<style scoped lang="scss">
.q-card__section {
  padding: 8px 24px;
}

h2 {
  font-size: 1.25rem;
  line-height: 1.2;
  font-weight: 600;
}
</style>
