<template>
  <cell-wrapper :col="col">
    <q-btn
      flat
      round
      dense
      size="sm"
      icon="o_more_vert"
      class="actions-trigger"
      :loading="isLoadingDelete"
    >
      <q-menu
        anchor="bottom right"
        self="top right"
        class="actions-menu"
        transition-show="jump-down"
        transition-hide="jump-up"
      >
        <q-list dense padding style="min-width: 160px">

          <!-- Visualizar -->
          <q-item
            v-if="!detailsHide"
            clickable
            v-close-popup
            :to="detailsTo"
            @click="!detailsTo && $emit('details', row as T)"
            :disable="!detailsCan"
            class="action-item"
          >
            <q-item-section avatar class="action-icon">
              <q-icon name="o_visibility" size="16px" />
            </q-item-section>
            <q-item-section>Visualizar</q-item-section>
            <q-tooltip v-if="!detailsCan && (detailsCannotMessage || genericCannotMessage)">
              {{ detailsCannotMessage || genericCannotMessage }}
            </q-tooltip>
          </q-item>

          <!-- Editar -->
          <q-item
            v-if="!editHide"
            clickable
            v-close-popup
            :to="editTo"
            @click="!editTo && $emit('edit', row as T)"
            :disable="!editCan"
            class="action-item"
          >
            <q-item-section avatar class="action-icon">
              <q-icon name="o_edit" size="16px" />
            </q-item-section>
            <q-item-section>{{ $t('common.actions.edit') }}</q-item-section>
            <q-tooltip v-if="!editCan && (editCannotMessage || genericCannotMessage)">
              {{ editCannotMessage || genericCannotMessage }}
            </q-tooltip>
          </q-item>

          <!-- Separador antes de Excluir -->
          <q-separator
            v-if="!deleteHide && (!detailsHide || !editHide)"
            spaced
            style="margin: 4px 8px"
          />

          <!-- Excluir -->
          <q-item
            v-if="!deleteHide"
            clickable
            v-close-popup
            :to="deleteTo"
            @click="!deleteTo && onDeleteClick()"
            :disable="!deleteCan || isLoadingDelete"
            class="action-item action-item--danger"
          >
            <q-item-section avatar class="action-icon">
              <q-icon name="o_delete" size="16px" />
            </q-item-section>
            <q-item-section>{{ $t('common.actions.delete') }}</q-item-section>
            <q-tooltip v-if="!deleteCan && (deleteCannotMessage || genericCannotMessage)">
              {{ deleteCannotMessage || genericCannotMessage }}
            </q-tooltip>
          </q-item>

        </q-list>
      </q-menu>
    </q-btn>
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
  const row = props.row as { name?: string; id?: string };
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

<style scoped lang="scss">
.actions-trigger {
  color: #94A3B8;
  transition: color 0.15s ease, background 0.15s ease;
  border-radius: 6px;

  &:hover {
    color: $primary;
    background: rgba(14, 50, 114, 0.06);
  }

  .body--dark & {
    &:hover {
      color: #93C5FD;
      background: rgba(147, 197, 253, 0.08);
    }
  }
}
</style>

<style lang="scss">
/* Global — não-scoped para que aplique dentro do q-menu (portal) */
.actions-menu {
  border-radius: 10px !important;
  box-shadow:
    0 4px 16px rgba(14, 50, 114, 0.12),
    0 1px 4px rgba(14, 50, 114, 0.08) !important;
  border: 1px solid #E8EDF4;
  overflow: hidden;

  .body--dark & {
    background: #162033 !important;
    border-color: rgba(255, 255, 255, 0.08) !important;
    box-shadow:
      0 4px 16px rgba(0, 0, 0, 0.35),
      0 1px 4px rgba(0, 0, 0, 0.2) !important;
  }

  .action-item {
    border-radius: 6px;
    margin: 0 4px;
    font-size: 13px;
    color: #334155;
    min-height: 36px;
    transition: background 0.1s ease;

    .body--dark & {
      color: #CBD5E1;
    }

    &:hover {
      background: rgba(14, 50, 114, 0.06) !important;
      color: $primary !important;

      .body--dark & {
        background: rgba(147, 197, 253, 0.08) !important;
        color: #93C5FD !important;
      }
    }

    &--danger {
      color: #DC2626 !important;

      &:hover {
        background: rgba(220, 38, 38, 0.06) !important;
        color: #DC2626 !important;

        .body--dark & {
          background: rgba(220, 38, 38, 0.1) !important;
        }
      }
    }
  }

  .action-icon {
    min-width: 28px !important;
    padding-right: 4px;
    opacity: 0.75;
  }
}
</style>
