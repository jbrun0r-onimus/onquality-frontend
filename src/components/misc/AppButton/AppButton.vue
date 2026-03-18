<template>
  <q-btn v-bind="$props">
    <slot v-if="$slots.default"></slot>
  </q-btn>
</template>

<script setup lang="ts">
import { QBtnProps } from 'quasar';

withDefaults(defineProps<QBtnProps>(), {
  color: 'primary',
  noCaps: true,
});
</script>
