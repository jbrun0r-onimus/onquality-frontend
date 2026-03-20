<template>
  <remote-table
    :query="cleaningSuppliesControlsQuery"
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
        :delete-action="() => deleteCleaningSuppliesControl(row.id)"
        delete-confirm
        :delete-confirm-title="$t('pop.cleaningSuppliesControl.titles.delete')"
        :delete-confirm-message="$t('pop.cleaningSuppliesControl.misc.deleteConfirmation')"
        :invalidate="cleaningSuppliesControlsQuery"
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
  cleaningSuppliesControlsQuery,
  deleteCleaningSuppliesControl,
} from 'src/services/pop/cleaningSuppliesControl.service';
import {
  CleaningSuppliesControlListItem,
  CleaningSuppliesControlListRequest,
} from 'src/schemas/pop/cleaningSuppliesControl.schemas';
import RemoteTable from 'src/components/misc/table/RemoteTable.vue';
import GenericActionsCell from 'src/components/misc/table/cells/GenericActionsCell.vue';
import CleaningSuppliesControlDialog from './CleaningSuppliesControlDialog.vue';

defineProps<{ params: CleaningSuppliesControlListRequest }>();
defineEmits<{ (e: 'update:params', value: CleaningSuppliesControlListItem): void }>();

const { t } = useI18n();
const $q = useQuasar();

const columns = computed<QTableColumn<CleaningSuppliesControlListItem>[]>(() => [
  {
    name: 'execution_date',
    label: t('pop.cleaningSuppliesControl.fields.executionDate'),
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
    name: 'product',
    label: t('pop.cleaningSuppliesControl.fields.product'),
    field: 'product',
    align: 'left',
  },
  {
    name: 'weight',
    label: t('pop.cleaningSuppliesControl.fields.weight'),
    field: 'weight',
    align: 'left',
  },
  {
    name: 'actions',
    label: t('common.fields.actions'),
    field: () => undefined,
    align: 'center',
  },
]);

function openDialog(item: CleaningSuppliesControlListItem, readonly = false) {
  $q.dialog({
    component: CleaningSuppliesControlDialog,
    componentProps: { item, readonly },
  });
}
</script>
