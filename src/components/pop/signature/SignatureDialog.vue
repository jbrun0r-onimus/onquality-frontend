<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card style="width: 560px; max-width: 95vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ label }}</div>
        <q-space />
        <q-btn icon="o_close" flat round dense @click="onDialogCancel" />
      </q-card-section>

      <q-card-section>
        <div class="text-caption text-grey-6 q-mb-sm">
          Assine no campo abaixo usando o dedo ou o mouse
        </div>
        <signature-canvas ref="canvasRef" :width="500" :height="180" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat color="grey-7" label="Limpar" icon="o_refresh" @click="canvasRef?.clear()" />
        <q-btn flat color="grey-7" label="Cancelar" @click="onDialogCancel" />
        <q-btn color="primary" label="Confirmar" icon="o_check" :loading="saving" @click="confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import SignatureCanvas from './SignatureCanvas.vue';
import { appHandleError } from 'src/helpers/error-handling.helpers';

defineProps<{ label: string }>();
defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
const canvasRef = ref<InstanceType<typeof SignatureCanvas> | null>(null);
const saving = ref(false);

async function confirm() {
  if (!canvasRef.value || canvasRef.value.isEmpty()) {
    appHandleError(new Error('Assine antes de confirmar.'));
    return;
  }
  saving.value = true;
  try {
    const blob = await canvasRef.value.toBlob();
    if (!blob) throw new Error('Erro ao gerar imagem da assinatura.');
    onDialogOK(blob);
  } catch (e) {
    appHandleError(e);
  } finally {
    saving.value = false;
  }
}
</script>
