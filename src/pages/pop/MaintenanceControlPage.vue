<template>
  <card-page :title="$t('pop.maintenanceControl.titles.list')">
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
      <maintenance-control-table v-model:params="params" />
    </card-page-section>
  </card-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useUrlQueryRef } from 'src/composables/url.composables';
import { maintenanceControlListRequestSchema } from 'src/schemas/pop/maintenanceControl.schemas';
import CardPage from 'src/components/layout/CardPage.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import AppButton from 'src/components/misc/AppButton/AppButton.vue';
import MaintenanceControlTable from 'src/components/pop/maintenanceControl/MaintenanceControlTable.vue';
import MaintenanceControlDialog from 'src/components/pop/maintenanceControl/MaintenanceControlDialog.vue';

const $q = useQuasar();
const params = useUrlQueryRef(maintenanceControlListRequestSchema);

function openNewDialog() {
  $q.dialog({ component: MaintenanceControlDialog });
}
</script>
