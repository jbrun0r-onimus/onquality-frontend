<template>
  <div class="card-page-section">
    <h2 v-if="title" class="section-title">{{ title }}</h2>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<style scoped lang="scss">
.card-page-section {
  padding: 16px 24px;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1E293B;
  margin: 0 0 16px;
  letter-spacing: -0.2px;

  .body--dark & {
    color: #E2E8F0;
  }
}
</style>
