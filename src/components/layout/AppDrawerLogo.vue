<template>
  <div class="wrapper" :class="{ expanded: modelValue }">
    <div
      role="button"
      class="cursor-pointer"
      @click="$emit('update:modelValue', !modelValue)"
    >
      <q-img
        src="~assets/img/logo.png"
        :width="`${imageDimensions.width}px`"
        :height="`${imageDimensions.height}px`"
        fit="contain"
      />
    </div>
    <div class="separator-wrapper">
      <q-separator class="q-mx-md" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue?: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const imageDimensions = computed(() =>
  props.modelValue ? { width: 110, height: 114 } : { width: 32, height: 33 }
);
</script>

<style scoped lang="scss">
.wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 160px;

  &.expanded {
    .q-img {
      top: 50%;
      transform: translate(50%, -50%);
    }

    .separator-wrapper {
      transform: translateX(0);
    }
  }
}

.q-img {
  position: absolute;
  top: 8px;
  right: 50%;
  transition: all var(--q-transition-duration) ease-in-out;
  transform: translate(50%, 0);
}

.separator-wrapper {
  position: absolute;
  transition: transform var(--q-transition-duration) ease-in-out;
  bottom: 0;
  width: 100%;
  transform: translateX(-100%);
}
</style>
