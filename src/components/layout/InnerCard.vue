<template>
  <q-card class="inner-card">
    <q-card-section
      class="header row justify-between items-center q-px-md q-pa-none"
    >
      <h4 class="q-my-sm">{{ title }}</h4>
      <slot name="top-right"></slot>
    </q-card-section>
    <slot></slot>
  </q-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<style scoped lang="scss">
h4 {
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
}

.q-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: rgba(130, 130, 130, 0.2);
}
</style>
