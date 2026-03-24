<template>
  <q-layout>
    <!-- Overlay visível apenas na tela — cobre a previsualização HTML -->
    <!-- Removido na impressão via @media print -->
    <div class="print-screen-overlay">
      <q-circular-progress indeterminate size="44px" color="primary" />
      <p class="print-screen-msg">Preparando documento para impressão…</p>
    </div>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  // Fecha a aba automaticamente após o usuário dispensar o diálogo de impressão
  window.addEventListener('afterprint', () => window.close(), { once: true });
});
</script>

<style>
/* ─── Screen: mostra apenas o overlay de carregamento ─────────────────────── */
@media screen {
  .print-screen-overlay {
    position: fixed;
    inset: 0;
    background: #ffffff;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  .print-screen-msg {
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    color: #64748B;
    margin: 0;
  }
}

/* ─── Print: oculta o overlay, reseta o layout Quasar ─────────────────────── */
@media print {
  .print-screen-overlay {
    display: none !important;
  }

  .q-layout,
  .q-page-container,
  .q-page {
    all: unset;
  }

  body {
    margin: 0;
    padding: 0;
  }
}
</style>
