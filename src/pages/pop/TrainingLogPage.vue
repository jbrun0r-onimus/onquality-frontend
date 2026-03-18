<template>
  <card-page :title="$t('pop.trainingLog.titles.list')">
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
      <training-log-table v-model:params="params" />
    </card-page-section>
  </card-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useUrlQueryRef } from 'src/composables/url.composables';
import { trainingLogListRequestSchema } from 'src/schemas/pop/trainingLog.schemas';
import CardPage from 'src/components/layout/CardPage.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import AppButton from 'src/components/misc/AppButton/AppButton.vue';
import TrainingLogTable from 'src/components/pop/trainingLog/TrainingLogTable.vue';
import TrainingLogDialog from 'src/components/pop/trainingLog/TrainingLogDialog.vue';

const $q = useQuasar();
const params = useUrlQueryRef(trainingLogListRequestSchema);

function openNewDialog() {
  $q.dialog({ component: TrainingLogDialog });
}
</script>
