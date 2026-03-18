<template>
  <div class="spinner-and-retry" :class="{ overlay }">
    <q-spinner
      v-if="loading"
      :size="spinnerSize"
      :color="overlay ? 'white' : 'primary'"
      :thickness="2"
    />
    <error-card
      v-else-if="error"
      :error="error"
      :retry="retry"
      :flat="!overlay"
    />
  </div>
</template>

<script setup lang="ts">
import ErrorCard from 'src/components/misc/ErrorCard.vue';

withDefaults(
  defineProps<{
    spinnerSize?: string;
    loading?: boolean;
    error?: unknown;
    retry?: () => void;
    overlay?: boolean;
    padding?: string;
  }>(),
  {
    spinnerSize: '30%',
    padding: '16px',
  }
);
</script>

<style scoped lang="scss">
.spinner-and-retry {
  display: flex;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  padding: v-bind(padding);
  &.overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.15) 20%,
      rgba(0, 0, 0, 0.25) 50%,
      rgba(0, 0, 0, 0.15) 80%,
      rgba(0, 0, 0, 0) 100%
    );
    z-index: 99;
  }

  &:not(.overlay) {
    height: 100%;
  }
}
</style>
