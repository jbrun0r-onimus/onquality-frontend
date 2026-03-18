<template>
  <card-page :title="$t('pop.cargoInspection.titles.list')">
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
      <cargo-inspection-table v-model:params="params" />
    </card-page-section>
  </card-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useUrlQueryRef } from 'src/composables/url.composables';
import { cargoInspectionListRequestSchema } from 'src/schemas/pop/cargoInspection.schemas';
import CardPage from 'src/components/layout/CardPage.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import AppButton from 'src/components/misc/AppButton/AppButton.vue';
import CargoInspectionTable from 'src/components/pop/cargo/CargoInspectionTable.vue';
import CargoInspectionDialog from 'src/components/pop/cargo/CargoInspectionDialog.vue';

const $q = useQuasar();
const params = useUrlQueryRef(cargoInspectionListRequestSchema);

function openNewDialog() {
  $q.dialog({ component: CargoInspectionDialog });
}
</script>
