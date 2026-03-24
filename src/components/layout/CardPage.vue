<template>
  <q-page class="card-page q-pa-md">
    <div class="card-page-inner">
      <card-page-title-section :title="title" :breadcrumb="breadcrumb" />
      <slot></slot>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import CardPageTitleSection from 'src/components/layout/CardPageTitleSection.vue';

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
.card-page {
  background: transparent;
}

.card-page-inner {
  background: #FFFFFF;
  border-radius: 12px;
  border: 1px solid #E8EDF4;
  box-shadow:
    0 1px 3px rgba(14, 50, 114, 0.06),
    0 4px 16px rgba(14, 50, 114, 0.04);
  overflow: hidden;

  .body--dark & {
    background: #0F1E35;
    border-color: rgba(255, 255, 255, 0.07);
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.3),
      0 4px 16px rgba(0, 0, 0, 0.2);
  }
}
</style>
