<template>
  <remote-table
    :query="waterCoolerSanitizationsQuery"
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
        :delete-action="() => deleteWaterCoolerSanitization(row.id)"
        delete-confirm
        :delete-confirm-title="$t('pop.waterCoolerSanitization.titles.delete')"
        :delete-confirm-message="$t('pop.waterCoolerSanitization.misc.deleteConfirmation')"
        :invalidate="waterCoolerSanitizationsQuery"
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
  waterCoolerSanitizationsQuery,
  deleteWaterCoolerSanitization,
} from 'src/services/pop/waterCoolerSanitization.service';
import {
  WaterCoolerSanitizationListItem,
  WaterCoolerSanitizationListRequest,
} from 'src/schemas/pop/waterCoolerSanitization.schemas';
import RemoteTable from 'src/components/misc/table/RemoteTable.vue';
import GenericActionsCell from 'src/components/misc/table/cells/GenericActionsCell.vue';
import WaterCoolerSanitizationDialog from './WaterCoolerSanitizationDialog.vue';

defineProps<{ params: WaterCoolerSanitizationListRequest }>();
defineEmits<{ (e: 'update:params', value: WaterCoolerSanitizationListItem): void }>();

const { t } = useI18n();
const $q = useQuasar();

const columns = computed<QTableColumn<WaterCoolerSanitizationListItem>[]>(() => [
  {
    name: 'execution_date',
    label: t('pop.waterCoolerSanitization.fields.executionDate'),
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
    name: 'employee_signature',
    label: t('pop.waterCoolerSanitization.fields.employeeSignature'),
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

function openDialog(item: WaterCoolerSanitizationListItem, readonly = false) {
  $q.dialog({
    component: WaterCoolerSanitizationDialog,
    componentProps: { item, readonly },
  });
}
</script>
