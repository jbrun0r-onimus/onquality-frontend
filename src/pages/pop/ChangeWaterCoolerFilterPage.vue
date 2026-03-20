<template>
  <card-page :title="$t('pop.changeWaterCoolerFilter.titles.list')">
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
      <change-water-cooler-filter-table v-model:params="params" />
    </card-page-section>
  </card-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useUrlQueryRef } from 'src/composables/url.composables';
import { changeWaterCoolerFilterListRequestSchema } from 'src/schemas/pop/changeWaterCoolerFilter.schemas';
import CardPage from 'src/components/layout/CardPage.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import AppButton from 'src/components/misc/AppButton/AppButton.vue';
import ChangeWaterCoolerFilterTable from 'src/components/pop/changeWaterCoolerFilter/ChangeWaterCoolerFilterTable.vue';
import ChangeWaterCoolerFilterDialog from 'src/components/pop/changeWaterCoolerFilter/ChangeWaterCoolerFilterDialog.vue';

const $q = useQuasar();
const params = useUrlQueryRef(changeWaterCoolerFilterListRequestSchema);

function openNewDialog() {
  $q.dialog({ component: ChangeWaterCoolerFilterDialog });
}
</script>
