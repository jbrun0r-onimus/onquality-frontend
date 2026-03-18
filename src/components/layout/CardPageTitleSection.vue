<template>
  <card-page-section class="column gap-2">
    <div class="row justify-between items-start">
      <h1 class="q-my-none">
        {{ title }}
      </h1>
      <slot name="right" />
    </div>
    <page-breadcrumb v-if="breadcrumb" />
  </card-page-section>
</template>

<script setup lang="ts">
import CardPageSection from 'src/components/layout/CardPageSection.vue';
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
h1 {
  font-size: 1.5rem;
  line-height: 1.2;
  font-weight: 700;
}
</style>
