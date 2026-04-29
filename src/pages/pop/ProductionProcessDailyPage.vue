<template>
  <card-page :title="$t('pop.productionProcess.titles.daily')">
    <card-page-section>
      <div class="row q-col-gutter-x-md q-col-gutter-y-sm items-center q-mb-md">
        <div class="col-auto">
          <q-input
            outlined
            dense
            readonly
            :model-value="dayLabel"
            :label="$t('pop.productionProcess.daily.selectDay')"
            style="min-width: 180px"
          >
            <template #append>
              <q-icon name="o_event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    :model-value="`${selectedYear}/${String(selectedMonth).padStart(2, '0')}/${String(selectedDay).padStart(2, '0')}`"
                    @update:model-value="onDateChange"
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
            :label="$t('pop.productionProcess.daily.exportPdf')"
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
        <q-table
          :rows="data.items"
          :columns="columns"
          row-key="id"
          flat
          bordered
          dense
          :rows-per-page-options="[0]"
          hide-pagination
          class="q-mb-lg"
        >
          <template #no-data>
            <div class="full-width text-center text-grey q-pa-md">
              Nenhum registro para este dia.
            </div>
          </template>
        </q-table>

        <div class="row q-col-gutter-md q-mt-md">
          <div class="col-12 col-sm-6">
            <signature-field
              pop-type="production-process-daily"
              :pop-id="dailyPopId"
              field-name="monitored_by"
              :label="$t('pop.productionProcess.daily.monitoredBy')"
            />
          </div>
          <div class="col-12 col-sm-6">
            <signature-field
              pop-type="production-process-daily"
              :pop-id="dailyPopId"
              field-name="verified_by"
              :label="$t('pop.productionProcess.daily.verifiedBy')"
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
import { QTableColumn } from 'quasar';
import { useI18n } from 'vue-i18n';
import CardPage from 'src/components/layout/CardPage.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import AppButton from 'src/components/misc/AppButton/AppButton.vue';
import SignatureField from 'src/components/pop/signature/SignatureField.vue';
import { getProductionProcessDaily } from 'src/services/pop/productionProcess.service';
import type { ProductionProcessDailyResponse, ProductionProcessDailyItem } from 'src/schemas/pop/productionProcess.schemas';

const { t } = useI18n();

const now = new Date();
const selectedDay = ref(now.getDate());
const selectedMonth = ref(now.getMonth() + 1);
const selectedYear = ref(now.getFullYear());

const dayLabel = computed(() => {
  const d = new Date(selectedYear.value, selectedMonth.value - 1, selectedDay.value);
  return format(d, 'dd/MM/yyyy', { locale: ptBR });
});

const dailyPopId = computed(
  () => selectedYear.value * 10000 + selectedMonth.value * 100 + selectedDay.value
);

function onDateChange(val: string) {
  if (!val) return;
  const [y, m, d] = val.split('/').map(Number);
  if (y) selectedYear.value = y;
  if (m) selectedMonth.value = m;
  if (d) selectedDay.value = d;
}

const columns = computed<QTableColumn<ProductionProcessDailyItem>[]>(() => [
  {
    name: 'execution_date',
    label: t('pop.productionProcess.fields.executionDate'),
    field: (row) => row.execution_date ?? '-',
    align: 'left',
    style: 'white-space: nowrap',
  },
  {
    name: 'product',
    label: t('pop.productionProcess.fields.product'),
    field: (row) => row.product ?? '-',
    align: 'left',
  },
  {
    name: 'frequency',
    label: t('pop.productionProcess.fields.frequency'),
    field: (row) => row.frequency ?? '-',
    align: 'left',
  },
  {
    name: 'parameter',
    label: t('pop.productionProcess.fields.parameter'),
    field: (row) => row.parameter ?? '-',
    align: 'left',
  },
  {
    name: 'corrective_action',
    label: t('pop.productionProcess.fields.correctiveAction'),
    field: (row) => row.corrective_action ?? '-',
    align: 'left',
  },
  {
    name: 'employee_name',
    label: t('pop.productionProcess.fields.employeeName'),
    field: (row) => row.employee_name ?? '-',
    align: 'left',
  },
]);

const { data, isLoading, error } = useQuery<ProductionProcessDailyResponse>(
  computed(() => ['production-process-daily', selectedDay.value, selectedMonth.value, selectedYear.value]),
  () => getProductionProcessDaily(selectedDay.value, selectedMonth.value, selectedYear.value)
);

function openPrintWindow() {
  const url = `${window.location.origin}${window.location.pathname}#/pop/print/production-process-daily?day=${selectedDay.value}&month=${selectedMonth.value}&year=${selectedYear.value}`;
  window.open(url, '_blank');
}
</script>
