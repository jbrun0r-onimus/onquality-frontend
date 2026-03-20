<template>
  <card-page :title="$t('pop.cleaningSuppliesControl.titles.list')">
    <card-page-section>
      <div class="row q-col-gutter-x-md q-col-gutter-y-sm justify-end">
        <div>
          <app-button class="full-height" icon="o_add" :label="$t('common.actions.new')" @click="openNewDialog" />
        </div>
      </div>
      <cleaning-supplies-control-table v-model:params="params" />
    </card-page-section>
  </card-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useUrlQueryRef } from 'src/composables/url.composables';
import { cleaningSuppliesControlListRequestSchema } from 'src/schemas/pop/cleaningSuppliesControl.schemas';
import CardPage from 'src/components/layout/CardPage.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import AppButton from 'src/components/misc/AppButton/AppButton.vue';
import CleaningSuppliesControlTable from 'src/components/pop/cleaningSuppliesControl/CleaningSuppliesControlTable.vue';
import CleaningSuppliesControlDialog from 'src/components/pop/cleaningSuppliesControl/CleaningSuppliesControlDialog.vue';

const $q = useQuasar();
const params = useUrlQueryRef(cleaningSuppliesControlListRequestSchema);

function openNewDialog() {
  $q.dialog({ component: CleaningSuppliesControlDialog });
}
</script>
