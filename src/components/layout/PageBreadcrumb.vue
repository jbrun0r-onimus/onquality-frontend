<template>
  <q-breadcrumbs separator="|">
    <q-breadcrumbs-el
      v-for="(item, idx) in items"
      :key="idx"
      :label="item.label ?? ''"
      :to="idx === items.length - 1 ? undefined : item.to"
    />
  </q-breadcrumbs>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { getBreadcrumbItems } from 'src/helpers/routing.helpers';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const i18n = useI18n();

const items = computed(() =>
  getBreadcrumbItems(router.currentRoute.value.matched, i18n)
);
</script>
