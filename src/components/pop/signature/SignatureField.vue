<template>
  <div class="signature-field">
    <div class="text-caption text-grey-6 q-mb-xs">{{ label }}</div>

    <div v-if="isLoading" class="flex items-center q-gutter-xs q-py-sm">
      <q-spinner color="primary" size="18px" />
      <span class="text-caption text-grey-6">Carregando...</span>
    </div>

    <div v-else>
      <div v-if="signature" class="signature-preview q-mb-xs">
        <q-img
          :src="signature.url"
          fit="contain"
          class="signature-img rounded-borders"
          @click="previewOpen = true"
        >
          <template #error>
            <div class="flex flex-center bg-grey-2" style="height: 80px">
              <q-icon name="o_broken_image" color="grey-5" size="28px" />
            </div>
          </template>
        </q-img>
        <div v-if="signature.signer_name" class="text-caption text-grey-7 q-mt-xs">
          {{ signature.signer_name }}
        </div>
      </div>

      <div v-if="!readonly" class="row q-gutter-sm q-mt-xs">
        <q-btn
          outline
          color="primary"
          :icon="signature ? 'o_edit' : 'o_draw'"
          :label="signature ? 'Reasinar' : 'Assinar'"
          size="sm"
          :loading="uploading"
          @click="openSignatureDialog"
        />
        <q-btn
          v-if="signature"
          outline
          color="negative"
          icon="o_delete"
          label="Remover"
          size="sm"
          :loading="deleting"
          @click="confirmRemove"
        />
      </div>

      <div v-if="!signature && readonly" class="text-grey-6 text-caption q-py-xs">
        Sem assinatura registrada.
      </div>
    </div>

    <q-dialog v-model="previewOpen">
      <q-card style="max-width: 90vw">
        <q-img :src="signature?.url" fit="contain" style="max-width: 90vw; max-height: 70vh" />
        <q-card-actions align="right">
          <q-btn flat label="Fechar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmDeleteOpen">
      <q-card>
        <q-card-section>
          <div class="text-body1">Deseja remover esta assinatura?</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat color="negative" label="Remover" :loading="deleting" @click="executeDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import {
  PopSignature,
  getPopSignatures,
  uploadPopSignature,
  deletePopSignature,
} from 'src/services/pop/popSignature.service';
import { appHandleError } from 'src/helpers/error-handling.helpers';
import { showSuccessFeedback } from 'src/helpers/feedback.helpers';
import SignatureDialog from './SignatureDialog.vue';

const props = defineProps<{
  popType: string;
  popId: number | undefined;
  fieldName: string;
  label: string;
  readonly?: boolean;
}>();

const $q = useQuasar();
const signature = ref<PopSignature | null>(null);
const isLoading = ref(false);
const uploading = ref(false);
const deleting = ref(false);
const previewOpen = ref(false);
const confirmDeleteOpen = ref(false);

async function load() {
  if (!props.popId) return;
  isLoading.value = true;
  try {
    const all = await getPopSignatures(props.popType, props.popId);
    signature.value = all.find((s) => s.field_name === props.fieldName) ?? null;
  } catch (e) {
    appHandleError(e);
  } finally {
    isLoading.value = false;
  }
}

function openSignatureDialog() {
  $q.dialog({ component: SignatureDialog, componentProps: { label: props.label } }).onOk(
    async (blob: Blob) => {
      if (!props.popId) return;
      uploading.value = true;
      try {
        signature.value = await uploadPopSignature(props.popType, props.popId, props.fieldName, blob);
        showSuccessFeedback('Assinatura registrada com sucesso.');
      } catch (e) {
        appHandleError(e);
      } finally {
        uploading.value = false;
      }
    }
  );
}

function confirmRemove() {
  confirmDeleteOpen.value = true;
}

async function executeDelete() {
  if (!signature.value) return;
  deleting.value = true;
  confirmDeleteOpen.value = false;
  try {
    await deletePopSignature(signature.value.id);
    signature.value = null;
    showSuccessFeedback('Assinatura removida.');
  } catch (e) {
    appHandleError(e);
  } finally {
    deleting.value = false;
  }
}

watch(() => props.popId, load, { immediate: true });
</script>

<style scoped>
.signature-field {
  width: 100%;
}
.signature-preview {
  max-width: 260px;
}
.signature-img {
  width: 100%;
  height: 80px;
  background: #fafafa;
  border: 1px solid #e0e0e0;
  cursor: pointer;
}
</style>
