<template>
  <q-btn-dropdown flat no-caps :label="authStore.username ?? ''">
    <q-list dense>
      <q-item clickable v-close-popup @click="authStore.logout">
        <q-item-section>
          <q-item-label>{{ $t('auth.logout') }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { useAuthStore } from 'src/stores/auth.store';

const authStore = useAuthStore();
</script>
