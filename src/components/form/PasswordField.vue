<template>
  <text-field v-bind="$props" :type="type">
    <template #append>
      <visibility-toggle v-if="allowShowPassword" v-model="showPassword" />
    </template>
  </text-field>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { QInputProps } from 'quasar';
import TextField from 'src/components/form/TextField.vue';
import VisibilityToggle from 'src/components/misc/VisibilityToggle.vue';

withDefaults(
  defineProps<
    Omit<QInputProps, 'type' | 'dark'> & {
      icon?: string;
      allowShowPassword?: boolean;
    }
  >(),
  {
    outlined: undefined,
    dense: undefined,
    hideBottomSpace: true,
    allowShowPassword: true,
  }
);

const showPassword = ref(false);
const type = computed(() => (showPassword.value ? 'text' : 'password'));
</script>
