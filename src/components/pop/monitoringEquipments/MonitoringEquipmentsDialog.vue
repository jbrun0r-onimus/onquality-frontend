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
              :label="$t('pop.monitoringEquipments.fields.executionDate')"
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
                :model-value="formBinds.equipment.modelValue"
                @update:model-value="(v) => setFieldValue('equipment', v)"
                :label="$t('pop.monitoringEquipments.fields.equipment')"
                :options="equipmentOptions"
                :readonly="readonly"
                :error="formBinds.equipment.error"
                :error-message="formBinds.equipment['error-message']"
                @new-value="(val, done) => done(val)"
              />
            </div>
            <div class="col-12">
              <div class="text-caption text-grey-6 q-mb-xs">{{ $t('pop.monitoringEquipments.fields.isCleaning') }}</div>
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

      <card-page-section v-if="props.item">
        <pop-evidence-section
          pop-type="monitoring-equipments"
          :pop-id="props.item?.id"
          :readonly="readonly"
        />
      </card-page-section>

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
          @click="openPrintWindow('monitoring-equipments', props.item.id)"
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
  monitoringEquipmentsFormSchema,
  MonitoringEquipmentsForm,
  MonitoringEquipmentsListItem,
} from 'src/schemas/pop/monitoringEquipments.schemas';
import {
  createMonitoringEquipment,
  updateMonitoringEquipment,
  monitoringEquipmentDetailQuery,
  monitoringEquipmentsQuery,
} from 'src/services/pop/monitoringEquipments.service';
import { useFillFormQuery } from 'src/composables/query.composables';
import { showSuccessFeedback } from 'src/helpers/feedback.helpers';
import AppDialog from 'src/components/layout/AppDialog.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import DateField from 'src/components/form/DateField.vue';
import AppButton from 'src/components/misc/AppButton';
import SpinnerAndRetry from 'src/components/misc/SpinnerAndRetry.vue';
import PopEvidenceSection from 'src/components/pop/evidence/PopEvidenceSection.vue';

const props = defineProps<{
  item?: MonitoringEquipmentsListItem;
  readonly?: boolean;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { t } = useI18n();
const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const { defineAllAppComponentBinds, handleSubmit, setValues, setFieldValue } = useAppForm(
  monitoringEquipmentsFormSchema
);
const formBinds = defineAllAppComponentBinds();

const title = computed(() => {
  if (props.readonly) return t('pop.monitoringEquipments.titles.details');
  return props.item ? t('pop.monitoringEquipments.titles.edit') : t('pop.monitoringEquipments.titles.new');
});

const equipmentOptions = [
  'Misturador horizontal',
  'Misturador vertical em Y',
  'Pelletizadora',
  'Rosificador',
  'Peneiras vibratórias',
  'Monitor de mídias',
  'Silos de armazenamento de produtos a granel',
  'Moega de recepção de MP',
  'Balança dosadora',
  'Elevadores de canecas',
  'Roscas transportadoras',
  'Balança de Pesagem eletrônica',
  'Esteira de armazenagem',
  'Máquina de costura',
  'Caixa de armazenagem',
  'Conchas',
  'Baldes de armazenagem',
];

const { mutate, isLoading: isLoadingMutation } = useMutation(
  (data: MonitoringEquipmentsForm) => {
    if (props.item) return updateMonitoringEquipment(props.item.id, data);
    return createMonitoringEquipment(data);
  },
  {
    onSuccess: () => {
      onDialogOK();
      showSuccessFeedback(
        props.item
          ? t('pop.monitoringEquipments.feedback.updated')
          : t('pop.monitoringEquipments.feedback.created')
      );
      queryClient.invalidateQueries([monitoringEquipmentsQuery.name]);
      if (props.item)
        queryClient.invalidateQueries([monitoringEquipmentDetailQuery.name, props.item.id]);
    },
  }
);

const { fillRefetch, isFillLoading, fillError } = useFillFormQuery({
  query: monitoringEquipmentDetailQuery,
  id: computed(() => props.item?.id),
  readonly: props.readonly,
  setValues,
  onNotFound: onDialogCancel,
});

watch(
  () => props.item,
  (item) => { if (item) setValues(item as Partial<MonitoringEquipmentsForm>, false); },
  { immediate: true }
);

const onSubmit = handleSubmit((data) => mutate(data));

function openPrintWindow(route: string, id: number) {
  const url = `${window.location.origin}${window.location.pathname}#/pop/print/${route}/${id}`;
  window.open(url, '_blank');
}
</script>
