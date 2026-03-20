<template>
  <remote-table
    :query="changeWaterCoolerFiltersQuery"
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
        :delete-action="() => deleteChangeWaterCoolerFilter(row.id)"
        delete-confirm
        :delete-confirm-title="$t('pop.changeWaterCoolerFilter.titles.delete')"
        :delete-confirm-message="$t('pop.changeWaterCoolerFilter.misc.deleteConfirmation')"
        :invalidate="changeWaterCoolerFiltersQuery"
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
  changeWaterCoolerFiltersQuery,
  deleteChangeWaterCoolerFilter,
} from 'src/services/pop/changeWaterCoolerFilter.service';
import {
  ChangeWaterCoolerFilterListItem,
  ChangeWaterCoolerFilterListRequest,
} from 'src/schemas/pop/changeWaterCoolerFilter.schemas';
import RemoteTable from 'src/components/misc/table/RemoteTable.vue';
import GenericActionsCell from 'src/components/misc/table/cells/GenericActionsCell.vue';
import ChangeWaterCoolerFilterDialog from './ChangeWaterCoolerFilterDialog.vue';

defineProps<{ params: ChangeWaterCoolerFilterListRequest }>();
defineEmits<{ (e: 'update:params', value: ChangeWaterCoolerFilterListItem): void }>();

const { t } = useI18n();
const $q = useQuasar();

const columns = computed<QTableColumn<ChangeWaterCoolerFilterListItem>[]>(() => [
  {
    name: 'execution_date',
    label: t('pop.changeWaterCoolerFilter.fields.executionDate'),
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
    name: 'employee_signature',
    label: t('pop.changeWaterCoolerFilter.fields.employeeSignature'),
    field: 'employee_signature',
    align: 'left',
  },
  {
    name: 'actions',
    label: t('common.fields.actions'),
    field: () => undefined,
    align: 'center',
  },
]);

function openDialog(item: ChangeWaterCoolerFilterListItem, readonly = false) {
  $q.dialog({
    component: ChangeWaterCoolerFilterDialog,
    componentProps: { item, readonly },
  });
}
</script>
