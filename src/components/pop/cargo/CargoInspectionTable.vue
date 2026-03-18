<template>
  <remote-table
    :query="cargoInspectionsQuery"
    :columns="columns"
    :params="params"
    @update:params="$emit('update:params', $event)"
  >
    <template v-slot:body-cell-tipo="{ col, row }">
      <q-td :props="{ col }">
        <q-badge
          v-if="row.inbound"
          color="green"
          :label="$t('pop.cargoInspection.fields.inbound')"
        />
        <q-badge
          v-else-if="row.outbound"
          color="blue"
          :label="$t('pop.cargoInspection.fields.outbound')"
        />
        <span v-else class="text-grey">-</span>
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
        :delete-action="() => deleteCargoInspection(row.id)"
        delete-confirm
        :delete-confirm-title="$t('pop.cargoInspection.titles.delete')"
        :delete-confirm-message="$t('pop.cargoInspection.misc.deleteConfirmation', { driver: row.driver })"
        :invalidate="cargoInspectionsQuery"
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
  cargoInspectionsQuery,
  deleteCargoInspection,
} from 'src/services/pop/cargoInspection.service';
import {
  CargoInspectionListItem,
  CargoInspectionListRequest,
} from 'src/schemas/pop/cargoInspection.schemas';
import RemoteTable from 'src/components/misc/table/RemoteTable.vue';
import GenericActionsCell from 'src/components/misc/table/cells/GenericActionsCell.vue';
import CargoInspectionDialog from './CargoInspectionDialog.vue';

defineProps<{ params: CargoInspectionListRequest }>();
defineEmits<{ (e: 'update:params', value: CargoInspectionListItem): void }>();

const { t } = useI18n();
const $q = useQuasar();

const columns = computed<QTableColumn<CargoInspectionListItem>[]>(() => [
  {
    name: 'driver',
    label: t('pop.cargoInspection.fields.driver'),
    field: 'driver',
    align: 'left',
  },
  {
    name: 'license_plate',
    label: t('pop.cargoInspection.fields.licensePlate'),
    field: 'license_plate',
    align: 'left',
  },
  {
    name: 'product',
    label: t('pop.cargoInspection.fields.product'),
    field: 'product',
    align: 'left',
  },
  {
    name: 'invoice',
    label: t('pop.cargoInspection.fields.invoice'),
    field: 'invoice',
    align: 'left',
  },
  {
    name: 'tipo',
    label: t('pop.cargoInspection.fields.type'),
    field: () => undefined,
    align: 'center',
  },
  {
    name: 'created_at',
    label: t('pop.common.createdAt'),
    field: (row) => {
      try {
        return format(new Date(row.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR });
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

function openDialog(item: CargoInspectionListItem, readonly = false) {
  $q.dialog({
    component: CargoInspectionDialog,
    componentProps: { item, readonly },
  });
}
</script>
