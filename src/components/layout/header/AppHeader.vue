<template>
  <q-header elevated :class="{ dark: $q.dark.isActive }">
    <q-toolbar>
      <q-btn
        class="lt-md"
        dense
        flat
        round
        icon="o_menu"
        @click="$emit('openDrawer')"
      />
      <q-toolbar-title class="row items-center gap-2">
        <!-- <q-icon name="o_account_circle" /> -->
        <!-- <span>{{ authStore.empresa }}</span> -->
      </q-toolbar-title>
      <app-header-top-right class="gt-xs" />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useAuthStore } from 'src/stores/auth.store';
import AppHeaderTopRight from 'src/components/layout/header/AppHeaderTopRight.vue';

const authStore = useAuthStore();
const $q = useQuasar();

defineEmits<{
  (e: 'openDrawer'): void;
}>();
</script>

<style scoped lang="scss">
.q-toolbar__title {
  font-size: 16px;
  font-weight: 500;

  .q-icon {
    font-size: 26px;
  }
}

.q-header {
  background: white;
  color: $grey-10;

  &.dark {
    background: $grey-10;
    color: white;
  }
}
</style>
