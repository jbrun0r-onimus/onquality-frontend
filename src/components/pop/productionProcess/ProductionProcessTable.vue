<template>
  <remote-table
    :query="productionProcessesQuery"
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
        :delete-action="() => deleteProductionProcess(row.id)"
        delete-confirm
        :delete-confirm-title="$t('pop.productionProcess.titles.delete')"
        :delete-confirm-message="$t('pop.productionProcess.misc.deleteConfirmation')"
        :invalidate="productionProcessesQuery"
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
  productionProcessesQuery,
  deleteProductionProcess,
} from 'src/services/pop/productionProcess.service';
import {
  ProductionProcessListItem,
  ProductionProcessListRequest,
} from 'src/schemas/pop/productionProcess.schemas';
import RemoteTable from 'src/components/misc/table/RemoteTable.vue';
import GenericActionsCell from 'src/components/misc/table/cells/GenericActionsCell.vue';
import ProductionProcessDialog from './ProductionProcessDialog.vue';

defineProps<{ params: ProductionProcessListRequest }>();
defineEmits<{ (e: 'update:params', value: ProductionProcessListItem): void }>();

const { t } = useI18n();
const $q = useQuasar();

const columns = computed<QTableColumn<ProductionProcessListItem>[]>(() => [
  {
    name: 'execution_date',
    label: t('pop.productionProcess.fields.executionDate'),
    field: (row) => {
      if (!row.execution_date) return '-';
      try {
        return format(parse(row.execution_date, 'dd-MM-yyyy', new Date()), 'dd/MM/yyyy HH:mm', { locale: ptBR });
      } catch {
        return row.execution_date;
      }
    },
    align: 'left',
  },
  {
    name: 'product',
    label: t('pop.productionProcess.fields.product'),
    field: (row) => row.product ?? '-',
    align: 'left',
  },
  {
    name: 'frequency',
    label: t('pop.productionProcess.fields.frequency'),
    field: 'frequency',
    align: 'left',
  },
  {
    name: 'employee_name',
    label: t('pop.productionProcess.fields.employeeName'),
    field: (row) => row.employee_name ?? '-',
    align: 'left',
  },
  {
    name: 'actions',
    label: t('common.fields.actions'),
    field: () => undefined,
    align: 'center',
  },
]);

function openDialog(item: ProductionProcessListItem, readonly = false) {
  $q.dialog({
    component: ProductionProcessDialog,
    componentProps: { item, readonly },
  });
}
</script>
