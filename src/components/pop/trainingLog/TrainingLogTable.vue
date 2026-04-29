<template>
  <remote-table
    :query="trainingLogsQuery"
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
        :delete-action="() => deleteTrainingLog(row.id)"
        delete-confirm
        :delete-confirm-title="$t('pop.trainingLog.titles.delete')"
        :delete-confirm-message="$t('pop.trainingLog.misc.deleteConfirmation')"
        :invalidate="trainingLogsQuery"
      />
    </template>
  </remote-table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { QTableColumn, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import {
  trainingLogsQuery,
  deleteTrainingLog,
  fromIsoDate,
} from 'src/services/pop/trainingLog.service';
import {
  TrainingLogListItem,
  TrainingLogListRequest,
} from 'src/schemas/pop/trainingLog.schemas';
import RemoteTable from 'src/components/misc/table/RemoteTable.vue';
import GenericActionsCell from 'src/components/misc/table/cells/GenericActionsCell.vue';
import TrainingLogDialog from './TrainingLogDialog.vue';

defineProps<{ params: TrainingLogListRequest }>();
defineEmits<{ (e: 'update:params', value: TrainingLogListItem): void }>();

const { t } = useI18n();
const $q = useQuasar();

const columns = computed<QTableColumn<TrainingLogListItem>[]>(() => [
  {
    name: 'execution_date',
    label: t('pop.trainingLog.fields.executionDate'),
    field: (row: TrainingLogListItem) => fromIsoDate(row.execution_date) || '-',
    align: 'left',
  },
  {
    name: 'instructor',
    label: t('pop.trainingLog.fields.instructor'),
    field: 'instructor',
    align: 'left',
  },
  {
    name: 'workload',
    label: t('pop.trainingLog.fields.workload'),
    field: 'workload',
    align: 'left',
  },
  {
    name: 'participant_count',
    label: t('pop.trainingLog.misc.participants'),
    field: 'participant_count',
    align: 'center',
  },
  {
    name: 'actions',
    label: t('common.fields.actions'),
    field: () => undefined,
    align: 'center',
  },
]);

function openDialog(item: TrainingLogListItem, readonly = false) {
  $q.dialog({
    component: TrainingLogDialog,
    componentProps: { item, readonly },
  });
}
</script>
