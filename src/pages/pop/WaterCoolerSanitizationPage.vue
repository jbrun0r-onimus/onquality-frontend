<template>
  <card-page :title="$t('pop.waterCoolerSanitization.titles.list')">
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
      <water-cooler-sanitization-table v-model:params="params" />
    </card-page-section>
  </card-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useUrlQueryRef } from 'src/composables/url.composables';
import { waterCoolerSanitizationListRequestSchema } from 'src/schemas/pop/waterCoolerSanitization.schemas';
import CardPage from 'src/components/layout/CardPage.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import AppButton from 'src/components/misc/AppButton/AppButton.vue';
import WaterCoolerSanitizationTable from 'src/components/pop/waterCoolerSanitization/WaterCoolerSanitizationTable.vue';
import WaterCoolerSanitizationDialog from 'src/components/pop/waterCoolerSanitization/WaterCoolerSanitizationDialog.vue';

const $q = useQuasar();
const params = useUrlQueryRef(waterCoolerSanitizationListRequestSchema);

function openNewDialog() {
  $q.dialog({ component: WaterCoolerSanitizationDialog });
}
</script>
