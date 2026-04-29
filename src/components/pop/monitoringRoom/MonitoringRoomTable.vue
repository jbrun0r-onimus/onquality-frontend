<template>
  <remote-table
    :query="monitoringRoomsQuery"
    :columns="columns"
    :params="params"
    @update:params="$emit('update:params', $event)"
  >
    <template v-slot:body-cell-is_cleaning="{ col, row }">
      <q-td :props="{ col }">
        <q-badge v-if="row.is_cleaning === true" color="green" label="SIM" />
        <q-badge v-else-if="row.is_cleaning === false" color="red" label="NÃO" />
        <span v-else class="text-grey">-</span>
      </q-td>
    </template>
    <template v-slot:body-cell-actions="{ col, row }">
      <generic-actions-cell
        :col="col"
        :row="row"
        details-can
        @details="openDialog(row, true)"
        edit-can
        @edit="openDialog"
        delete-can
        :delete-action="() => deleteMonitoringRoom(row.id)"
        delete-confirm
        :delete-confirm-title="$t('pop.monitoringRoom.titles.delete')"
        :delete-confirm-message="$t('pop.monitoringRoom.misc.deleteConfirmation', { location: row.location })"
        :invalidate="monitoringRoomsQuery"
      />
    </template>
  </remote-table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { QTableColumn, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { parse, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  monitoringRoomsQuery,
  deleteMonitoringRoom,
} from 'src/services/pop/monitoringRoom.service';
import {
  MonitoringRoomListItem,
  MonitoringRoomListRequest,
} from 'src/schemas/pop/monitoringRoom.schemas';
import RemoteTable from 'src/components/misc/table/RemoteTable.vue';
import GenericActionsCell from 'src/components/misc/table/cells/GenericActionsCell.vue';
import MonitoringRoomDialog from './MonitoringRoomDialog.vue';

defineProps<{ params: MonitoringRoomListRequest }>();
defineEmits<{ (e: 'update:params', value: MonitoringRoomListItem): void }>();

const { t } = useI18n();
const $q = useQuasar();

const columns = computed<QTableColumn<MonitoringRoomListItem>[]>(() => [
  {
    name: 'execution_date',
    label: t('pop.monitoringRoom.fields.executionDate'),
    field: (row) => {
      try {
        return format(parse(row.execution_date, 'dd-MM-yyyy', new Date()), 'dd/MM/yyyy', { locale: ptBR });
      } catch {
        return row.execution_date;
      }
    },
    align: 'left',
  },
  {
    name: 'location',
    label: t('pop.monitoringRoom.fields.location'),
    field: 'location',
    align: 'left',
  },
  {
    name: 'is_cleaning',
    label: t('pop.monitoringRoom.fields.isCleaning'),
    field: () => undefined,
    align: 'center',
  },
  {
    name: 'actions',
    label: t('common.fields.actions'),
    field: () => undefined,
    align: 'center',
  },
]);

function openDialog(item: MonitoringRoomListItem, readonly = false) {
  $q.dialog({
    component: MonitoringRoomDialog,
    componentProps: { item, readonly },
  });
}
</script>
