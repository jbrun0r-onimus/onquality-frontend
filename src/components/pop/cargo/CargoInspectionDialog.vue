<template>
  <app-dialog
    ref="dialogRef"
    :title="title"
    @hide="onDialogHide"
    full-width
    style="max-width: 900px"
  >
    <q-form @submit="onSubmit" greedy>
      <div class="relative-position">
        <card-page-section>
          <!-- Header fields -->
          <div class="row q-col-gutter-md q-mb-md">
            <text-field
              class="col-12 col-sm-6"
              :label="$t('pop.cargoInspection.fields.driver')"
              v-bind="formBinds.driver"
              :readonly="readonly"
            />
            <text-field
              class="col-12 col-sm-6"
              :label="$t('pop.cargoInspection.fields.product')"
              v-bind="formBinds.product"
              :readonly="readonly"
            />
            <text-field
              class="col-12 col-sm-4"
              :label="$t('pop.cargoInspection.fields.licensePlate')"
              v-bind="formBinds.license_plate"
              :readonly="readonly"
            />
            <text-field
              class="col-12 col-sm-4"
              :label="$t('pop.cargoInspection.fields.invoice')"
              v-bind="formBinds.invoice"
              :readonly="readonly"
            />
            <div class="col-12 col-sm-4">
              <div class="text-caption text-grey-6 q-mb-xs">{{ $t('pop.cargoInspection.fields.type') }}</div>
              <div class="row q-gutter-md">
                <q-checkbox
                  :model-value="formBinds.inbound.modelValue"
                  @update:model-value="(v) => setFieldValue('inbound', v)"
                  :label="$t('pop.cargoInspection.fields.inbound')"
                  :disable="readonly"
                />
                <q-checkbox
                  :model-value="formBinds.outbound.modelValue"
                  @update:model-value="(v) => setFieldValue('outbound', v)"
                  :label="$t('pop.cargoInspection.fields.outbound')"
                  :disable="readonly"
                />
              </div>
            </div>
          </div>

          <!-- Questions table -->
          <div class="text-subtitle2 q-mb-sm">{{ $t('pop.common.conditions') }}</div>
          <q-markup-table flat bordered dense>
            <thead>
              <tr>
                <th class="text-left" style="width: 70%">{{ $t('pop.common.condition') }}</th>
                <th class="text-center" style="width: 10%">{{ $t('pop.common.sim') }}</th>
                <th class="text-center" style="width: 10%">{{ $t('pop.common.nao') }}</th>
                <th class="text-center" style="width: 10%">{{ $t('pop.common.na') }}</th>
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

          <!-- Footer fields -->
          <div class="row q-col-gutter-md q-mt-md">
            <text-field
              class="col-12 col-sm-6"
              :label="$t('pop.cargoInspection.fields.monitoredBy')"
              v-bind="formBinds.monitored_by"
              :readonly="readonly"
            />
            <text-field
              class="col-12 col-sm-6"
              :label="$t('pop.cargoInspection.fields.verifiedBy')"
              v-bind="formBinds.verified_by"
              :readonly="readonly"
            />
            <text-field
              class="col-12"
              type="textarea"
              :label="$t('pop.cargoInspection.fields.note')"
              v-bind="formBinds.note"
              :readonly="readonly"
              autogrow
            />
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
          @click="openPrintWindow('cargo-inspection', props.item.id)"
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
  cargoInspectionFormSchema,
  CargoInspectionForm,
  CargoInspectionListItem,
} from 'src/schemas/pop/cargoInspection.schemas';
import {
  createCargoInspection,
  updateCargoInspection,
  cargoInspectionDetailQuery,
  cargoInspectionsQuery,
} from 'src/services/pop/cargoInspection.service';
import { useFillFormQuery } from 'src/composables/query.composables';
import { showSuccessFeedback } from 'src/helpers/feedback.helpers';
import AppDialog from 'src/components/layout/AppDialog.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import TextField from 'src/components/form/TextField.vue';
import AppButton from 'src/components/misc/AppButton';
import SpinnerAndRetry from 'src/components/misc/SpinnerAndRetry.vue';

const props = defineProps<{
  item?: CargoInspectionListItem;
  readonly?: boolean;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { t } = useI18n();
const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const { defineAllAppComponentBinds, handleSubmit, setValues, setFieldValue } = useAppForm(
  cargoInspectionFormSchema
);
const formBinds = defineAllAppComponentBinds();

const title = computed(() => {
  if (props.readonly) return t('pop.cargoInspection.titles.details');
  return props.item ? t('pop.cargoInspection.titles.edit') : t('pop.cargoInspection.titles.new');
});

const questions = [
  { key: 'question1', label: t('pop.cargoInspection.questions.q1') },
  { key: 'question2', label: t('pop.cargoInspection.questions.q2') },
  { key: 'question3', label: t('pop.cargoInspection.questions.q3') },
  { key: 'question4', label: t('pop.cargoInspection.questions.q4') },
  { key: 'question5', label: t('pop.cargoInspection.questions.q5') },
  { key: 'question6', label: t('pop.cargoInspection.questions.q6') },
  { key: 'question7', label: t('pop.cargoInspection.questions.q7') },
  { key: 'question8', label: t('pop.cargoInspection.questions.q8') },
  { key: 'question9', label: t('pop.cargoInspection.questions.q9') },
  { key: 'question10', label: t('pop.cargoInspection.questions.q10') },
  { key: 'question11', label: t('pop.cargoInspection.questions.q11') },
  { key: 'question12', label: t('pop.cargoInspection.questions.q12') },
  { key: 'question13', label: t('pop.cargoInspection.questions.q13') },
  { key: 'question14', label: t('pop.cargoInspection.questions.q14') },
  { key: 'question15', label: t('pop.cargoInspection.questions.q15') },
  { key: 'question16', label: t('pop.cargoInspection.questions.q16') },
  { key: 'question17', label: t('pop.cargoInspection.questions.q17') },
  { key: 'question18', label: t('pop.cargoInspection.questions.q18') },
  { key: 'question19', label: t('pop.cargoInspection.questions.q19') },
];

const { mutate, isLoading: isLoadingMutation } = useMutation(
  (data: CargoInspectionForm) => {
    if (props.item) return updateCargoInspection(props.item.id, data);
    return createCargoInspection(data);
  },
  {
    onSuccess: () => {
      onDialogOK();
      showSuccessFeedback(
        props.item
          ? t('pop.cargoInspection.feedback.updated')
          : t('pop.cargoInspection.feedback.created')
      );
      queryClient.invalidateQueries([cargoInspectionsQuery.name]);
      if (props.item)
        queryClient.invalidateQueries([cargoInspectionDetailQuery.name, props.item.id]);
    },
  }
);

const { fillRefetch, isFillLoading, fillError } = useFillFormQuery({
  query: cargoInspectionDetailQuery,
  id: computed(() => props.item?.id),
  readonly: props.readonly,
  setValues,
  onNotFound: onDialogCancel,
});

watch(
  () => props.item,
  (item) => { if (item) setValues(item as Partial<CargoInspectionForm>, false); },
  { immediate: true }
);

const onSubmit = handleSubmit((data) => mutate(data));

function openPrintWindow(route: string, id: number) {
  const url = `${window.location.origin}${window.location.pathname}#/pop/print/${route}/${id}`;
  window.open(url, '_blank');
}
</script>
