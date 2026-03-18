<template>
  <q-page
    class="row items-center justify-evenly q-pa-md"
    :class="{ 'q-dark': $q.dark.isActive }"
  >
    <login-card flat />
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import LoginCard from 'src/components/auth/LoginCard.vue';

const $q = useQuasar();
</script>
