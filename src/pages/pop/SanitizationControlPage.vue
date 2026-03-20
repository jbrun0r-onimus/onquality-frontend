<template>
  <card-page :title="$t('pop.sanitizationControl.titles.list')">
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
      <sanitization-control-table v-model:params="params" />
    </card-page-section>
  </card-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useUrlQueryRef } from 'src/composables/url.composables';
import { sanitizationControlListRequestSchema } from 'src/schemas/pop/sanitizationControl.schemas';
import CardPage from 'src/components/layout/CardPage.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import AppButton from 'src/components/misc/AppButton/AppButton.vue';
import SanitizationControlTable from 'src/components/pop/sanitizationControl/SanitizationControlTable.vue';
import SanitizationControlDialog from 'src/components/pop/sanitizationControl/SanitizationControlDialog.vue';

const $q = useQuasar();
const params = useUrlQueryRef(sanitizationControlListRequestSchema);

function openNewDialog() {
  $q.dialog({ component: SanitizationControlDialog });
}
</script>
