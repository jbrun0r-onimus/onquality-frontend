<template>
  <card-page :title="$t('pop.monitoringRoom.titles.list')">
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
      <monitoring-room-table v-model:params="params" />
    </card-page-section>
  </card-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useUrlQueryRef } from 'src/composables/url.composables';
import { monitoringRoomListRequestSchema } from 'src/schemas/pop/monitoringRoom.schemas';
import CardPage from 'src/components/layout/CardPage.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import AppButton from 'src/components/misc/AppButton/AppButton.vue';
import MonitoringRoomTable from 'src/components/pop/monitoringRoom/MonitoringRoomTable.vue';
import MonitoringRoomDialog from 'src/components/pop/monitoringRoom/MonitoringRoomDialog.vue';

const $q = useQuasar();
const params = useUrlQueryRef(monitoringRoomListRequestSchema);

function openNewDialog() {
  $q.dialog({ component: MonitoringRoomDialog });
}
</script>
