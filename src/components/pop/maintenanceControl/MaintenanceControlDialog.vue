<template>
  <app-dialog
    ref="dialogRef"
    :title="title"
    @hide="onDialogHide"
    full-width
    style="max-width: 800px"
  >
    <q-form @submit="onSubmit" greedy>
      <div class="relative-position">
        <card-page-section>
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-sm-6">
              <q-select
                :model-value="formBinds.box_number.modelValue"
                @update:model-value="(v) => setFieldValue('box_number', v)"
                :error="!!formBinds.box_number.errorMessage"
                :error-message="formBinds.box_number.errorMessage"
                :label="$t('pop.maintenanceControl.fields.boxNumber')"
                :options="filteredBoxOptions"
                option-value="value"
                option-label="label"
                emit-value
                map-options
                use-input
                fill-input
                hide-selected
                input-debounce="0"
                @filter="filterBoxOptions"
                @input-value="(v: string) => v !== '' && setFieldValue('box_number', v)"
                :readonly="readonly"
                outlined
                dense
              />
            </div>
            <date-field
              class="col-12 col-sm-6"
              :label="$t('pop.maintenanceControl.fields.executionDate')"
              v-bind="formBinds.execution_date"
              :readonly="readonly"
            />
            <text-field
              class="col-12"
              :label="$t('pop.maintenanceControl.fields.employeeName')"
              v-bind="formBinds.employee_name"
              :readonly="readonly"
            />
          </div>

          <div class="text-subtitle2 q-mb-sm">{{ $t('pop.common.conditions') }}</div>
          <q-markup-table flat bordered dense>
            <thead>
              <tr>
                <th class="text-left" style="width: 55%">{{ $t('pop.common.condition') }}</th>
                <th class="text-center" style="width: 15%">{{ $t('pop.common.sim') }}</th>
                <th class="text-center" style="width: 15%">{{ $t('pop.common.nao') }}</th>
                <th class="text-center" style="width: 15%">{{ $t('pop.common.na') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="q in questions" :key="q.key">
                <td class="text-left text-body2" style="white-space: normal">{{ q.label }}</td>
                <td class="text-center">
                  <q-radio
                    :model-value="(formBinds as any)[q.key].modelValue"
                    @update:model-value="(v: any) => setFieldValue(q.key as any, v)"
                    :val="true"
                    :disable="readonly"
                  />
                </td>
                <td class="text-center">
                  <q-radio
                    :model-value="(formBinds as any)[q.key].modelValue"
                    @update:model-value="(v: any) => setFieldValue(q.key as any, v)"
                    :val="false"
                    :disable="readonly"
                  />
                </td>
                <td class="text-center">
                  <q-radio
                    :model-value="(formBinds as any)[q.key].modelValue"
                    @update:model-value="(v: any) => setFieldValue(q.key as any, v)"
                    :val="null"
                    :disable="readonly"
                  />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
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
          pop-type="maintenance-control"
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
          @click="openPrintWindow('maintenance-control', props.item.id)"
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
  maintenanceControlFormSchema,
  MaintenanceControlForm,
  MaintenanceControlListItem,
} from 'src/schemas/pop/maintenanceControl.schemas';
import {
  createMaintenanceControl,
  updateMaintenanceControl,
  maintenanceControlDetailQuery,
  maintenanceControlsQuery,
} from 'src/services/pop/maintenanceControl.service';
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
  item?: MaintenanceControlListItem;
  readonly?: boolean;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { t } = useI18n();
const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const { defineAllAppComponentBinds, handleSubmit, setValues, setFieldValue } = useAppForm(
  maintenanceControlFormSchema
);
const formBinds = defineAllAppComponentBinds();

const title = computed(() => {
  if (props.readonly) return t('pop.maintenanceControl.titles.details');
  return props.item
    ? t('pop.maintenanceControl.titles.edit')
    : t('pop.maintenanceControl.titles.new');
});

const boxOptions = [
  { value: 1, label: t('pop.maintenanceControl.fields.boxOption1') },
  { value: 2, label: t('pop.maintenanceControl.fields.boxOption2') },
];
const filteredBoxOptions = ref(boxOptions);
function filterBoxOptions(val: string, update: (fn: () => void) => void) {
  update(() => {
    filteredBoxOptions.value = !val
      ? boxOptions
      : boxOptions.filter(o => o.label.toLowerCase().includes(val.toLowerCase()) || String(o.value).includes(val));
  });
}

function isoToDisplay(date: string | null | undefined): string {
  if (!date) return '';
  try { return format(new Date(date), 'dd/MM/yyyy'); } catch { return date ?? ''; }
}

const questions = [
  { key: 'question1', label: t('pop.maintenanceControl.questions.q1') },
  { key: 'question2', label: t('pop.maintenanceControl.questions.q2') },
  { key: 'question3', label: t('pop.maintenanceControl.questions.q3') },
];

const { mutate, isLoading: isLoadingMutation } = useMutation(
  (data: MaintenanceControlForm) => {
    if (props.item) return updateMaintenanceControl(props.item.id, data);
    return createMaintenanceControl(data);
  },
  {
    onSuccess: () => {
      onDialogOK();
      showSuccessFeedback(
        props.item
          ? t('pop.maintenanceControl.feedback.updated')
          : t('pop.maintenanceControl.feedback.created')
      );
      queryClient.invalidateQueries([maintenanceControlsQuery.name]);
      if (props.item)
        queryClient.invalidateQueries([maintenanceControlDetailQuery.name, props.item.id]);
    },
  }
);

const { fillRefetch, isFillLoading, fillError } = useFillFormQuery({
  query: maintenanceControlDetailQuery,
  id: computed(() => props.item?.id),
  readonly: props.readonly,
  setValues,
  onNotFound: onDialogCancel,
});

watch(
  () => props.item,
  (item) => {
    if (item) setValues({ ...item, execution_date: isoToDisplay(item.execution_date) } as Partial<MaintenanceControlForm>, false);
  },
  { immediate: true }
);

const onSubmit = handleSubmit((data) => mutate(data));

function openPrintWindow(route: string, id: number) {
  const url = `${window.location.origin}${window.location.pathname}#/pop/print/${route}/${id}`;
  window.open(url, '_blank');
}
</script>
