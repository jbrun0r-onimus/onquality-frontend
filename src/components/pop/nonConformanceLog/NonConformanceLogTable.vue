<template>
  <remote-table
    :query="nonConformanceLogsQuery"
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
        :delete-action="() => deleteNonConformanceLog(row.id)"
        delete-confirm
        :delete-confirm-title="$t('pop.nonConformanceLog.titles.delete')"
        :delete-confirm-message="$t('pop.nonConformanceLog.misc.deleteConfirmation')"
        :invalidate="nonConformanceLogsQuery"
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
  nonConformanceLogsQuery,
  deleteNonConformanceLog,
} from 'src/services/pop/nonConformanceLog.service';
import {
  NonConformanceLogListItem,
  NonConformanceLogListRequest,
} from 'src/schemas/pop/nonConformanceLog.schemas';
import RemoteTable from 'src/components/misc/table/RemoteTable.vue';
import GenericActionsCell from 'src/components/misc/table/cells/GenericActionsCell.vue';
import NonConformanceLogDialog from './NonConformanceLogDialog.vue';

defineProps<{ params: NonConformanceLogListRequest }>();
defineEmits<{ (e: 'update:params', value: NonConformanceLogListItem): void }>();

const { t } = useI18n();
const $q = useQuasar();

const columns = computed<QTableColumn<NonConformanceLogListItem>[]>(() => [
  {
    name: 'receiving_date',
    label: t('pop.nonConformanceLog.fields.receivingDate'),
    field: (row) => {
      try {
        return format(new Date(row.receiving_date), 'dd/MM/yyyy', { locale: ptBR });
      } catch {
        return row.receiving_date;
      }
    },
    align: 'left',
  },
  {
    name: 'product',
    label: t('pop.nonConformanceLog.fields.product'),
    field: 'product',
    align: 'left',
  },
  {
    name: 'address',
    label: t('pop.nonConformanceLog.fields.address'),
    field: 'address',
    align: 'left',
  },
  {
    name: 'is_approved',
    label: t('pop.nonConformanceLog.fields.isApproved'),
    field: (row) => row.is_approved ? t('pop.common.sim') : t('pop.common.nao'),
    align: 'center',
  },
  {
    name: 'actions',
    label: t('common.fields.actions'),
    field: () => undefined,
    align: 'center',
  },
]);

function openDialog(item: NonConformanceLogListItem, readonly = false) {
  $q.dialog({
    component: NonConformanceLogDialog,
    componentProps: { item, readonly },
  });
}
</script>
