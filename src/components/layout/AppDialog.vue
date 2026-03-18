<template>
  <q-dialog ref="dialogRef" @hide="$emit('hide')">
    <q-card
      class="q-dialog-plugin q-px-none q-py-md"
      :class="cardClass"
      :style="{ maxWidth, width: '100%' }"
    >
      <card-page-title-section v-if="title" :title="title">
        <template #right v-if="$slots['top-right']">
          <slot name="top-right" />
        </template>
      </card-page-title-section>
      <slot></slot>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { QDialog } from 'quasar';
import CardPageTitleSection from 'src/components/layout/CardPageTitleSection.vue';

withDefaults(
  defineProps<{
    title?: string;
    maxWidth?: string;
    cardClass?: string | Record<string, unknown> | string[];
  }>(),
  {
    maxWidth: '800px',
  }
);

const dialogRef = ref<QDialog>();

defineEmits<{
  (e: 'hide'): void;
}>();

defineExpose({
  show: (e?: Event) => dialogRef.value?.show(e),
  hide: (e?: Event) => dialogRef.value?.hide(e),
  toggle: (evt?: Event) => dialogRef.value?.toggle(evt),
  focus: (selector?: string) => dialogRef.value?.focus(selector),
  shake: (focusTarget?: Element) => dialogRef.value?.shake(focusTarget),
});
</script>

<style lang="scss" scoped>
.q-card :deep(.q-card__actions) {
  padding: 8px 24px;
}
</style>
