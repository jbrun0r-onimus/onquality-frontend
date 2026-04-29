<template>
  <card-page :title="$t('pop.monitoringEquipments.titles.monthly')">
    <card-page-section>
      <div class="row q-col-gutter-x-md q-col-gutter-y-sm items-center q-mb-md">
        <div class="col-auto">
          <q-input
            outlined
            dense
            readonly
            :model-value="monthLabel"
            :label="$t('pop.monitoringEquipments.monthly.selectMonth')"
            style="min-width: 180px"
          >
            <template #append>
              <q-icon name="o_event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    :model-value="`${selectedYear}/${String(selectedMonth).padStart(2, '0')}/01`"
                    @update:model-value="onDateChange"
                    default-view="Months"
                    emit-immediately
                    mask="YYYY/MM/DD"
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
            :label="$t('pop.monitoringEquipments.monthly.exportPdf')"
            @click="openPrintWindow"
          />
        </div>
      </div>

      <div v-if="isLoading" class="text-center q-pa-lg">
        <q-spinner size="40px" color="primary" />
      </div>
      <div v-else-if="error" class="text-negative q-pa-md">
        Erro ao carregar dados.
      </div>
      <template v-else-if="data">
        <div class="monthly-grid-wrapper q-mb-lg">
          <div class="overflow-auto">
            <table class="monthly-table">
              <thead>
                <tr>
                  <th class="location-col">{{ $t('pop.monitoringEquipments.fields.equipment') }}</th>
                  <th v-for="d in data.days_in_month" :key="d" class="day-col">{{ d }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in data.rows" :key="row.equipment">
                  <td class="location-cell">{{ row.equipment }}</td>
                  <td v-for="d in data.days_in_month" :key="d" class="day-cell">
                    <span v-if="row.days[d] === true" class="text-positive">✓</span>
                    <span v-else-if="row.days[d] === false" class="text-negative">✗</span>
                    <span v-else class="text-grey-4">-</span>
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

        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-4">
            <signature-field
              pop-type="monitoring-equipments-monthly"
              :pop-id="monthlyPopId"
              field-name="executed_by"
              :label="$t('pop.monitoringEquipments.monthly.executedBy')"
            />
          </div>
          <div class="col-12 col-sm-4">
            <signature-field
              pop-type="monitoring-equipments-monthly"
              :pop-id="monthlyPopId"
              field-name="monitored_by"
              :label="$t('pop.monitoringEquipments.monthly.monitoredBy')"
            />
          </div>
          <div class="col-12 col-sm-4">
            <signature-field
              pop-type="monitoring-equipments-monthly"
              :pop-id="monthlyPopId"
              field-name="verified_by"
              :label="$t('pop.monitoringEquipments.monthly.verifiedBy')"
            />
          </div>
        </div>
      </template>
    </card-page-section>
  </card-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CardPage from 'src/components/layout/CardPage.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import AppButton from 'src/components/misc/AppButton/AppButton.vue';
import SignatureField from 'src/components/pop/signature/SignatureField.vue';
import { getMonitoringEquipmentsMonthly } from 'src/services/pop/monitoringEquipments.service';
import type { MonitoringEquipmentsMonthlyResponse } from 'src/schemas/pop/monitoringEquipments.schemas';

const now = new Date();
const selectedMonth = ref(now.getMonth() + 1);
const selectedYear = ref(now.getFullYear());

const monthLabel = computed(() => {
  const d = new Date(selectedYear.value, selectedMonth.value - 1, 1);
  return format(d, 'MMMM/yyyy', { locale: ptBR }).replace(/^\w/, (c: string) => c.toUpperCase());
});

const monthlyPopId = computed(() => selectedYear.value * 100 + selectedMonth.value);

function onDateChange(val: string) {
  if (!val) return;
  const [y, m] = val.split('/').map(Number);
  if (y) selectedYear.value = y;
  if (m) selectedMonth.value = m;
}

const { data, isLoading, error } = useQuery<MonitoringEquipmentsMonthlyResponse>(
  computed(() => ['monitoring-equipments-monthly', selectedMonth.value, selectedYear.value]),
  () => getMonitoringEquipmentsMonthly(selectedMonth.value, selectedYear.value)
);

function openPrintWindow() {
  const url = `${window.location.origin}${window.location.pathname}#/pop/print/monitoring-equipments-monthly?month=${selectedMonth.value}&year=${selectedYear.value}`;
  window.open(url, '_blank');
}
</script>

<style scoped>
.monthly-grid-wrapper {
  overflow-x: auto;
}
.monthly-table {
  border-collapse: collapse;
  min-width: 100%;
  font-size: 13px;
}
.monthly-table th,
.monthly-table td {
  border: 1px solid #ccc;
  padding: 5px 6px;
  text-align: center;
  white-space: nowrap;
}
.location-col {
  text-align: left !important;
  min-width: 190px;
  font-weight: 700;
  background: #f0f4f8;
}
.location-cell {
  text-align: left !important;
  min-width: 190px;
  padding-left: 8px !important;
}
.day-col {
  min-width: 30px;
  font-weight: bold;
  background: #f0f4f8;
}
.day-cell {
  min-width: 30px;
  font-size: 13px;
}
</style>
