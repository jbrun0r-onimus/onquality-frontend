<template>
  <q-layout view="hHh lpR fFf">
    <div class="row">
      <q-page-container class="col-grow">
        <header>
          <!-- <language-selector /> -->
          <!-- <dark-mode-toggle /> -->
        </header>
        <router-view />
      </q-page-container>
      <div class="gt-sm panel" />
    </div>
  </q-layout>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth.store';
import DarkModeToggle from 'src/components/layout/header/DarkModeToggle.vue';
import LanguageSelector from 'src/components/layout/header/LanguageSelector.vue';

const router = useRouter();
const authStore = useAuthStore();

watch(
  () => authStore.isLoggedIn,
  (isLoggedIn) => {
    if (!isLoggedIn) return;
    const redirectTo = router.currentRoute.value.query.redirect?.toString() || {
      name: 'pop.cargoInspection',
    };
    router.push(redirectTo);
  },
  {
    immediate: true,
  }
);
</script>

<style scoped lang="scss">
.panel {
  width: 60%;
  height: 100vh;
  background: linear-gradient(135deg, $secondary, $primary);
}

header {
  position: absolute;
  top: 0;
  right: 0;
  padding: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  z-index: 1;
}
</style>
