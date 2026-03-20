<template>
  <card-page :title="$t('pop.checkListPest.titles.list')">
    <card-page-section>
      <div class="row q-col-gutter-x-md q-col-gutter-y-sm justify-end">
        <div>
          <app-button class="full-height" icon="o_add" :label="$t('common.actions.new')" @click="openNewDialog" />
        </div>
      </div>
      <check-list-pest-table v-model:params="params" />
    </card-page-section>
  </card-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useUrlQueryRef } from 'src/composables/url.composables';
import { checkListPestListRequestSchema } from 'src/schemas/pop/checkListPest.schemas';
import CardPage from 'src/components/layout/CardPage.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import AppButton from 'src/components/misc/AppButton/AppButton.vue';
import CheckListPestTable from 'src/components/pop/checkListPest/CheckListPestTable.vue';
import CheckListPestDialog from 'src/components/pop/checkListPest/CheckListPestDialog.vue';

const $q = useQuasar();
const params = useUrlQueryRef(checkListPestListRequestSchema);

function openNewDialog() {
  $q.dialog({ component: CheckListPestDialog });
}
</script>
