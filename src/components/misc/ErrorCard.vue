<template>
  <q-card class="text-negative" :flat="flat">
    <q-card-section class="row items-center gap-2">
      <q-icon name="o_error" size="2em" />
      <div class="text-h6">{{ $t('common.feedback.error') }}</div>
    </q-card-section>
    <q-card-section class="q-py-none">
      {{ getMessageFromUnknownError(error) }}
    </q-card-section>
    <q-card-actions align="right">
      <app-button
        v-if="retry"
        :label="$t('common.actions.retry')"
        color="negative"
        icon="o_refresh"
        @click="retry"
        class="q-mt-md"
        flat
        rounded
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { getMessageFromUnknownError } from 'src/helpers/error-handling.helpers';
import AppButton from 'src/components/misc/AppButton';

withDefaults(
  defineProps<{
    error?: unknown;
    retry?: () => void;
    flat?: boolean;
  }>(),
  {
    flat: false,
  }
);
</script>

<style scoped lang="scss">
.q-card {
  max-width: 400px;
}
</style>
