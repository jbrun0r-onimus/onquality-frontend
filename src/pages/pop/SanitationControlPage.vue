<template>
  <card-page :title="$t('pop.sanitationControl.titles.list')">
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
      <sanitation-control-table v-model:params="params" />
    </card-page-section>
  </card-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useUrlQueryRef } from 'src/composables/url.composables';
import { sanitationControlListRequestSchema } from 'src/schemas/pop/sanitationControl.schemas';
import CardPage from 'src/components/layout/CardPage.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import AppButton from 'src/components/misc/AppButton/AppButton.vue';
import SanitationControlTable from 'src/components/pop/sanitationControl/SanitationControlTable.vue';
import SanitationControlDialog from 'src/components/pop/sanitationControl/SanitationControlDialog.vue';

const $q = useQuasar();
const params = useUrlQueryRef(sanitationControlListRequestSchema);

function openNewDialog() {
  $q.dialog({ component: SanitationControlDialog });
}
</script>
