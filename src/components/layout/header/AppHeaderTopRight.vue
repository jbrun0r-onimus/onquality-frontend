<template>
  <div class="row">
    <!-- <language-selector /> -->
    <dark-mode-toggle />
    <user-dropdown />
  </div>
</template>

<script setup lang="ts">
import UserDropdown from 'src/components/layout/header/UserDropdown.vue';
import DarkModeToggle from 'src/components/layout/header/DarkModeToggle.vue';
import LanguageSelector from 'src/components/layout/header/LanguageSelector.vue';
</script>
