<template>
  <app-dialog
    ref="dialogRef"
    :title="title"
    card-class="text-center"
    max-width="512px"
    @hide="onDialogHide"
  >
    <card-page-section class="q-my-lg">
      <span class="message">{{ message }}</span>
    </card-page-section>

    <q-card-actions class="gap-2" align="center">
      <app-button
        :color="cancelColor"
        :label="cancelLabel || $t('common.actions.cancel')"
        @click="onDialogCancel"
        outline
      />
      <app-button
        :color="okColor"
        :label="okLabel || $t('common.actions.confirm')"
        @click="onDialogOK"
      />
    </q-card-actions>
  </app-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import AppDialog from 'src/components/layout/AppDialog.vue';
import AppButton from 'src/components/misc/AppButton';

withDefaults(
  defineProps<{
    title: string;
    message: string;
    okLabel?: string;
    cancelLabel?: string;
    okColor?: string;
    cancelColor?: string;
  }>(),
  {
    okColor: 'positive',
    cancelColor: 'grey-6',
  }
);

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();
</script>

<style scoped lang="scss">
.message {
  font-size: 16px;
  line-height: 19px;
}
</style>
