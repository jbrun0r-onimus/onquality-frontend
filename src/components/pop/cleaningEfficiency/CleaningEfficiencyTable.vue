<template>
  <remote-table
    :query="cleaningEfficienciesQuery"
    :columns="columns"
    :params="params"
    @update:params="$emit('update:params', $event)"
  >
    <template v-slot:body-cell-note="{ col, row }">
      <q-td :props="{ col }">
        <span style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block;">
          {{ row.note || '-' }}
        </span>
      </q-td>
    </template>
    <template v-slot:body-cell-actions="{ col, row }">
      <generic-actions-cell
        :col="col"
        :row="row"
        details-can
        @details="openDialog(row, true)"
        edit-can
        @edit="openDialog"
        delete-can
        :delete-action="() => deleteCleaningEfficiency(row.id)"
        delete-confirm
        :delete-confirm-title="$t('pop.cleaningEfficiency.titles.delete')"
        :delete-confirm-message="$t('pop.cleaningEfficiency.misc.deleteConfirmation')"
        :invalidate="cleaningEfficienciesQuery"
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
  cleaningEfficienciesQuery,
  deleteCleaningEfficiency,
} from 'src/services/pop/cleaningEfficiency.service';
import {
  CleaningEfficiencyListItem,
  CleaningEfficiencyListRequest,
} from 'src/schemas/pop/cleaningEfficiency.schemas';
import RemoteTable from 'src/components/misc/table/RemoteTable.vue';
import GenericActionsCell from 'src/components/misc/table/cells/GenericActionsCell.vue';
import CleaningEfficiencyDialog from './CleaningEfficiencyDialog.vue';

defineProps<{ params: CleaningEfficiencyListRequest }>();
defineEmits<{ (e: 'update:params', value: CleaningEfficiencyListItem): void }>();

const { t } = useI18n();
const $q = useQuasar();

const columns = computed<QTableColumn<CleaningEfficiencyListItem>[]>(() => [
  {
    name: 'execution_date',
    label: t('pop.cleaningEfficiency.fields.executionDate'),
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
    name: 'note',
    label: t('pop.cleaningEfficiency.fields.note'),
    field: () => undefined,
    align: 'left',
  },
  {
    name: 'actions',
    label: t('common.fields.actions'),
    field: () => undefined,
    align: 'center',
  },
]);

function openDialog(item: CleaningEfficiencyListItem, readonly = false) {
  $q.dialog({
    component: CleaningEfficiencyDialog,
    componentProps: { item, readonly },
  });
}
</script>
