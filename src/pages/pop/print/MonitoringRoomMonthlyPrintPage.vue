<template>
  <div class="pop-print" v-if="data">
    <div class="form-header">
      <div class="company-block">
        <div class="company-name">Agro Mix Rações</div>
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
          <th class="location-col">Áreas de Administração e Sala de Apoio</th>
          <th v-for="d in data.days_in_month" :key="d" class="day-col">{{ d }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data.rows" :key="row.location">
          <td class="location-cell">{{ row.location }}</td>
          <td v-for="d in data.days_in_month" :key="d" class="day-cell">
            <span v-if="row.days[d] === true">✓</span>
            <span v-else-if="row.days[d] === false">NC</span>
            <span v-else>-</span>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="executed-by">
      <span class="label">EXECUTADO POR:</span>
      <span class="line"></span>
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
        <span class="sig-label">MONITORADO POR:</span>
        <span class="sig-line"></span>
      </div>
      <div class="sig-row">
        <span class="sig-label">VERIFICADO POR:</span>
        <span class="sig-line"></span>
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
import { getMonitoringRoomMonthly } from 'src/services/pop/monitoringRoom.service';
import type { MonitoringRoomMonthlyResponse } from 'src/schemas/pop/monitoringRoom.schemas';

const route = useRoute();
const data = ref<MonitoringRoomMonthlyResponse | null>(null);

const month = computed(() => Number(route.query.month));
const year = computed(() => Number(route.query.year));

const monthLabel = computed(() => {
  if (!month.value || !year.value) return '';
  const d = new Date(year.value, month.value - 1, 1);
  return format(d, 'MMMM/yyyy', { locale: ptBR }).replace(/^\w/, (c) => c.toUpperCase());
});

onMounted(async () => {
  data.value = await getMonitoringRoomMonthly(month.value, year.value);
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
}

.company-block {
  border-right: 1px solid #000;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
}

.company-name {
  font-weight: bold;
  font-size: 8pt;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  white-space: nowrap;
}

.form-title-block {
  flex: 1;
  padding: 4px 8px;
  text-align: center;
  border-right: 1px solid #000;
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
  gap: 2px;
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
  padding: 2px 3px;
  text-align: center;
}

.main-table thead th {
  background: #e0e0e0;
  font-weight: bold;
  font-size: 7.5pt;
}

.location-col {
  text-align: left !important;
  min-width: 130px;
  font-size: 8pt;
}

.location-cell {
  text-align: left !important;
  padding-left: 4px !important;
}

.day-col {
  min-width: 16px;
  max-width: 20px;
  font-size: 7pt;
  padding: 2px 1px !important;
}

.day-cell {
  min-width: 16px;
  max-width: 20px;
  padding: 2px 1px !important;
  font-size: 7.5pt;
}

.executed-by {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
  font-size: 9pt;
  font-weight: bold;
}

.executed-by .line {
  flex: 1;
  border-bottom: 1px solid #000;
  min-width: 200px;
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
  font-size: 9pt;
  font-weight: bold;
}

.sig-line {
  flex: 1;
  min-height: 16px;
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
