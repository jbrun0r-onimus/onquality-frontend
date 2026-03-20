<template>
  <card-page :title="$t('pop.maintenanceEquipmentsPop.titles.list')">
    <card-page-section>
      <div class="row q-col-gutter-x-md q-col-gutter-y-sm justify-end">
        <div>
          <app-button class="full-height" icon="o_add" :label="$t('common.actions.new')" @click="openNewDialog" />
        </div>
      </div>
      <maintenance-equipments-pop-table v-model:params="params" />
    </card-page-section>
  </card-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useUrlQueryRef } from 'src/composables/url.composables';
import { maintenanceEquipmentsListRequestSchema } from 'src/schemas/pop/maintenanceEquipments.schemas';
import CardPage from 'src/components/layout/CardPage.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import AppButton from 'src/components/misc/AppButton/AppButton.vue';
import MaintenanceEquipmentsPopTable from 'src/components/pop/maintenanceEquipmentsPop/MaintenanceEquipmentsPopTable.vue';
import MaintenanceEquipmentsPopDialog from 'src/components/pop/maintenanceEquipmentsPop/MaintenanceEquipmentsPopDialog.vue';

const $q = useQuasar();
const params = useUrlQueryRef(maintenanceEquipmentsListRequestSchema);

function openNewDialog() {
  $q.dialog({ component: MaintenanceEquipmentsPopDialog });
}
</script>
