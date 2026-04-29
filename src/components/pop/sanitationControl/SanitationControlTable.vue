<template>
  <remote-table
    :query="sanitationControlsQuery"
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
        :delete-action="() => deleteSanitationControl(row.id)"
        delete-confirm
        :delete-confirm-title="$t('pop.sanitationControl.titles.delete')"
        :delete-confirm-message="$t('pop.sanitationControl.misc.deleteConfirmation')"
        :invalidate="sanitationControlsQuery"
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
  sanitationControlsQuery,
  deleteSanitationControl,
} from 'src/services/pop/sanitationControl.service';
import {
  SanitationControlListItem,
  SanitationControlListRequest,
} from 'src/schemas/pop/sanitationControl.schemas';
import RemoteTable from 'src/components/misc/table/RemoteTable.vue';
import GenericActionsCell from 'src/components/misc/table/cells/GenericActionsCell.vue';
import SanitationControlDialog from './SanitationControlDialog.vue';

defineProps<{ params: SanitationControlListRequest }>();
defineEmits<{ (e: 'update:params', value: SanitationControlListItem): void }>();

const { t } = useI18n();
const $q = useQuasar();

const columns = computed<QTableColumn<SanitationControlListItem>[]>(() => [
  {
    name: 'execution_date',
    label: t('pop.sanitationControl.fields.executionDate'),
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
    name: 'actions',
    label: t('common.fields.actions'),
    field: () => undefined,
    align: 'center',
  },
]);

function openDialog(item: SanitationControlListItem, readonly = false) {
  $q.dialog({
    component: SanitationControlDialog,
    componentProps: { item, readonly },
  });
}
</script>
