<template>
  <remote-table
    :query="sanitizationControlsQuery"
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
        :delete-action="() => deleteSanitizationControl(row.id)"
        delete-confirm
        :delete-confirm-title="$t('pop.sanitizationControl.titles.delete')"
        :delete-confirm-message="$t('pop.sanitizationControl.misc.deleteConfirmation')"
        :invalidate="sanitizationControlsQuery"
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
  sanitizationControlsQuery,
  deleteSanitizationControl,
} from 'src/services/pop/sanitizationControl.service';
import {
  SanitizationControlListItem,
  SanitizationControlListRequest,
} from 'src/schemas/pop/sanitizationControl.schemas';
import RemoteTable from 'src/components/misc/table/RemoteTable.vue';
import GenericActionsCell from 'src/components/misc/table/cells/GenericActionsCell.vue';
import SanitizationControlDialog from './SanitizationControlDialog.vue';

defineProps<{ params: SanitizationControlListRequest }>();
defineEmits<{ (e: 'update:params', value: SanitizationControlListItem): void }>();

const { t } = useI18n();
const $q = useQuasar();

const columns = computed<QTableColumn<SanitizationControlListItem>[]>(() => [
  {
    name: 'box_number',
    label: t('pop.sanitizationControl.fields.boxNumber'),
    field: (row) => row.box_number === 1
      ? t('pop.sanitizationControl.fields.boxOption1')
      : t('pop.sanitizationControl.fields.boxOption2'),
    align: 'left',
  },
  {
    name: 'execution_date',
    label: t('pop.sanitizationControl.fields.executionDate'),
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
    label: t('pop.sanitizationControl.fields.employeeName'),
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

function openDialog(item: SanitizationControlListItem, readonly = false) {
  $q.dialog({
    component: SanitizationControlDialog,
    componentProps: { item, readonly },
  });
}
</script>
