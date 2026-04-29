<template>
  <div class="pop-print" v-if="data">
    <div class="form-header">
      <div class="header-main">
        <div class="logo-block">
          <img src="/agromix-logo.png" alt="Agro Mix Rações" class="logo-img" />
        </div>
        <div class="header-right">
          <div class="form-title-block">
            <div class="form-title">PLANILHA DE AVALIAÇÃO DA MANUTENÇÃO E CONTROLE DE REGISTROS DE HIGIENIZAÇÃO DO RESERVATÓRIO DE ÁGUA</div>
          </div>
          <div class="date-version-block">
            <div class="date-cell">Versão: 04 &nbsp;&nbsp; PL-05</div>
            <div class="version-cell">ANO: {{ year }}</div>
          </div>
        </div>
      </div>
      <div class="freq-row"><strong>FREQUÊNCIA:</strong> Semestral</div>
    </div>

    <div class="section-title">CONTROLE DE HIGIENIZAÇÃO</div>
    <table class="data-table">
      <thead>
        <tr>
          <th class="num-col" rowspan="2">Nº da caixa</th>
          <th rowspan="2">Data da higienização</th>
          <th rowspan="2">Data da próxima higienização</th>
          <th colspan="2">Eficiência da higienização</th>
          <th rowspan="2">Executado por</th>
        </tr>
        <tr>
          <th class="cn-col">C</th>
          <th class="cn-col">NC</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center">{{ data.box_number }}</td>
          <td class="text-center">{{ formatDate(data.execution_date) }}</td>
          <td class="text-center">{{ formatDate(data.next_execution_date) }}</td>
          <td class="text-center">{{ data.question1 === true ? 'X' : '' }}</td>
          <td class="text-center">{{ data.question1 === false ? 'X' : '' }}</td>
          <td>{{ data.employee_name }}</td>
        </tr>
        <tr v-for="n in 4" :key="n"><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>
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
            <th class="footer-th obs-th">OBSERVAÇÕES:</th>
            <td class="footer-td footer-td-obs"></td>
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
import { parse, format } from 'date-fns';
import { getSanitizationControl } from 'src/services/pop/sanitizationControl.service';
import { getPopSignatures } from 'src/services/pop/popSignature.service';
import type { SanitizationControlDetail } from 'src/schemas/pop/sanitizationControl.schemas';

const route = useRoute();
const data = ref<SanitizationControlDetail | null>(null);
const sigMonitoredBy = ref<string | null>(null);
const sigVerifiedBy = ref<string | null>(null);

const year = computed(() => {
  if (!data.value?.execution_date) return new Date().getFullYear();
  try {
    return parse(data.value.execution_date, 'dd/MM/yyyy', new Date()).getFullYear();
  } catch { return new Date().getFullYear(); }
});

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  try { return format(parse(dateStr, 'dd/MM/yyyy', new Date()), 'dd/MM/yyyy'); } catch { return dateStr; }
}

onMounted(async () => {
  const id = Number(route.params.id);
  const [detail, sigs] = await Promise.all([
    getSanitizationControl(id),
    getPopSignatures('sanitization-control', id),
  ]);
  data.value = detail;
  sigMonitoredBy.value = sigs.find((s) => s.field_name === 'monitored_by')?.url ?? null;
  sigVerifiedBy.value = sigs.find((s) => s.field_name === 'verified_by')?.url ?? null;
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

.form-header { border: 1px solid #000; display: flex; flex-direction: column; margin-bottom: 6px; }
.header-main { display: flex; border-bottom: 1px solid #000; }
.logo-block { width: 18%; border-right: 1px solid #000; display: flex; align-items: center; justify-content: center; padding: 4px; flex-shrink: 0; }
.logo-img { max-width: 100%; max-height: 70px; object-fit: contain; }
.header-right { flex: 1; display: flex; flex-direction: column; }
.form-title-block { border-bottom: 1px solid #000; display: flex; align-items: center; justify-content: center; padding: 6px 10px; }
.form-title { font-weight: bold; font-size: 9.5pt; text-transform: uppercase; text-align: center; }
.date-version-block { display: flex; flex-direction: row; }
.date-cell { flex: 1; border-right: 1px solid #000; font-size: 9pt; padding: 4px 6px; display: flex; align-items: center; }
.version-cell { font-size: 9pt; padding: 4px 6px; display: flex; align-items: center; }
.freq-row { padding: 3px 8px; font-size: 9pt; }

.section-title { font-weight: bold; font-size: 9pt; text-align: center; background: #d0d0d0; border: 1px solid #000; border-bottom: none; padding: 3px; margin-top: 8px; }
.data-table { width: 100%; border-collapse: collapse; border: 1px solid #000; margin-bottom: 8px; }
.data-table th, .data-table td { border: 1px solid #000; padding: 3px 5px; font-size: 9pt; }
.data-table th { background: #f0f0f0; font-weight: bold; text-align: center; }
.data-table td { height: 20px; }
.num-col { width: 70px; }
.cn-col { width: 40px; }
.text-center { text-align: center; }

.form-footer { margin-top: 8px; }
.footer-table { width: 100%; border-collapse: collapse; border: 1px solid #000; }
.footer-th { background: #f0f0f0; border: 1px solid #000; padding: 2px 8px; font-size: 9pt; font-weight: bold; text-align: left; white-space: nowrap; width: 1%; vertical-align: middle; }
.footer-td { border: 1px solid #000; padding: 2px 8px; height: 1.8em; vertical-align: middle; font-size: 9pt; }
.obs-th { vertical-align: top; padding-top: 6px; }
.footer-td-obs { height: 5em; vertical-align: top; }
.sig-img { max-height: 36px; max-width: 200px; object-fit: contain; display: block; }

.loading { padding: 20px; text-align: center; }
@media print {
  @page { margin: 0; size: A4; }
  html, body { margin: 0; }
  .pop-print { max-width: 100%; }
}
</style>
