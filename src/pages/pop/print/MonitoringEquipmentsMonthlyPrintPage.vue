<template>
  <div class="pop-print" v-if="data">
    <div class="form-header">
      <div class="logo-block">
        <img src="/agromix-logo.png" alt="Agro Mix Rações" class="logo-img" />
      </div>
      <div class="form-title-block">
        <div class="form-title">
          PLANILHA DE FREQUÊNCIA E MONITORAMENTO DE LIMPEZA E HIGIENIZAÇÃO DAS INSTALAÇÕES, EQUIPAMENTOS E UTENSÍLIOS
        </div>
        <div class="form-month">Mês/ano: {{ monthLabel }}</div>
      </div>
      <div class="version-block">
        <div>PL 04</div>
        <div>Versão: 04</div>
      </div>
    </div>

    <table class="main-table">
      <thead>
        <tr>
          <th class="location-col">EQUIPAMENTOS E UTENSÍLIOS</th>
          <th v-for="d in data.days_in_month" :key="d" class="day-col">{{ d }}</th>
          <th class="day-col">-</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data.rows" :key="row.equipment">
          <td class="location-cell">{{ row.equipment }}</td>
          <td v-for="d in data.days_in_month" :key="d" class="day-cell">
            <span v-if="row.days[d] === true">✓</span>
            <span v-else-if="row.days[d] === false">✗</span>
            <span v-else>-</span>
          </td>
          <td class="day-cell">-</td>
        </tr>
      </tbody>
    </table>

    <div class="executed-by-row">
      <span class="sig-label-bold">EXECUTADO POR:</span>
      <div class="sig-content">
        <img v-if="sigExecutedBy" :src="sigExecutedBy" class="sig-img" />
        <span v-else class="sig-blank-line"></span>
      </div>
    </div>

    <table class="corrective-table">
      <thead>
        <tr>
          <th colspan="2" class="corrective-header">AÇÕES CORRETIVAS</th>
        </tr>
        <tr>
          <th class="date-col">DATA</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr><td class="date-col"></td><td></td></tr>
        <tr><td class="date-col"></td><td></td></tr>
      </tbody>
    </table>

    <div class="signatures">
      <div class="sig-row">
        <span class="sig-label-bold">MONITORADO POR:</span>
        <div class="sig-content">
          <img v-if="sigMonitoredBy" :src="sigMonitoredBy" class="sig-img" />
          <span v-else class="sig-blank-line"></span>
        </div>
      </div>
      <div class="sig-row">
        <span class="sig-label-bold">VERIFICADO POR:</span>
        <div class="sig-content">
          <img v-if="sigVerifiedBy" :src="sigVerifiedBy" class="sig-img" />
          <span v-else class="sig-blank-line"></span>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">Carregando...</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getMonitoringEquipmentsMonthly } from 'src/services/pop/monitoringEquipments.service';
import { getPopSignatures } from 'src/services/pop/popSignature.service';
import type { MonitoringEquipmentsMonthlyResponse } from 'src/schemas/pop/monitoringEquipments.schemas';

const route = useRoute();
const data = ref<MonitoringEquipmentsMonthlyResponse | null>(null);
const sigExecutedBy = ref<string | null>(null);
const sigMonitoredBy = ref<string | null>(null);
const sigVerifiedBy = ref<string | null>(null);

const month = computed(() => Number(route.query.month));
const year = computed(() => Number(route.query.year));

const monthLabel = computed(() => {
  if (!month.value || !year.value) return '';
  const d = new Date(year.value, month.value - 1, 1);
  return format(d, 'MMMM/yyyy', { locale: ptBR }).replace(/^\w/, (c: string) => c.toUpperCase());
});

onMounted(async () => {
  const popId = year.value * 100 + month.value;
  const [monthlyData, sigs] = await Promise.all([
    getMonitoringEquipmentsMonthly(month.value, year.value),
    getPopSignatures('monitoring-equipments-monthly', popId),
  ]);
  data.value = monthlyData;
  sigExecutedBy.value = sigs.find((s) => s.field_name === 'executed_by')?.url ?? null;
  sigMonitoredBy.value = sigs.find((s) => s.field_name === 'monitored_by')?.url ?? null;
  sigVerifiedBy.value = sigs.find((s) => s.field_name === 'verified_by')?.url ?? null;
  setTimeout(() => window.print(), 800);
});
</script>

<style>
* { box-sizing: border-box; }
body { margin: 0; padding: 0; }

.pop-print {
  font-family: Arial, sans-serif;
  font-size: 9pt;
  padding: 10mm;
  max-width: 297mm;
  margin: 0 auto;
}

.form-header {
  display: flex;
  border: 1px solid #000;
  margin-bottom: 4px;
  align-items: stretch;
}

.logo-block {
  border-right: 1px solid #000;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 70px;
}

.logo-img {
  max-height: 50px;
  max-width: 60px;
  object-fit: contain;
}

.form-title-block {
  flex: 1;
  padding: 4px 8px;
  text-align: center;
  border-right: 1px solid #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-title {
  font-weight: bold;
  font-size: 8pt;
  text-transform: uppercase;
  line-height: 1.3;
}

.form-month {
  font-size: 9pt;
  margin-top: 4px;
  font-weight: bold;
}

.version-block {
  padding: 6px 10px;
  text-align: center;
  font-size: 9pt;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  min-width: 70px;
}

.main-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #000;
  margin-bottom: 8px;
  font-size: 8pt;
}

.main-table th,
.main-table td {
  border: 1px solid #000;
  padding: 2px 2px;
  text-align: center;
}

.main-table thead th {
  background: #e0e0e0;
  font-weight: bold;
  font-size: 7pt;
}

.location-col {
  text-align: left !important;
  min-width: 130px;
  font-size: 7.5pt;
  padding-left: 4px !important;
}

.location-cell {
  text-align: left !important;
  padding-left: 4px !important;
  font-size: 8pt;
}

.day-col {
  min-width: 14px;
  max-width: 18px;
  font-size: 6.5pt;
  padding: 2px 1px !important;
}

.day-cell {
  min-width: 14px;
  max-width: 18px;
  padding: 2px 1px !important;
  font-size: 7.5pt;
}

.executed-by-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
  font-size: 9pt;
  border: 1px solid #000;
  padding: 4px 8px;
  min-height: 36px;
}

.sig-label-bold {
  font-weight: bold;
  white-space: nowrap;
  font-size: 9pt;
}

.sig-content {
  flex: 1;
  display: flex;
  align-items: center;
  min-height: 28px;
}

.sig-img {
  max-height: 32px;
  max-width: 180px;
  object-fit: contain;
}

.sig-blank-line {
  flex: 1;
  border-bottom: 1px solid #999;
  display: block;
  min-width: 100px;
}

.corrective-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #000;
  margin-bottom: 8px;
  font-size: 8pt;
}

.corrective-table th,
.corrective-table td {
  border: 1px solid #000;
  padding: 4px 6px;
}

.corrective-header {
  text-align: center;
  font-weight: bold;
  background: #e0e0e0;
}

.date-col {
  width: 80px;
  text-align: center;
}

.corrective-table tbody tr td {
  height: 20px;
}

.signatures {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sig-row {
  display: flex;
  align-items: center;
  border: 1px solid #000;
  padding: 4px 8px;
  gap: 8px;
  min-height: 36px;
}

.loading {
  padding: 20px;
  text-align: center;
}

@media print {
  .pop-print {
    padding: 0;
    margin: 0;
    max-width: 100%;
  }
  @page {
    size: A4 landscape;
    margin: 10mm;
  }
}
</style>
