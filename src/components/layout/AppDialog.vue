<template>
  <q-dialog
    ref="dialogRef"
    @hide="$emit('hide')"
    transition-show="fade"
    transition-hide="fade"
  >
    <q-card
      class="app-dialog-card"
      :class="cardClass"
      :style="{ maxWidth, width: '100%' }"
    >
      <!-- Title + Close button -->
      <div v-if="title" class="app-dialog-header">
        <div class="app-dialog-title-area">
          <h1 class="app-dialog-title">{{ title }}</h1>
        </div>
        <div class="app-dialog-header-right row items-center gap-1">
          <slot name="top-right" />
          <q-btn
            flat
            round
            dense
            icon="o_close"
            size="sm"
            class="dialog-close-btn"
            @click="dialogRef?.hide()"
          />
        </div>
      </div>

      <slot></slot>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { QDialog } from 'quasar';

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

<style scoped lang="scss">
// ─── Card ─────────────────────────────────────────────────────────────────────

.app-dialog-card {
  border-radius: 14px !important;
  // Mantém overflow: hidden para clip do border-radius,
  // mas o q-form interno tem overflow-y: auto para scrollar
  overflow: hidden;
  // Layout flex column: header fixo + conteúdo rolável
  display: flex !important;
  flex-direction: column !important;
  // Limita a altura ao viewport sem overflow
  max-height: calc(100vh - 48px) !important;

  background: #FFFFFF;
  border: 1px solid #E8EDF4;
  box-shadow:
    0 8px 32px rgba(14, 50, 114, 0.14),
    0 2px 8px rgba(14, 50, 114, 0.08) !important;

  .body--dark & {
    background: #0F1E35 !important;
    border-color: rgba(255, 255, 255, 0.07) !important;
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.45),
      0 2px 8px rgba(0, 0, 0, 0.25) !important;
  }

  // O formulário (conteúdo do slot) deve crescer e scrollar
  // min-height: 0 é essencial para flex items com overflow scrollarem
  :deep(.q-form) {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
  }
}

// ─── Header (fixo no topo, não scrolla) ───────────────────────────────────────

.app-dialog-header {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px 14px;
  border-bottom: 1px solid #F1F5F9;

  .body--dark & {
    border-bottom-color: rgba(255, 255, 255, 0.07);
  }
}

.app-dialog-title-area {
  flex: 1;
  min-width: 0;
}

.app-dialog-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
  letter-spacing: -0.3px;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .body--dark & {
    color: #F1F5F9;
  }
}

.app-dialog-header-right {
  flex-shrink: 0;
  margin-left: 12px;
}

.dialog-close-btn {
  color: #94A3B8;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: rgba(14, 50, 114, 0.08);
    color: $primary;
  }

  .body--dark & {
    &:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #93C5FD;
    }
  }
}

// ─── Actions Footer ───────────────────────────────────────────────────────────
// sticky: fica visível no fundo mesmo quando o formulário é grande e scrolla

:deep(.q-card__actions) {
  position: sticky;
  bottom: 0;
  z-index: 1;
  padding: 12px 20px;
  border-top: 1px solid #F1F5F9;
  gap: 8px;
  background: #FFFFFF;

  .body--dark & {
    background: #0F1E35;
    border-top-color: rgba(255, 255, 255, 0.07);
  }
}
</style>
