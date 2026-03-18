<template>
  <app-dialog
    ref="dialogRef"
    :title="title"
    @hide="onDialogHide"
    full-width
    style="max-width: 600px"
  >
    <q-form @submit="onSubmit" greedy>
      <div class="relative-position">
        <card-page-section>
          <div class="row q-col-gutter-md">
            <date-field
              class="col-12 col-sm-6"
              :label="$t('pop.monitoringRoom.fields.executionDate')"
              v-bind="formBinds.execution_date"
              :readonly="readonly"
            />
            <div class="col-12 col-sm-6">
              <q-select
                outlined
                dense
                hide-bottom-space
                use-input
                fill-input
                input-debounce="0"
                :model-value="formBinds.location.modelValue"
                @update:model-value="(v) => setFieldValue('location', v)"
                :label="$t('pop.monitoringRoom.fields.location')"
                :options="locationOptions"
                :readonly="readonly"
                :error="formBinds.location.error"
                :error-message="formBinds.location['error-message']"
                @new-value="(val, done) => done(val)"
              />
            </div>
            <div class="col-12">
              <div class="text-caption text-grey-6 q-mb-xs">{{ $t('pop.monitoringRoom.fields.isCleaning') }}</div>
              <q-option-group
                :model-value="formBinds.is_cleaning.modelValue"
                @update:model-value="(v) => setFieldValue('is_cleaning', v)"
                :options="[
                  { label: $t('pop.common.sim'), value: true },
                  { label: $t('pop.common.nao'), value: false },
                  { label: $t('pop.common.na'), value: null }
                ]"
                type="radio"
                inline
                dense
                :disable="readonly"
              />
            </div>
          </div>
        </card-page-section>

        <spinner-and-retry
          v-if="isFillLoading || fillError"
          :loading="isFillLoading"
          :error="fillError"
          :retry="fillRefetch"
          spinner-size="64px"
          overlay
        />
      </div>

      <q-card-actions align="right">
        <app-button
          color="grey-6"
          outline
          :label="readonly ? $t('common.actions.goBack') : $t('common.actions.cancel')"
          @click="onDialogCancel"
        />
        <app-button
          v-if="readonly && props.item"
          icon="o_picture_as_pdf"
          color="red-7"
          :label="$t('pop.common.exportPdf')"
          @click="openPrintWindow('monitoring-room', props.item.id)"
        />
        <app-button
          v-if="!readonly"
          type="submit"
          color="positive"
          :label="$t('common.actions.confirm')"
          :loading="isLoadingMutation"
        />
      </q-card-actions>
    </q-form>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDialogPluginComponent } from 'quasar';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useAppForm } from 'src/composables/form.composables';
import {
  monitoringRoomFormSchema,
  MonitoringRoomForm,
  MonitoringRoomListItem,
} from 'src/schemas/pop/monitoringRoom.schemas';
import {
  createMonitoringRoom,
  updateMonitoringRoom,
  monitoringRoomDetailQuery,
  monitoringRoomsQuery,
} from 'src/services/pop/monitoringRoom.service';
import { useFillFormQuery } from 'src/composables/query.composables';
import { showSuccessFeedback } from 'src/helpers/feedback.helpers';
import AppDialog from 'src/components/layout/AppDialog.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import DateField from 'src/components/form/DateField.vue';
import AppButton from 'src/components/misc/AppButton';
import SpinnerAndRetry from 'src/components/misc/SpinnerAndRetry.vue';

const props = defineProps<{
  item?: MonitoringRoomListItem;
  readonly?: boolean;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { t } = useI18n();
const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const { defineAllAppComponentBinds, handleSubmit, setValues, setFieldValue } = useAppForm(
  monitoringRoomFormSchema
);
const formBinds = defineAllAppComponentBinds();

const title = computed(() => {
  if (props.readonly) return t('pop.monitoringRoom.titles.details');
  return props.item ? t('pop.monitoringRoom.titles.edit') : t('pop.monitoringRoom.titles.new');
});

const locationOptions = [
  t('pop.monitoringRoom.locations.adminArea'),
  t('pop.monitoringRoom.locations.floor'),
  t('pop.monitoringRoom.locations.wall'),
  t('pop.monitoringRoom.locations.coffeeMaker'),
  t('pop.monitoringRoom.locations.acFilter'),
  t('pop.monitoringRoom.locations.windowsDoors'),
  t('pop.monitoringRoom.locations.cabinets'),
  t('pop.monitoringRoom.locations.birdsTables'),
  t('pop.monitoringRoom.locations.lights'),
  t('pop.monitoringRoom.locations.bins'),
];

const { mutate, isLoading: isLoadingMutation } = useMutation(
  (data: MonitoringRoomForm) => {
    if (props.item) return updateMonitoringRoom(props.item.id, data);
    return createMonitoringRoom(data);
  },
  {
    onSuccess: () => {
      onDialogOK();
      showSuccessFeedback(
        props.item
          ? t('pop.monitoringRoom.feedback.updated')
          : t('pop.monitoringRoom.feedback.created')
      );
      queryClient.invalidateQueries([monitoringRoomsQuery.name]);
      if (props.item)
        queryClient.invalidateQueries([monitoringRoomDetailQuery.name, props.item.id]);
    },
  }
);

const { fillRefetch, isFillLoading, fillError } = useFillFormQuery({
  query: monitoringRoomDetailQuery,
  id: computed(() => props.item?.id),
  readonly: props.readonly,
  setValues,
  onNotFound: onDialogCancel,
});

watch(
  () => props.item,
  (item) => { if (item) setValues(item as Partial<MonitoringRoomForm>, false); },
  { immediate: true }
);

const onSubmit = handleSubmit((data) => mutate(data));

function openPrintWindow(route: string, id: number) {
  const url = `${window.location.origin}${window.location.pathname}#/pop/print/${route}/${id}`;
  window.open(url, '_blank');
}
</script>
