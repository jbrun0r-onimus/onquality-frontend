<template>
  <q-layout view="lHh Lpr lFf">
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
  // Drawer should start closed on mobile, unless we're on the home page
  $q.screen.gt.sm || router.currentRoute.value.path === '/'
);

watch(
  () => authStore.isLoggedIn,
  (isLoggedIn) => {
    if (isLoggedIn) return;
    router.push({ name: 'login' });
  },
  {
    immediate: true,
  }
);
</script>

<style scoped lang="scss">
.q-drawer-container > :deep(.q-drawer) {
  transition: width var(--q-transition-duration) ease-in-out;
}

.q-header {
  transition: left var(--q-transition-duration) ease-in-out;
}

.q-page-container {
  transition: padding-left var(--q-transition-duration) ease-in-out;
  transition-property: padding-left;
}
</style>
