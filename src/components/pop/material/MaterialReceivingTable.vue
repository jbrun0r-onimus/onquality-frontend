<template>
  <remote-table
    :query="materialReceivingsQuery"
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
        :delete-action="() => deleteMaterialReceiving(row.id)"
        delete-confirm
        :delete-confirm-title="$t('pop.materialReceiving.titles.delete')"
        :delete-confirm-message="$t('pop.materialReceiving.misc.deleteConfirmation', { supplier: row.supplier })"
        :invalidate="materialReceivingsQuery"
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
  materialReceivingsQuery,
  deleteMaterialReceiving,
} from 'src/services/pop/materialReceiving.service';
import {
  MaterialReceivingListItem,
  MaterialReceivingListRequest,
} from 'src/schemas/pop/materialReceiving.schemas';
import RemoteTable from 'src/components/misc/table/RemoteTable.vue';
import GenericActionsCell from 'src/components/misc/table/cells/GenericActionsCell.vue';
import MaterialReceivingDialog from './MaterialReceivingDialog.vue';

defineProps<{ params: MaterialReceivingListRequest }>();
defineEmits<{ (e: 'update:params', value: MaterialReceivingListItem): void }>();

const { t } = useI18n();
const $q = useQuasar();

const columns = computed<QTableColumn<MaterialReceivingListItem>[]>(() => [
  {
    name: 'supplier',
    label: t('pop.materialReceiving.fields.supplier'),
    field: 'supplier',
    align: 'left',
  },
  {
    name: 'product',
    label: t('pop.materialReceiving.fields.product'),
    field: 'product',
    align: 'left',
  },
  {
    name: 'batch_number',
    label: t('pop.materialReceiving.fields.batchNumber'),
    field: 'batch_number',
    align: 'left',
  },
  {
    name: 'invoice',
    label: t('pop.materialReceiving.fields.invoice'),
    field: 'invoice',
    align: 'left',
  },
  {
    name: 'receiving_date',
    label: t('pop.materialReceiving.fields.receivingDate'),
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
    name: 'performed_by',
    label: t('pop.materialReceiving.fields.performedBy'),
    field: 'performed_by',
    align: 'left',
  },
  {
    name: 'actions',
    label: t('common.fields.actions'),
    field: () => undefined,
    align: 'center',
  },
]);

function openDialog(item: MaterialReceivingListItem, readonly = false) {
  $q.dialog({
    component: MaterialReceivingDialog,
    componentProps: { item, readonly },
  });
}
</script>
