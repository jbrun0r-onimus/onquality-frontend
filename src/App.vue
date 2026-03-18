<template>
  <router-view />
</template>

<script setup lang="ts">
// Yup defaults must be set before creating any schemas, that's why this import is here
import 'src/schemas';
import { usePreferenceOrStoredDarkMode } from 'src/composables/darkMode.composables';

usePreferenceOrStoredDarkMode();
</script>
