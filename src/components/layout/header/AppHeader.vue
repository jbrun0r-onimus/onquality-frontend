<template>
  <q-header class="app-header" :class="{ 'app-header--dark': $q.dark.isActive }">
    <q-toolbar class="app-toolbar">
      <!-- Menu toggle (mobile) -->
      <q-btn
        class="lt-md menu-toggle"
        dense
        flat
        round
        icon="o_menu"
        @click="$emit('openDrawer')"
      />

      <!-- Brand (mobile only) -->
      <q-toolbar-title class="brand-title lt-md">
        <span class="brand-text">OnQuality</span>
      </q-toolbar-title>

      <q-space class="gt-sm" />

      <!-- Right Actions -->
      <app-header-top-right />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import AppHeaderTopRight from 'src/components/layout/header/AppHeaderTopRight.vue';

const $q = useQuasar();

defineEmits<{
  (e: 'openDrawer'): void;
}>();
</script>

<style scoped lang="scss">
.app-header {
  background: #FFFFFF;
  border-bottom: 1px solid #E8EDF4;
  box-shadow: 0 1px 3px rgba(14, 50, 114, 0.06);
  transition: background 0.2s ease, border-color 0.2s ease;

  &--dark {
    background: #0D1929;
    border-bottom-color: rgba(255, 255, 255, 0.06);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
}

.app-toolbar {
  min-height: 56px;
  padding: 0 16px;
}

.menu-toggle {
  color: #475569;
  margin-right: 4px;
}

.brand-title {
  font-size: 1rem;
  font-weight: 700;
  padding: 0;
}

.brand-text {
  color: $primary;
  letter-spacing: -0.3px;

  .app-header--dark & {
    color: #93C5FD;
  }
}
</style>
