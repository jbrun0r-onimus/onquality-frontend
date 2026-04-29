<template>
  <card-page :title="$t('pop.maintenanceEquipmentsPop.titles.monthly')">
    <card-page-section>
      <div class="row q-col-gutter-x-md q-col-gutter-y-sm items-center q-mb-md">
        <div class="col-auto">
          <q-input
            outlined
            dense
            readonly
            :model-value="monthLabel"
            :label="$t('pop.maintenanceEquipmentsPop.monthly.selectMonth')"
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
            :label="$t('pop.maintenanceEquipmentsPop.monthly.exportPdf')"
            @click="openPrintWindow"
          />
        </div>
      </div>

      <div v-if="isLoading" class="text-center q-pa-lg">
        <q-spinner size="40px" color="primary" />
      </div>
      <div v-else-if="error" class="text-negative q-pa-md">Erro ao carregar dados.</div>
      <template v-else-if="data">
        <q-markup-table flat bordered dense class="q-mb-lg">
          <thead>
            <tr>
              <th class="text-center" style="width: 90px">DATA</th>
              <th class="text-center" colspan="2">TIPO</th>
              <th class="text-left">DESCRIÇÃO DO PROCEDIMENTO</th>
              <th class="text-center" colspan="2">DIAGNÓSTICO</th>
              <th class="text-left">EXECUTOR</th>
            </tr>
            <tr>
              <th></th>
              <th class="text-center" style="width: 90px">Preventiva</th>
              <th class="text-center" style="width: 90px">Corretiva</th>
              <th></th>
              <th class="text-center" style="width: 60px">OK</th>
              <th class="text-center" style="width: 80px">Danificado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in data.items" :key="item.id">
              <td class="text-center">{{ fromIsoDateDisplay(item.execution_date) }}</td>
              <td class="text-center">{{ item.is_corrective === false ? 'X' : '' }}</td>
              <td class="text-center">{{ item.is_corrective === true ? 'X' : '' }}</td>
              <td>{{ item.descriptions }}</td>
              <td class="text-center">{{ item.is_ok === true ? 'X' : '' }}</td>
              <td class="text-center">{{ item.is_ok === false ? 'X' : '' }}</td>
              <td>{{ item.executed_by }}</td>
            </tr>
            <tr v-if="!data.items.length">
              <td colspan="7" class="text-center text-grey q-pa-md">
                Nenhum registro para este mês.
              </td>
            </tr>
          </tbody>
        </q-markup-table>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <signature-field
              pop-type="maintenance-equipments-monthly"
              :pop-id="monthlyPopId"
              field-name="monitored_by"
              :label="$t('pop.common.monitoredBy')"
            />
          </div>
          <div class="col-12 col-sm-6">
            <signature-field
              pop-type="maintenance-equipments-monthly"
              :pop-id="monthlyPopId"
              field-name="verified_by"
              :label="$t('pop.common.verifiedBy')"
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
import {
  getMaintenanceEquipmentsMonthly,
  fromIsoDateDisplay,
} from 'src/services/pop/maintenanceEquipments.service';
import type { MaintenanceEquipmentsMonthlyResponse } from 'src/schemas/pop/maintenanceEquipments.schemas';

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

const { data, isLoading, error } = useQuery<MaintenanceEquipmentsMonthlyResponse>(
  computed(() => ['maintenance-equipments-monthly', selectedMonth.value, selectedYear.value]),
  () => getMaintenanceEquipmentsMonthly(selectedMonth.value, selectedYear.value)
);

function openPrintWindow() {
  const url = `${window.location.origin}${window.location.pathname}#/pop/print/maintenance-equipments-monthly?month=${selectedMonth.value}&year=${selectedYear.value}`;
  window.open(url, '_blank');
}
</script>
