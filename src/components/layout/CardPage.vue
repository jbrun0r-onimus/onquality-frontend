<template>
  <q-page class="q-pa-md">
    <q-card class="q-px-none q-py-sm">
      <card-page-title-section :title="title" :breadcrumb="breadcrumb" />
      <slot></slot>
    </q-card>
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
