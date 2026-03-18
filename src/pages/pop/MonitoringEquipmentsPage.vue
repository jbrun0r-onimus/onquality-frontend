<template>
  <card-page :title="$t('pop.monitoringEquipments.titles.list')">
    <card-page-section>
      <div class="row q-col-gutter-x-md q-col-gutter-y-sm justify-end">
        <div>
          <app-button
            class="full-height"
            icon="o_add"
            :label="$t('common.actions.new')"
            @click="openNewDialog"
          />
        </div>
      </div>
      <monitoring-equipments-table v-model:params="params" />
    </card-page-section>
  </card-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useUrlQueryRef } from 'src/composables/url.composables';
import { monitoringEquipmentsListRequestSchema } from 'src/schemas/pop/monitoringEquipments.schemas';
import CardPage from 'src/components/layout/CardPage.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import AppButton from 'src/components/misc/AppButton/AppButton.vue';
import MonitoringEquipmentsTable from 'src/components/pop/monitoringEquipments/MonitoringEquipmentsTable.vue';
import MonitoringEquipmentsDialog from 'src/components/pop/monitoringEquipments/MonitoringEquipmentsDialog.vue';

const $q = useQuasar();
const params = useUrlQueryRef(monitoringEquipmentsListRequestSchema);

function openNewDialog() {
  $q.dialog({ component: MonitoringEquipmentsDialog });
}
</script>
