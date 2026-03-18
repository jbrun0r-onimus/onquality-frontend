<template>
  <q-toggle
    checked-icon="o_dark_mode"
    unchecked-icon="o_light_mode"
    :model-value="$q.dark.isActive"
    @update:model-value="$q.dark.set"
    color="indigo-10"
  />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

const $q = useQuasar();
</script>
