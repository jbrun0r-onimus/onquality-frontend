<template>
  <q-layout view="lHh Lpr lFf" class="main-layout">
    <app-header @open-drawer="drawerOpen = true" />
    <app-drawer v-model="drawerOpen" />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import AppDrawer from 'src/components/layout/AppDrawer.vue';
import AppHeader from 'src/components/layout/header/AppHeader.vue';
import { useAuthStore } from 'src/stores/auth.store';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

const drawerOpen = ref(
  $q.screen.gt.sm || router.currentRoute.value.path === '/'
);

watch(
  () => authStore.isLoggedIn,
  (isLoggedIn) => {
    if (isLoggedIn) return;
    router.push({ name: 'login' });
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.main-layout {
  background: #EBF0F7;

  .body--dark & {
    background: $dark-page;
  }
}

.q-header {
  transition: left var(--q-transition-duration) cubic-bezier(0.4, 0, 0.2, 1);
}

.q-page-container {
  transition: padding-left var(--q-transition-duration) cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
