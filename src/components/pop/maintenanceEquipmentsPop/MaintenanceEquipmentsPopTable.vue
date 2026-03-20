<template>
  <remote-table
    :query="maintenanceEquipmentsListQuery"
    :columns="columns"
    :params="params"
    @update:params="$emit('update:params', $event)"
  >
    <template v-slot:body-cell-actions="{ col, row }">
      <generic-actions-cell
        :col="col"
        :row="row"
        details-can
        @details="openDialog(row, true)"
        edit-can
        @edit="openDialog"
        delete-can
        :delete-action="() => deleteMaintenanceEquipment(row.id)"
        delete-confirm
        :delete-confirm-title="$t('pop.maintenanceEquipmentsPop.titles.delete')"
        :delete-confirm-message="$t('pop.maintenanceEquipmentsPop.misc.deleteConfirmation')"
        :invalidate="maintenanceEquipmentsListQuery"
      />
    </template>
  </remote-table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { QTableColumn, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  maintenanceEquipmentsListQuery,
  deleteMaintenanceEquipment,
} from 'src/services/pop/maintenanceEquipments.service';
import {
  MaintenanceEquipmentsListItem,
  MaintenanceEquipmentsListRequest,
} from 'src/schemas/pop/maintenanceEquipments.schemas';
import RemoteTable from 'src/components/misc/table/RemoteTable.vue';
import GenericActionsCell from 'src/components/misc/table/cells/GenericActionsCell.vue';
import MaintenanceEquipmentsPopDialog from './MaintenanceEquipmentsPopDialog.vue';

defineProps<{ params: MaintenanceEquipmentsListRequest }>();
defineEmits<{ (e: 'update:params', value: MaintenanceEquipmentsListItem): void }>();

const { t } = useI18n();
const $q = useQuasar();

const columns = computed<QTableColumn<MaintenanceEquipmentsListItem>[]>(() => [
  {
    name: 'execution_date',
    label: t('pop.maintenanceEquipmentsPop.fields.executionDate'),
    field: (row) => {
      try {
        return format(new Date(row.execution_date), 'dd/MM/yyyy', { locale: ptBR });
      } catch {
        return row.execution_date;
      }
    },
    align: 'left',
  },
  {
    name: 'is_corrective',
    label: t('pop.maintenanceEquipmentsPop.fields.type'),
    field: (row) => row.is_corrective
      ? t('pop.maintenanceEquipmentsPop.types.corrective')
      : t('pop.maintenanceEquipmentsPop.types.preventive'),
    align: 'left',
  },
  {
    name: 'executed_by',
    label: t('pop.maintenanceEquipmentsPop.fields.executedBy'),
    field: 'executed_by',
    align: 'left',
  },
  {
    name: 'actions',
    label: t('common.fields.actions'),
    field: () => undefined,
    align: 'center',
  },
]);

function openDialog(item: MaintenanceEquipmentsListItem, readonly = false) {
  $q.dialog({
    component: MaintenanceEquipmentsPopDialog,
    componentProps: { item, readonly },
  });
}
</script>
