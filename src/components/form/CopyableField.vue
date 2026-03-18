<template>
  <text-field v-bind="$props">
    <template v-if="copyable" v-slot:append>
      <copy-to-clipboard-button :value="(modelValue as string)" />
    </template>
  </text-field>
</template>

<script setup lang="ts">
import { QInputProps } from 'quasar';
import TextField from 'src/components/form/TextField.vue';
import CopyToClipboardButton from 'src/components/misc/CopyToClipboardButton.vue';

withDefaults(
  defineProps<
    Omit<QInputProps, 'type' | 'dark'> & {
      icon?: string;
      copyable?: boolean;
    }
  >(),
  {
    outlined: undefined,
    dense: undefined,
    hideBottomSpace: true,
    copyable: true,
  }
);
</script>
