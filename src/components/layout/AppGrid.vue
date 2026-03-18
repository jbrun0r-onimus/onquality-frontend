<template>
  <div class="grid">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  templateColumns: string;
  tabletTemplateColumns?: string;
  phoneTemplateColumns?: string;
}>();
</script>

<style scoped lang="scss">
.grid {
  display: grid;
  grid-template-columns: v-bind(templateColumns);
}

@media (max-width: 1023px) {
  .grid {
    grid-template-columns: v-bind('tabletTemplateColumns ?? templateColumns');
  }
}

@media (max-width: 767px) {
  .grid {
    grid-template-columns: v-bind(
      'phoneTemplateColumns ?? tabletTemplateColumns ?? templateColumns'
    );
  }
}
</style>
