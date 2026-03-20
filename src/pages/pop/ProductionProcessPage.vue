<template>
  <card-page :title="$t('pop.productionProcess.titles.list')">
    <card-page-section>
      <div class="row q-col-gutter-x-md q-col-gutter-y-sm justify-end">
        <div>
          <app-button class="full-height" icon="o_add" :label="$t('common.actions.new')" @click="openNewDialog" />
        </div>
      </div>
      <production-process-table v-model:params="params" />
    </card-page-section>
  </card-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useUrlQueryRef } from 'src/composables/url.composables';
import { productionProcessListRequestSchema } from 'src/schemas/pop/productionProcess.schemas';
import CardPage from 'src/components/layout/CardPage.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import AppButton from 'src/components/misc/AppButton/AppButton.vue';
import ProductionProcessTable from 'src/components/pop/productionProcess/ProductionProcessTable.vue';
import ProductionProcessDialog from 'src/components/pop/productionProcess/ProductionProcessDialog.vue';

const $q = useQuasar();
const params = useUrlQueryRef(productionProcessListRequestSchema);

function openNewDialog() {
  $q.dialog({ component: ProductionProcessDialog });
}
</script>
