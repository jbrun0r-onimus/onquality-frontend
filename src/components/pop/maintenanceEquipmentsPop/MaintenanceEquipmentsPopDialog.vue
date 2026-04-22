<template>
  <app-dialog
    ref="dialogRef"
    :title="title"
    @hide="onDialogHide"
    full-width
    style="max-width: 700px"
  >
    <q-form @submit="onSubmit" greedy>
      <div class="relative-position">
        <card-page-section>
          <div class="row q-col-gutter-md">
            <date-field
              class="col-12 col-sm-6"
              :label="$t('pop.maintenanceEquipmentsPop.fields.executionDate')"
              v-bind="formBinds.execution_date"
              :readonly="readonly"
            />
            <text-field
              class="col-12 col-sm-6"
              :label="$t('pop.maintenanceEquipmentsPop.fields.executedBy')"
              v-bind="formBinds.executed_by"
              :readonly="readonly"
            />
            <div class="col-12">
              <q-select
                :model-value="formBinds.descriptions.modelValue"
                @update:model-value="(v) => setFieldValue('descriptions', v)"
                :error="!!formBinds.descriptions.errorMessage"
                :error-message="formBinds.descriptions.errorMessage"
                :label="$t('pop.maintenanceEquipmentsPop.fields.descriptions')"
                :options="filteredDescOptions"
                use-input
                fill-input
                hide-selected
                input-debounce="0"
                @filter="filterDescOptions"
                @input-value="(v: string) => v !== '' && setFieldValue('descriptions', v)"
                :readonly="readonly"
                outlined
                dense
              />
            </div>
            <div class="col-12">
              <div class="text-body2 q-mb-xs">{{ $t('pop.maintenanceEquipmentsPop.fields.type') }}</div>
              <div class="row q-gutter-md">
                <q-radio
                  :model-value="formBinds.is_corrective.modelValue"
                  @update:model-value="(v) => setFieldValue('is_corrective', v)"
                  :val="false"
                  :label="$t('pop.maintenanceEquipmentsPop.types.preventive')"
                  :disable="readonly"
                />
                <q-radio
                  :model-value="formBinds.is_corrective.modelValue"
                  @update:model-value="(v) => setFieldValue('is_corrective', v)"
                  :val="true"
                  :label="$t('pop.maintenanceEquipmentsPop.types.corrective')"
                  :disable="readonly"
                />
              </div>
            </div>
            <div class="col-12">
              <div class="text-body2 q-mb-xs">{{ $t('pop.maintenanceEquipmentsPop.fields.diagnosis') }}</div>
              <div class="row q-gutter-md">
                <q-radio
                  :model-value="formBinds.is_ok.modelValue"
                  @update:model-value="(v) => setFieldValue('is_ok', v)"
                  :val="true"
                  label="OK"
                  :disable="readonly"
                />
                <q-radio
                  :model-value="formBinds.is_ok.modelValue"
                  @update:model-value="(v) => setFieldValue('is_ok', v)"
                  :val="false"
                  :label="$t('pop.maintenanceEquipmentsPop.types.damaged')"
                  :disable="readonly"
                />
                <q-radio
                  :model-value="formBinds.is_ok.modelValue"
                  @update:model-value="(v) => setFieldValue('is_ok', v)"
                  :val="null"
                  :label="$t('pop.common.na')"
                  :disable="readonly"
                />
              </div>
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
          pop-type="maintenance-equipments-pop"
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
import { computed, ref, watch } from 'vue';
import { format } from 'date-fns';
import { useI18n } from 'vue-i18n';
import { useDialogPluginComponent } from 'quasar';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useAppForm } from 'src/composables/form.composables';
import {
  maintenanceEquipmentsFormSchema,
  MaintenanceEquipmentsForm,
  MaintenanceEquipmentsListItem,
} from 'src/schemas/pop/maintenanceEquipments.schemas';
import {
  createMaintenanceEquipment,
  updateMaintenanceEquipment,
  maintenanceEquipmentsDetailQuery,
  maintenanceEquipmentsListQuery,
} from 'src/services/pop/maintenanceEquipments.service';
import { useFillFormQuery } from 'src/composables/query.composables';
import { showSuccessFeedback } from 'src/helpers/feedback.helpers';
import AppDialog from 'src/components/layout/AppDialog.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import TextField from 'src/components/form/TextField.vue';
import DateField from 'src/components/form/DateField.vue';
import AppButton from 'src/components/misc/AppButton';
import SpinnerAndRetry from 'src/components/misc/SpinnerAndRetry.vue';
import PopEvidenceSection from 'src/components/pop/evidence/PopEvidenceSection.vue';

const props = defineProps<{
  item?: MaintenanceEquipmentsListItem;
  readonly?: boolean;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { t } = useI18n();
const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const { defineAllAppComponentBinds, handleSubmit, setValues, setFieldValue } = useAppForm(
  maintenanceEquipmentsFormSchema
);
const formBinds = defineAllAppComponentBinds();

const title = computed(() => {
  if (props.readonly) return t('pop.maintenanceEquipmentsPop.titles.details');
  return props.item
    ? t('pop.maintenanceEquipmentsPop.titles.edit')
    : t('pop.maintenanceEquipmentsPop.titles.new');
});

const descOptions = [
  'Verificação das correias e correntes',
  'Verificação dos fios e contatos',
  'Limpeza da parte externa dos motores e correias',
  'Limpeza da parte interna dos motores e correias',
  'Lubrificação dos rolamentos',
  'Lubrificação dos equipamentos da peletizadora',
];
const filteredDescOptions = ref(descOptions);
function filterDescOptions(val: string, update: (fn: () => void) => void) {
  update(() => {
    filteredDescOptions.value = !val
      ? descOptions
      : descOptions.filter(o => o.toLowerCase().includes(val.toLowerCase()));
  });
}

function isoToDisplay(date: string | null | undefined): string {
  if (!date) return '';
  try { return format(new Date(date), 'dd/MM/yyyy'); } catch { return date ?? ''; }
}

const { mutate, isLoading: isLoadingMutation } = useMutation(
  (data: MaintenanceEquipmentsForm) => {
    if (props.item) return updateMaintenanceEquipment(props.item.id, data);
    return createMaintenanceEquipment(data);
  },
  {
    onSuccess: () => {
      onDialogOK();
      showSuccessFeedback(
        props.item
          ? t('pop.maintenanceEquipmentsPop.feedback.updated')
          : t('pop.maintenanceEquipmentsPop.feedback.created')
      );
      queryClient.invalidateQueries([maintenanceEquipmentsListQuery.name]);
      if (props.item)
        queryClient.invalidateQueries([maintenanceEquipmentsDetailQuery.name, props.item.id]);
    },
  }
);

const { fillRefetch, isFillLoading, fillError } = useFillFormQuery({
  query: maintenanceEquipmentsDetailQuery,
  id: computed(() => props.item?.id),
  readonly: props.readonly,
  setValues,
  onNotFound: onDialogCancel,
});

watch(
  () => props.item,
  (item) => {
    if (item) setValues({ ...item, execution_date: isoToDisplay(item.execution_date) } as Partial<MaintenanceEquipmentsForm>, false);
  },
  { immediate: true }
);

const onSubmit = handleSubmit((data) => mutate(data));
</script>
