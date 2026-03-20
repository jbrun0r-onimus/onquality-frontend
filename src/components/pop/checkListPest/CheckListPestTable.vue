<template>
  <remote-table
    :query="checkListPestsQuery"
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
        :delete-action="() => deleteCheckListPest(row.id)"
        delete-confirm
        :delete-confirm-title="$t('pop.checkListPest.titles.delete')"
        :delete-confirm-message="$t('pop.checkListPest.misc.deleteConfirmation')"
        :invalidate="checkListPestsQuery"
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
  checkListPestsQuery,
  deleteCheckListPest,
} from 'src/services/pop/checkListPest.service';
import {
  CheckListPestListItem,
  CheckListPestListRequest,
} from 'src/schemas/pop/checkListPest.schemas';
import RemoteTable from 'src/components/misc/table/RemoteTable.vue';
import GenericActionsCell from 'src/components/misc/table/cells/GenericActionsCell.vue';
import CheckListPestDialog from './CheckListPestDialog.vue';

defineProps<{ params: CheckListPestListRequest }>();
defineEmits<{ (e: 'update:params', value: CheckListPestListItem): void }>();

const { t } = useI18n();
const $q = useQuasar();

const columns = computed<QTableColumn<CheckListPestListItem>[]>(() => [
  {
    name: 'created_at',
    label: t('pop.common.createdAt'),
    field: (row) => {
      try {
        return format(new Date(row.created_at), 'dd/MM/yyyy', { locale: ptBR });
      } catch {
        return row.created_at;
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

function openDialog(item: CheckListPestListItem, readonly = false) {
  $q.dialog({
    component: CheckListPestDialog,
    componentProps: { item, readonly },
  });
}
</script>
