<template>
  <div class="page-title-section">
    <div class="row justify-between items-center">
      <div class="column gap-1">
        <h1 class="page-title">{{ title }}</h1>
        <page-breadcrumb v-if="breadcrumb" class="page-breadcrumb" />
      </div>
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import PageBreadcrumb from 'src/components/layout/PageBreadcrumb.vue';

withDefaults(
  defineProps<{
    title: string;
    breadcrumb?: boolean;
  }>(),
  {
    breadcrumb: false,
  }
);
</script>

<style scoped lang="scss">
.page-title-section {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #F1F5F9;

  .body--dark & {
    border-bottom-color: rgba(255, 255, 255, 0.06);
  }
}

.page-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
  letter-spacing: -0.4px;
  line-height: 1.3;

  .body--dark & {
    color: #F1F5F9;
  }
}

.page-breadcrumb {
  margin-top: 2px;
}
</style>
