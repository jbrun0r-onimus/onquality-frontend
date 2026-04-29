<template>
  <remote-table
    :query="maintenanceControlsQuery"
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
        :delete-action="() => deleteMaintenanceControl(row.id)"
        delete-confirm
        :delete-confirm-title="$t('pop.maintenanceControl.titles.delete')"
        :delete-confirm-message="$t('pop.maintenanceControl.misc.deleteConfirmation')"
        :invalidate="maintenanceControlsQuery"
      />
    </template>
  </remote-table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { QTableColumn, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  maintenanceControlsQuery,
  deleteMaintenanceControl,
} from 'src/services/pop/maintenanceControl.service';
import {
  MaintenanceControlListItem,
  MaintenanceControlListRequest,
} from 'src/schemas/pop/maintenanceControl.schemas';
import RemoteTable from 'src/components/misc/table/RemoteTable.vue';
import GenericActionsCell from 'src/components/misc/table/cells/GenericActionsCell.vue';
import MaintenanceControlDialog from './MaintenanceControlDialog.vue';

defineProps<{ params: MaintenanceControlListRequest }>();
defineEmits<{ (e: 'update:params', value: MaintenanceControlListItem): void }>();

const { t } = useI18n();
const $q = useQuasar();

const columns = computed<QTableColumn<MaintenanceControlListItem>[]>(() => [
  {
    name: 'box_number',
    label: t('pop.maintenanceControl.fields.boxNumber'),
    field: (row) => row.box_number === 1
      ? t('pop.maintenanceControl.fields.boxOption1')
      : t('pop.maintenanceControl.fields.boxOption2'),
    align: 'left',
  },
  {
    name: 'execution_date',
    label: t('pop.maintenanceControl.fields.executionDate'),
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
    name: 'employee_name',
    label: t('pop.maintenanceControl.fields.employeeName'),
    field: 'employee_name',
    align: 'left',
  },
  {
    name: 'actions',
    label: t('common.fields.actions'),
    field: () => undefined,
    align: 'center',
  },
]);

function openDialog(item: MaintenanceControlListItem, readonly = false) {
  $q.dialog({
    component: MaintenanceControlDialog,
    componentProps: { item, readonly },
  });
}
</script>
