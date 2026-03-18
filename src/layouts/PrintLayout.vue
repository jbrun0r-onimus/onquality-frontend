<template>
  <q-layout>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
</script>

<style>
@media print {
  .q-layout, .q-page-container, .q-page { all: unset; }
  body { margin: 0; padding: 0; }
}
</style>
