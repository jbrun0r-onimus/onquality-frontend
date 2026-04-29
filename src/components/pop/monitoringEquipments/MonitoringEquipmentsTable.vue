<template>
  <remote-table
    :query="monitoringEquipmentsQuery"
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
        :delete-action="() => deleteMonitoringEquipment(row.id)"
        delete-confirm
        :delete-confirm-title="$t('pop.monitoringEquipments.titles.delete')"
        :delete-confirm-message="$t('pop.monitoringEquipments.misc.deleteConfirmation', { equipment: row.equipment })"
        :invalidate="monitoringEquipmentsQuery"
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
  monitoringEquipmentsQuery,
  deleteMonitoringEquipment,
} from 'src/services/pop/monitoringEquipments.service';
import {
  MonitoringEquipmentsListItem,
  MonitoringEquipmentsListRequest,
} from 'src/schemas/pop/monitoringEquipments.schemas';
import RemoteTable from 'src/components/misc/table/RemoteTable.vue';
import GenericActionsCell from 'src/components/misc/table/cells/GenericActionsCell.vue';
import MonitoringEquipmentsDialog from './MonitoringEquipmentsDialog.vue';

defineProps<{ params: MonitoringEquipmentsListRequest }>();
defineEmits<{ (e: 'update:params', value: MonitoringEquipmentsListItem): void }>();

const { t } = useI18n();
const $q = useQuasar();

const columns = computed<QTableColumn<MonitoringEquipmentsListItem>[]>(() => [
  {
    name: 'execution_date',
    label: t('pop.monitoringEquipments.fields.executionDate'),
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
    name: 'equipment',
    label: t('pop.monitoringEquipments.fields.equipment'),
    field: 'equipment',
    align: 'left',
  },
  {
    name: 'is_cleaning',
    label: t('pop.monitoringEquipments.fields.isCleaning'),
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

function openDialog(item: MonitoringEquipmentsListItem, readonly = false) {
  $q.dialog({
    component: MonitoringEquipmentsDialog,
    componentProps: { item, readonly },
  });
}
</script>
