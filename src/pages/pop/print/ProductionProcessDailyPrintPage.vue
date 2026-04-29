<template>
  <div class="pop-print" v-if="data">
    <div class="form-header">
      <div class="logo-block">
        <img src="/agromix-logo.png" alt="Agro Mix Rações" class="logo-img" />
      </div>
      <div class="form-title-block">
        <div class="form-title">PLANILHA DE CONTROLE DO PROCESSO PRODUTIVO</div>
        <div class="form-date">Data: {{ dateLabel }}</div>
      </div>
      <div class="version-block">
        <div>PL 12</div>
        <div>Versão: 01</div>
      </div>
    </div>

    <table class="main-table">
      <thead>
        <tr>
          <th class="col-hora">HORA</th>
          <th class="col-produto">PRODUTO</th>
          <th class="col-freq">FREQUÊNCIA</th>
          <th class="col-param">PARÂMETROS MONITORADOS</th>
          <th class="col-action">AÇÃO CORRETIVA</th>
          <th class="col-exec">EXECUTOR</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tableRows" :key="item.id ?? Math.random()">
          <td class="col-hora">{{ item.time }}</td>
          <td class="col-produto">{{ item.product }}</td>
          <td class="col-freq">{{ item.frequency }}</td>
          <td class="col-param">{{ item.parameter }}</td>
          <td class="col-action">{{ item.corrective_action }}</td>
          <td class="col-exec">{{ item.employee_name }}</td>
        </tr>
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
import { getProductionProcessDaily } from 'src/services/pop/productionProcess.service';
import { getPopSignatures } from 'src/services/pop/popSignature.service';
import type { ProductionProcessDailyResponse, ProductionProcessDailyItem } from 'src/schemas/pop/productionProcess.schemas';

const MIN_ROWS = 16;

const route = useRoute();
const data = ref<ProductionProcessDailyResponse | null>(null);
const sigMonitoredBy = ref<string | null>(null);
const sigVerifiedBy = ref<string | null>(null);

const day = computed(() => Number(route.query.day));
const month = computed(() => Number(route.query.month));
const year = computed(() => Number(route.query.year));

const dateLabel = computed(() => {
  if (!day.value || !month.value || !year.value) return '';
  const d = new Date(year.value, month.value - 1, day.value);
  return format(d, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
});

interface TableRow {
  id: number | null;
  time: string;
  product: string;
  frequency: string;
  parameter: string;
  corrective_action: string;
  employee_name: string;
}

const tableRows = computed<TableRow[]>(() => {
  const items: TableRow[] = (data.value?.items ?? []).map((item: ProductionProcessDailyItem) => ({
    id: item.id,
    time: item.execution_date ? item.execution_date.split(' ')[1] ?? '' : '',
    product: item.product ?? '',
    frequency: item.frequency ?? '',
    parameter: item.parameter ?? '',
    corrective_action: item.corrective_action ?? '',
    employee_name: item.employee_name ?? '',
  }));
  const padCount = Math.max(0, MIN_ROWS - items.length);
  for (let i = 0; i < padCount; i++) {
    items.push({ id: null, time: '', product: '', frequency: '', parameter: '', corrective_action: '', employee_name: '' });
  }
  return items;
});

onMounted(async () => {
  const popId = year.value * 10000 + month.value * 100 + day.value;
  const [dailyData, sigs] = await Promise.all([
    getProductionProcessDaily(day.value, month.value, year.value),
    getPopSignatures('production-process-daily', popId),
  ]);
  data.value = dailyData;
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
  font-size: 9pt;
  text-transform: uppercase;
  line-height: 1.3;
}

.form-date {
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
  padding: 3px 4px;
  vertical-align: middle;
}

.main-table thead th {
  background: #e0e0e0;
  font-weight: bold;
  text-align: center;
  font-size: 7.5pt;
}

.main-table tbody td {
  height: 18px;
  font-size: 8pt;
}

.col-hora { width: 50px; text-align: center; }
.col-produto { width: 100px; }
.col-freq { width: 80px; }
.col-param { }
.col-action { width: 130px; }
.col-exec { width: 90px; }

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
