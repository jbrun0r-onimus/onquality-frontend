<template>
  <div class="pop-print" v-if="data">
    <!-- Header -->
    <div class="form-header">
      <div class="header-main">
        <div class="logo-block">
          <img src="/agromix-logo.png" alt="Agro Mix Rações" class="logo-img" />
        </div>
        <div class="title-block">
          PLANILHA DE MANUTENÇÃO DE EQUIPAMENTOS E INSTRUMENTOS – PL-07
        </div>
      </div>
      <div class="sub-header">
        <div class="equipment-cell"><strong>EQUIPAMENTO/INSTRUMENTO:</strong></div>
        <div class="month-cell"><strong>MÊS/ANO:</strong> {{ monthLabel }}</div>
        <div class="version-cell">Versão: 04</div>
      </div>
    </div>

    <!-- Main table -->
    <table class="main-table">
      <thead>
        <tr>
          <th class="date-col" rowspan="2">DATA</th>
          <th colspan="2">TIPO</th>
          <th class="desc-col" rowspan="2">DESCRIÇÃO DO PROCEDIMENTO</th>
          <th colspan="2">DIAGNÓSTICO</th>
          <th class="exec-col" rowspan="2">EXECUTOR</th>
        </tr>
        <tr>
          <th class="type-col">PREVENTIVA</th>
          <th class="type-col">CORRETIVA</th>
          <th class="diag-col">OK</th>
          <th class="diag-col">DANIFICADO</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data.items" :key="item.id">
          <td class="text-center">{{ formatDate(item.execution_date) }}</td>
          <td class="text-center">{{ item.is_corrective === false ? 'X' : '' }}</td>
          <td class="text-center">{{ item.is_corrective === true ? 'X' : '' }}</td>
          <td>{{ item.descriptions }}</td>
          <td class="text-center">{{ item.is_ok === true ? 'X' : '' }}</td>
          <td class="text-center">{{ item.is_ok === false ? 'X' : '' }}</td>
          <td>{{ item.executed_by }}</td>
        </tr>
        <!-- Blank filler rows -->
        <tr v-for="n in blankRows" :key="'b' + n">
          <td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
      </tbody>
    </table>

    <!-- Footer signatures -->
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
      </tbody>
    </table>
  </div>
  <div v-else class="loading">Carregando...</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { parse, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getMaintenanceEquipmentsMonthly } from 'src/services/pop/maintenanceEquipments.service';
import { getPopSignatures } from 'src/services/pop/popSignature.service';
import type { MaintenanceEquipmentsMonthlyResponse } from 'src/schemas/pop/maintenanceEquipments.schemas';

const route = useRoute();
const data = ref<MaintenanceEquipmentsMonthlyResponse | null>(null);
const sigMonitoredBy = ref<string | null>(null);
const sigVerifiedBy = ref<string | null>(null);

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const monthLabel = computed(() => {
  if (!data.value) return '';
  return `${MONTHS_PT[data.value.month - 1]}/${data.value.year}`;
});

const MIN_ROWS = 12;
const blankRows = computed(() =>
  Math.max(0, MIN_ROWS - (data.value?.items.length ?? 0))
);

function formatDate(apiDate: string | null | undefined): string {
  if (!apiDate) return '';
  try {
    return format(parse(apiDate, 'dd-MM-yyyy', new Date()), 'dd/MM/yyyy', { locale: ptBR });
  } catch { return apiDate ?? ''; }
}

onMounted(async () => {
  const month = Number(route.query.month);
  const year = Number(route.query.year);
  const popId = year * 100 + month;

  const [detail, sigs] = await Promise.all([
    getMaintenanceEquipmentsMonthly(month, year),
    getPopSignatures('maintenance-equipments-monthly', popId),
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
.pop-print { font-family: Arial, sans-serif; font-size: 9pt; padding: 12mm; max-width: 297mm; margin: 0 auto; box-sizing: border-box; }

/* Header */
.form-header { border: 1px solid #000; display: flex; flex-direction: column; margin-bottom: 10px; }
.header-main { display: flex; border-bottom: 1px solid #000; }
.logo-block { width: 130px; border-right: 1px solid #000; display: flex; align-items: center; justify-content: center; padding: 4px; flex-shrink: 0; }
.logo-img { max-width: 110px; max-height: 65px; object-fit: contain; }
.title-block { flex: 1; display: flex; align-items: center; justify-content: center; padding: 8px 12px; font-weight: bold; font-size: 11pt; text-transform: uppercase; text-align: center; }
.sub-header { display: flex; }
.equipment-cell { flex: 1; border-right: 1px solid #000; padding: 4px 8px; font-size: 9pt; }
.month-cell { width: 180px; border-right: 1px solid #000; padding: 4px 8px; font-size: 9pt; }
.version-cell { width: 80px; padding: 4px 8px; font-size: 9pt; display: flex; align-items: center; }

/* Main table */
.main-table { width: 100%; border-collapse: collapse; border: 1px solid #000; margin-bottom: 8px; }
.main-table th, .main-table td { border: 1px solid #000; padding: 2px 5px; font-size: 8.5pt; }
.main-table th { background: #d8d8d8; font-weight: bold; text-align: center; }
.main-table td { height: 18px; }
.date-col { width: 75px; }
.type-col { width: 75px; }
.desc-col { min-width: 200px; }
.diag-col { width: 65px; }
.exec-col { width: 120px; }
.text-center { text-align: center; }

/* Footer */
.footer-table { width: 60%; border-collapse: collapse; border: 1px solid #000; }
.footer-th { background: #d8d8d8; border: 1px solid #000; padding: 3px 8px; font-size: 9pt; font-weight: bold; text-align: left; white-space: nowrap; width: 1%; }
.footer-td { border: 1px solid #000; padding: 2px 8px; height: 2em; vertical-align: middle; }
.sig-img { max-height: 36px; max-width: 200px; object-fit: contain; display: block; }

.loading { padding: 20px; text-align: center; }
@media print {
  @page { margin: 0; size: A4 landscape; }
  html, body { margin: 0; }
  .pop-print { max-width: 100%; }
}
</style>
