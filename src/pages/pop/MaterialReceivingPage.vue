<template>
  <card-page :title="$t('pop.materialReceiving.titles.list')">
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
      <material-receiving-table v-model:params="params" />
    </card-page-section>
  </card-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useUrlQueryRef } from 'src/composables/url.composables';
import { materialReceivingListRequestSchema } from 'src/schemas/pop/materialReceiving.schemas';
import CardPage from 'src/components/layout/CardPage.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import AppButton from 'src/components/misc/AppButton/AppButton.vue';
import MaterialReceivingTable from 'src/components/pop/material/MaterialReceivingTable.vue';
import MaterialReceivingDialog from 'src/components/pop/material/MaterialReceivingDialog.vue';

const $q = useQuasar();
const params = useUrlQueryRef(materialReceivingListRequestSchema);

function openNewDialog() {
  $q.dialog({ component: MaterialReceivingDialog });
}
</script>
