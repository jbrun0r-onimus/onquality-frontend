<template>
  <card-page :title="$t('pop.cleaningEfficiency.titles.list')">
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
      <cleaning-efficiency-table v-model:params="params" />
    </card-page-section>
  </card-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useUrlQueryRef } from 'src/composables/url.composables';
import { cleaningEfficiencyListRequestSchema } from 'src/schemas/pop/cleaningEfficiency.schemas';
import CardPage from 'src/components/layout/CardPage.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import AppButton from 'src/components/misc/AppButton/AppButton.vue';
import CleaningEfficiencyTable from 'src/components/pop/cleaningEfficiency/CleaningEfficiencyTable.vue';
import CleaningEfficiencyDialog from 'src/components/pop/cleaningEfficiency/CleaningEfficiencyDialog.vue';

const $q = useQuasar();
const params = useUrlQueryRef(cleaningEfficiencyListRequestSchema);

function openNewDialog() {
  $q.dialog({ component: CleaningEfficiencyDialog });
}
</script>
