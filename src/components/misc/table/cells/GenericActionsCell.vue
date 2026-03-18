<template>
  <cell-wrapper :col="col">
    <q-btn
      v-if="!detailsHide"
      flat
      round
      dense
      icon="o_description"
      color="primary"
      :to="detailsTo"
      @click="$emit('details', row as T)"
      :disable="!detailsCan"
      :title="
        detailsCan ? undefined : detailsCannotMessage || cannotMessageFallback
      "
    />
    <q-btn
      v-if="!editHide"
      flat
      round
      dense
      icon="o_edit"
      color="primary"
      :to="editTo"
      @click="$emit('edit', row as T)"
      :disable="!editCan"
      :title="editCan ? undefined : editCannotMessage || cannotMessageFallback"
    />
    <q-btn
      v-if="!deleteHide"
      flat
      round
      dense
      icon="o_delete"
      color="negative"
      :to="deleteTo"
      @click="onDeleteClick"
      :loading="isLoadingDelete"
      :disable="!deleteCan"
      :title="
        deleteCan ? undefined : deleteCannotMessage || cannotMessageFallback
      "
    />
  </cell-wrapper>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouteLocationRaw } from 'vue-router';
import { QTableColumn } from 'quasar';
import { useQueryClient } from '@tanstack/vue-query';
import CellWrapper from 'src/components/misc/table/cells/CellWrapper.vue';
import { askForDeleteConfirmation } from 'src/helpers/dialog.helpers';
import { QueryDefinition } from 'src/typings/query.typings';
const props = defineProps<{
  row: T;
  col: QTableColumn<T>;
  rowLabel?: string;

  detailsTo?: RouteLocationRaw;
  detailsHide?: boolean;
  detailsCan?: boolean;
  detailsCannotMessage?: string;

  editTo?: RouteLocationRaw;
  editHide?: boolean;
  editCan?: boolean;
  editCannotMessage?: string;

  deleteTo?: RouteLocationRaw;
  deleteHide?: boolean;
  deleteCan?: boolean;
  deleteCannotMessage?: string;
  deleteConfirm?: boolean;
  deleteConfirmTitle?: string;
  deleteConfirmMessage?: string;
  deleteAction?: (item: T) => Promise<void>;

  genericCannotMessage?: string;
  invalidate?: QueryDefinition<T>;
}>();

const emit = defineEmits<{
  (e: 'details' | 'edit' | 'delete', value: T): void;
}>();

const { t } = useI18n();

const cannotMessageFallback = computed(
  () => props.genericCannotMessage || t('common.feedback.notAllowed')
);

const queryClient = useQueryClient();

const isLoadingDelete = ref(false);

function getGenericDeleteMessage() {
  const row = props.row as {
    name?: string;
    id?: string;
  };
  const name = props.rowLabel || row.name || row.id || JSON.stringify(row);
  return t('common.misc.genericDeleteMessage', { name });
}

async function onDeleteClick() {
  if (props.deleteConfirm) {
    const confirmed = await askForDeleteConfirmation(
      props.deleteConfirmTitle || t('common.misc.genericDeleteTitle'),
      props.deleteConfirmMessage || getGenericDeleteMessage()
    );
    if (!confirmed) return;
  }
  if (!props.deleteAction) {
    return emit('delete', props.row);
  }

  try {
    isLoadingDelete.value = true;
    await props.deleteAction(props.row);
    if (props.invalidate) {
      queryClient.invalidateQueries([props.invalidate.name]);
    }
  } finally {
    isLoadingDelete.value = false;
  }
}
</script>
