<template>
  <div class="q-mt-md">
    <div class="text-subtitle2 q-mb-sm">{{ $t('pop.common.evidences') }}</div>

    <div v-if="isLoading" class="row justify-center q-pa-md">
      <q-spinner color="primary" size="32px" />
    </div>

    <div v-else>
      <div v-if="evidences.length" class="row q-gutter-sm q-mb-sm">
        <div
          v-for="evidence in evidences"
          :key="evidence.id"
          class="evidence-thumb relative-position"
        >
          <q-img
            :src="evidence.url"
            :ratio="1"
            class="rounded-borders cursor-pointer"
            style="width: 160px; height: 160px"
            @click="openLightbox(evidence)"
          >
            <template #error>
              <div class="absolute-full flex flex-center bg-grey-3">
                <q-icon name="o_broken_image" color="grey-6" size="32px" />
              </div>
            </template>
          </q-img>
          <q-btn
            v-if="!readonly"
            round
            dense
            icon="o_close"
            color="negative"
            size="xs"
            class="evidence-delete-btn"
            :loading="deletingId === evidence.id"
            @click.stop="confirmDelete(evidence)"
          />
        </div>
      </div>

      <div v-if="!readonly" class="row q-gutter-sm">
        <q-file
          ref="fileInputRef"
          v-model="selectedFiles"
          multiple
          accept="image/*"
          style="display: none"
          @update:model-value="onFilesSelected"
        />
        <q-file
          ref="cameraInputRef"
          v-model="cameraFile"
          accept="image/*"
          capture="environment"
          style="display: none"
          @update:model-value="onCameraFileSelected"
        />
        <q-btn
          outline
          color="primary"
          icon="o_photo_library"
          :label="$t('pop.common.addEvidences')"
          size="sm"
          :loading="isUploading"
          @click="fileInputRef?.pickFiles()"
        />
        <q-btn
          outline
          color="primary"
          icon="o_add_a_photo"
          :label="$t('pop.common.takePhoto')"
          size="sm"
          :loading="isUploading"
          @click="cameraInputRef?.pickFiles()"
        />
      </div>

      <div v-if="!evidences.length && readonly" class="text-grey-6 text-caption">
        {{ $t('pop.common.noEvidences') }}
      </div>
    </div>

    <q-dialog v-model="lightboxOpen" maximized>
      <q-card class="column" style="background: #111">
        <q-card-actions class="q-pa-sm">
          <q-btn flat color="white" icon="o_close" label="Fechar" v-close-popup />
        </q-card-actions>
        <div class="col flex flex-center q-pa-md">
          <q-img
            :src="lightboxEvidence?.url"
            fit="contain"
            style="width: 100%; height: 100%; max-height: calc(100vh - 64px)"
          />
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="confirmDeleteOpen">
      <q-card>
        <q-card-section>
          <div class="text-body1">{{ $t('pop.common.deleteEvidenceConfirmation') }}</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('common.actions.cancel')" v-close-popup />
          <q-btn
            flat
            color="negative"
            :label="$t('common.actions.confirm')"
            :loading="!!deletingId"
            @click="executeDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { QFile } from 'quasar';
import {
  PopEvidence,
  getPopEvidences,
  uploadPopEvidences,
  deletePopEvidence,
} from 'src/services/pop/popEvidence.service';
import { showSuccessFeedback } from 'src/helpers/feedback.helpers';
import { appHandleError } from 'src/helpers/error-handling.helpers';

const props = defineProps<{
  popType: string;
  popId: number | undefined;
  readonly?: boolean;
}>();

const evidences = ref<PopEvidence[]>([]);
const isLoading = ref(false);
const isUploading = ref(false);
const deletingId = ref<number | null>(null);
const selectedFiles = ref<File[]>([]);
const cameraFile = ref<File | null>(null);
const fileInputRef = ref<InstanceType<typeof QFile> | null>(null);
const cameraInputRef = ref<InstanceType<typeof QFile> | null>(null);
const lightboxOpen = ref(false);
const lightboxEvidence = ref<PopEvidence | null>(null);
const confirmDeleteOpen = ref(false);
const pendingDeleteEvidence = ref<PopEvidence | null>(null);

async function loadEvidences() {
  if (!props.popId) return;
  isLoading.value = true;
  try {
    evidences.value = await getPopEvidences(props.popType, props.popId);
  } catch (e) {
    appHandleError(e);
  } finally {
    isLoading.value = false;
  }
}

function onCameraFileSelected(file: File | null) {
  if (file) onFilesSelected([file]);
}

async function onFilesSelected(files: File[] | null) {
  if (!files?.length || !props.popId) return;
  isUploading.value = true;
  try {
    const uploaded = await uploadPopEvidences(props.popType, props.popId, files);
    evidences.value.push(...uploaded);
    showSuccessFeedback('Evidências adicionadas com sucesso.');
  } catch (e) {
    appHandleError(e);
  } finally {
    isUploading.value = false;
    selectedFiles.value = [];
  }
}

function openLightbox(evidence: PopEvidence) {
  lightboxEvidence.value = evidence;
  lightboxOpen.value = true;
}

function confirmDelete(evidence: PopEvidence) {
  pendingDeleteEvidence.value = evidence;
  confirmDeleteOpen.value = true;
}

async function executeDelete() {
  if (!pendingDeleteEvidence.value) return;
  deletingId.value = pendingDeleteEvidence.value.id;
  confirmDeleteOpen.value = false;
  try {
    await deletePopEvidence(pendingDeleteEvidence.value.id);
    evidences.value = evidences.value.filter((e) => e.id !== pendingDeleteEvidence.value!.id);
    showSuccessFeedback('Evidência removida.');
  } catch (e) {
    appHandleError(e);
  } finally {
    deletingId.value = null;
    pendingDeleteEvidence.value = null;
  }
}

watch(() => props.popId, loadEvidences, { immediate: true });
</script>

<style scoped>
.evidence-thumb {
  display: inline-block;
}
.evidence-delete-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  z-index: 1;
}
</style>
