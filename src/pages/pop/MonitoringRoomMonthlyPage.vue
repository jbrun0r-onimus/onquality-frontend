<template>
  <card-page :title="$t('pop.monitoringRoom.titles.monthly')">
    <card-page-section>
      <div class="row q-col-gutter-x-md q-col-gutter-y-sm items-center q-mb-md">
        <div class="col-auto">
          <q-input
            outlined
            dense
            readonly
            :model-value="monthLabel"
            :label="$t('pop.monitoringRoom.monthly.selectMonth')"
            style="min-width: 180px"
          >
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    :model-value="`${selectedYear}/${String(selectedMonth).padStart(2, '0')}/01`"
                    @update:model-value="onDateChange"
                    default-view="Months"
                    emit-immediately
                    mask="YYYY/MM/DD"
                    :navigation-max-year-month="`${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}`"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="OK" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-auto">
          <app-button
            icon="o_picture_as_pdf"
            color="red-7"
            :label="$t('pop.monitoringRoom.monthly.exportPdf')"
            @click="openPrintWindow"
          />
        </div>
        <div class="col-auto">
          <app-button
            icon="o_download"
            color="green-7"
            :label="$t('pop.monitoringRoom.monthly.exportExcel')"
            @click="exportExcel"
          />
        </div>
      </div>

      <div v-if="isLoading" class="text-center q-pa-lg">
        <q-spinner size="40px" color="primary" />
      </div>
      <div v-else-if="error" class="text-negative q-pa-md">
        Erro ao carregar dados.
      </div>
      <div v-else-if="data" class="monthly-grid-wrapper">
        <div class="monthly-header q-mb-sm text-subtitle2">
          Mês/Ano: {{ monthLabel }}
        </div>
        <div class="overflow-auto">
          <table class="monthly-table">
            <thead>
              <tr>
                <th class="location-col">{{ $t('pop.monitoringRoom.fields.location') }}</th>
                <th v-for="d in data.days_in_month" :key="d" class="day-col">{{ d }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in data.rows" :key="row.location">
                <td class="location-col">{{ row.location }}</td>
                <td v-for="d in data.days_in_month" :key="d" class="day-cell">
                  <span v-if="row.days[d] === true" class="text-positive">C</span>
                  <span v-else-if="row.days[d] === false" class="text-negative">NC</span>
                  <span v-else class="text-grey-5">-</span>
                </td>
              </tr>
              <tr v-if="!data.rows.length">
                <td :colspan="data.days_in_month + 1" class="text-center text-grey q-pa-md">
                  Nenhum registro para este mês.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </card-page-section>
  </card-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import CardPage from 'src/components/layout/CardPage.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import AppButton from 'src/components/misc/AppButton/AppButton.vue';
import { getMonitoringRoomMonthly } from 'src/services/pop/monitoringRoom.service';
import type { MonitoringRoomMonthlyResponse } from 'src/schemas/pop/monitoringRoom.schemas';

const now = new Date();
const selectedMonth = ref(now.getMonth() + 1);
const selectedYear = ref(now.getFullYear());

const monthLabel = computed(() => {
  const d = new Date(selectedYear.value, selectedMonth.value - 1, 1);
  return format(d, 'MMMM/yyyy', { locale: ptBR }).replace(/^\w/, (c) => c.toUpperCase());
});

function onDateChange(val: string) {
  if (!val) return;
  const [y, m] = val.split('/').map(Number);
  if (y) selectedYear.value = y;
  if (m) selectedMonth.value = m;
}

const { data, isLoading, error } = useQuery<MonitoringRoomMonthlyResponse>(
  computed(() => ['monitoring-room-monthly', selectedMonth.value, selectedYear.value]),
  () => getMonitoringRoomMonthly(selectedMonth.value, selectedYear.value)
);

function openPrintWindow() {
  const url = `${window.location.origin}${window.location.pathname}#/pop/print/monitoring-room-monthly?month=${selectedMonth.value}&year=${selectedYear.value}`;
  window.open(url, '_blank');
}

function exportExcel() {
  if (!data.value) return;
  const { rows, days_in_month, month, year } = data.value;

  const header = ['Local', ...Array.from({ length: days_in_month }, (_, i) => String(i + 1))];
  const sheetData: (string | number | null)[][] = [header];

  for (const row of rows) {
    const cells: (string | number | null)[] = [row.location];
    for (let d = 1; d <= days_in_month; d++) {
      const val = row.days[d];
      cells.push(val === true ? 'C' : val === false ? 'NC' : '-');
    }
    sheetData.push(cells);
  }

  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Planilha');
  XLSX.writeFile(wb, `frequencia-instalacoes-${String(month).padStart(2, '0')}-${year}.xlsx`);
}
</script>

<style scoped>
.monthly-grid-wrapper {
  overflow-x: auto;
}
.monthly-table {
  border-collapse: collapse;
  min-width: 100%;
  font-size: 12px;
}
.monthly-table th,
.monthly-table td {
  border: 1px solid #ccc;
  padding: 4px 6px;
  text-align: center;
  white-space: nowrap;
}
.location-col {
  text-align: left !important;
  min-width: 180px;
  max-width: 220px;
  font-weight: 500;
}
.day-col {
  min-width: 28px;
  font-weight: bold;
  background: #f5f5f5;
}
.day-cell {
  min-width: 28px;
  font-size: 11px;
}
</style>
