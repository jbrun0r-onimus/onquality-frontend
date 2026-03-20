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
            <div class="col-12 col-sm-4">
              <q-select
                :model-value="formBinds.box_number.modelValue"
                @update:model-value="(v) => setFieldValue('box_number', v)"
                :error="!!formBinds.box_number.errorMessage"
                :error-message="formBinds.box_number.errorMessage"
                :label="$t('pop.sanitizationControl.fields.boxNumber')"
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
              class="col-12 col-sm-4"
              :label="$t('pop.sanitizationControl.fields.executionDate')"
              v-bind="formBinds.execution_date"
              :readonly="readonly"
            />
            <date-field
              class="col-12 col-sm-4"
              :label="$t('pop.sanitizationControl.fields.nextExecutionDate')"
              v-bind="formBinds.next_execution_date"
              :readonly="readonly"
            />
            <text-field
              class="col-12"
              :label="$t('pop.sanitizationControl.fields.employeeName')"
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
          @click="openPrintWindow('sanitization-control', props.item.id)"
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
  sanitizationControlFormSchema,
  SanitizationControlForm,
  SanitizationControlListItem,
} from 'src/schemas/pop/sanitizationControl.schemas';
import {
  createSanitizationControl,
  updateSanitizationControl,
  sanitizationControlDetailQuery,
  sanitizationControlsQuery,
} from 'src/services/pop/sanitizationControl.service';
import { useFillFormQuery } from 'src/composables/query.composables';
import { showSuccessFeedback } from 'src/helpers/feedback.helpers';
import AppDialog from 'src/components/layout/AppDialog.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import TextField from 'src/components/form/TextField.vue';
import DateField from 'src/components/form/DateField.vue';
import AppButton from 'src/components/misc/AppButton';
import SpinnerAndRetry from 'src/components/misc/SpinnerAndRetry.vue';

const props = defineProps<{
  item?: SanitizationControlListItem;
  readonly?: boolean;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { t } = useI18n();
const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const { defineAllAppComponentBinds, handleSubmit, setValues, setFieldValue } = useAppForm(
  sanitizationControlFormSchema
);
const formBinds = defineAllAppComponentBinds();

const title = computed(() => {
  if (props.readonly) return t('pop.sanitizationControl.titles.details');
  return props.item
    ? t('pop.sanitizationControl.titles.edit')
    : t('pop.sanitizationControl.titles.new');
});

const boxOptions = [
  { value: 1, label: t('pop.sanitizationControl.fields.boxOption1') },
  { value: 2, label: t('pop.sanitizationControl.fields.boxOption2') },
];
const filteredBoxOptions = ref(boxOptions);
function filterBoxOptions(val: string, update: (fn: () => void) => void) {
  update(() => {
    filteredBoxOptions.value = !val
      ? boxOptions
      : boxOptions.filter(o => o.label.toLowerCase().includes(val.toLowerCase()) || String(o.value).includes(val));
  });
}

const questions = [
  { key: 'question1', label: t('pop.sanitizationControl.questions.q1') },
];

const { mutate, isLoading: isLoadingMutation } = useMutation(
  (data: SanitizationControlForm) => {
    if (props.item) return updateSanitizationControl(props.item.id, data);
    return createSanitizationControl(data);
  },
  {
    onSuccess: () => {
      onDialogOK();
      showSuccessFeedback(
        props.item
          ? t('pop.sanitizationControl.feedback.updated')
          : t('pop.sanitizationControl.feedback.created')
      );
      queryClient.invalidateQueries([sanitizationControlsQuery.name]);
      if (props.item)
        queryClient.invalidateQueries([sanitizationControlDetailQuery.name, props.item.id]);
    },
  }
);

const { fillRefetch, isFillLoading, fillError } = useFillFormQuery({
  query: sanitizationControlDetailQuery,
  id: computed(() => props.item?.id),
  readonly: props.readonly,
  setValues,
  onNotFound: onDialogCancel,
});

function isoToDisplay(date: string | null | undefined): string {
  if (!date) return '';
  try { return format(new Date(date), 'dd/MM/yyyy'); } catch { return date ?? ''; }
}

watch(
  () => props.item,
  (item) => {
    if (item) setValues({
      ...item,
      execution_date: isoToDisplay(item.execution_date),
      next_execution_date: isoToDisplay(item.next_execution_date),
    } as Partial<SanitizationControlForm>, false);
  },
  { immediate: true }
);

const onSubmit = handleSubmit((data) => mutate(data));

function openPrintWindow(route: string, id: number) {
  const url = `${window.location.origin}${window.location.pathname}#/pop/print/${route}/${id}`;
  window.open(url, '_blank');
}
</script>
