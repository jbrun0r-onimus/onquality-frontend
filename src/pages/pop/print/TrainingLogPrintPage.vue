<template>
  <div class="pop-print" v-if="data">
    <!-- Header -->
    <div class="form-header">
      <div class="header-main">
        <div class="logo-block">
          <img src="/agromix-logo.png" alt="Agro Mix Rações" class="logo-img" />
        </div>
        <div class="header-right">
          <div class="form-title-block">
            <div class="form-title">FORMULÁRIO DE REGISTRO DE TREINAMENTO</div>
          </div>
          <div class="date-row">
            <div class="date-cell"><strong>Data:</strong> {{ data.execution_date }}</div>
            <div class="carga-cell"><strong>Carga horária:</strong> {{ data.workload }}</div>
            <div class="version-cell">Versão: 04</div>
          </div>
        </div>
      </div>
      <div class="info-row"><strong>Instrutor:</strong> {{ data.instructor }}</div>
      <div class="info-row"><strong>Formação profissional:</strong> {{ data.professional_formation }}</div>
      <div class="info-row content-row">
        <div><strong>Conteúdo programático:</strong></div>
        <div>{{ data.programmatic_content }}</div>
      </div>
    </div>

    <!-- Participants table -->
    <table class="participants-table">
      <thead>
        <tr>
          <th class="num-col">Nº</th>
          <th class="name-col">NOME DO FUNCIONÁRIO</th>
          <th class="sig-col">ASSINATURA (legível)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(p, i) in data.participants" :key="p.id">
          <td class="num-cell">{{ i + 1 }}</td>
          <td class="name-cell">{{ p.employee_name }}</td>
          <td class="sig-cell">
            <img
              v-if="participantSigs[p.id]"
              :src="participantSigs[p.id]"
              class="sig-img"
            />
          </td>
        </tr>
        <!-- Blank rows to fill at least 12 lines -->
        <tr v-for="n in blankRows" :key="'blank-' + n">
          <td class="num-cell">{{ (data.participants?.length ?? 0) + n }}</td>
          <td class="name-cell">&nbsp;</td>
          <td class="sig-cell">&nbsp;</td>
        </tr>
      </tbody>
    </table>

    <!-- Footer -->
    <div class="form-footer">
      <table class="footer-table">
        <tbody>
          <tr>
            <th class="footer-th">MONITORADO POR:</th>
            <td class="footer-td">
              <img v-if="sigMonitoredBy" :src="sigMonitoredBy" class="sig-img" />
            </td>
          </tr>
          <tr>
            <th class="footer-th">VERIFICADO POR:</th>
            <td class="footer-td">
              <img v-if="sigVerifiedBy" :src="sigVerifiedBy" class="sig-img" />
            </td>
          </tr>
          <tr>
            <th class="footer-th obs-th">OBSERVAÇÕES</th>
            <td class="footer-td footer-td-obs">{{ data.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-else class="loading">Carregando...</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getTrainingLog } from 'src/services/pop/trainingLog.service';
import { getPopSignatures } from 'src/services/pop/popSignature.service';
import type { TrainingLogDetail } from 'src/schemas/pop/trainingLog.schemas';

const route = useRoute();
const data = ref<TrainingLogDetail | null>(null);
const sigMonitoredBy = ref<string | null>(null);
const sigVerifiedBy = ref<string | null>(null);
const participantSigs = ref<Record<number, string>>({});

const MIN_ROWS = 12;
const blankRows = computed(() => {
  const count = data.value?.participants?.length ?? 0;
  return Math.max(0, MIN_ROWS - count);
});

onMounted(async () => {
  const id = Number(route.params.id);
  const [detail, sigs] = await Promise.all([
    getTrainingLog(id),
    getPopSignatures('training-log', id),
  ]);
  data.value = detail;
  sigMonitoredBy.value = sigs.find((s) => s.field_name === 'monitored_by')?.url ?? null;
  sigVerifiedBy.value = sigs.find((s) => s.field_name === 'verified_by')?.url ?? null;

  // Load signatures for each participant
  if (detail.participants?.length) {
    const partSigPromises = detail.participants.map((p) =>
      getPopSignatures('training-log-participant', p.id)
    );
    const partSigsAll = await Promise.all(partSigPromises);
    const sigsMap: Record<number, string> = {};
    detail.participants.forEach((p, i) => {
      const sig = partSigsAll[i]?.find((s) => s.field_name === 'signature');
      if (sig) sigsMap[p.id] = sig.url;
    });
    participantSigs.value = sigsMap;
  }

  const prevTitle = document.title;
  setTimeout(() => {
    document.title = '';
    window.print();
    document.title = prevTitle;
  }, 800);
});
</script>

<style>
.pop-print { font-family: Arial, sans-serif; font-size: 10pt; padding: 15mm; max-width: 210mm; margin: 0 auto; box-sizing: border-box; }

/* Header */
.form-header { border: 1px solid #000; display: flex; flex-direction: column; margin-bottom: 8px; }
.header-main { display: flex; border-bottom: 1px solid #000; }
.logo-block { width: 18%; border-right: 1px solid #000; display: flex; align-items: center; justify-content: center; padding: 4px; flex-shrink: 0; }
.logo-img { max-width: 100%; max-height: 70px; object-fit: contain; }
.header-right { flex: 1; display: flex; flex-direction: column; }
.form-title-block { border-bottom: 1px solid #000; display: flex; align-items: center; justify-content: center; padding: 6px 10px; }
.form-title { font-weight: bold; font-size: 11pt; text-transform: uppercase; text-align: center; }
.date-row { display: flex; flex-direction: row; }
.date-cell { flex: 1; border-right: 1px solid #000; font-size: 9pt; padding: 4px 6px; }
.carga-cell { flex: 1; border-right: 1px solid #000; font-size: 9pt; padding: 4px 6px; }
.version-cell { font-size: 9pt; padding: 4px 6px; white-space: nowrap; }
.info-row { padding: 3px 8px; font-size: 9pt; border-top: 1px solid #000; }
.content-row { min-height: 2.5em; }

/* Participants table */
.participants-table { width: 100%; border-collapse: collapse; border: 1px solid #000; margin-bottom: 8px; }
.participants-table th, .participants-table td { border: 1px solid #000; padding: 2px 6px; }
.participants-table th { background: #f0f0f0; font-weight: bold; text-align: center; font-size: 9pt; }
.num-col { width: 40px; text-align: center; }
.name-col { width: 45%; }
.sig-col { width: 55%; }
.num-cell { text-align: center; font-size: 9pt; }
.name-cell { font-size: 9pt; }
.sig-cell { min-height: 28px; }

/* Footer */
.form-footer { margin-top: 4px; }
.footer-table { width: 100%; border-collapse: collapse; border: 1px solid #000; }
.footer-th { background: #f0f0f0; border: 1px solid #000; padding: 2px 8px; font-size: 9pt; font-weight: bold; text-align: left; white-space: nowrap; width: 1%; vertical-align: middle; }
.footer-td { border: 1px solid #000; padding: 2px 8px; height: 1.8em; vertical-align: middle; font-size: 9pt; }
.obs-th { vertical-align: top; padding-top: 6px; }
.footer-td-obs { height: 5em; vertical-align: top; padding: 4px 8px; }
.sig-img { max-height: 36px; max-width: 240px; object-fit: contain; display: block; }

.loading { padding: 20px; text-align: center; }
@media print {
  @page { margin: 0; size: A4; }
  html, body { margin: 0; }
  .pop-print { max-width: 100%; }
}
</style>
