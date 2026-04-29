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
          <!-- Header fields -->
          <div class="row q-col-gutter-md q-mb-md">
            <text-field
              class="col-12 col-sm-6"
              :label="$t('pop.materialReceiving.fields.supplier')"
              v-bind="formBinds.supplier"
              :readonly="readonly"
            />
            <text-field
              class="col-12 col-sm-6"
              :label="$t('pop.materialReceiving.fields.product')"
              v-bind="formBinds.product"
              :readonly="readonly"
            />
            <date-field
              class="col-12 col-sm-6"
              :label="$t('pop.materialReceiving.fields.receivingDate')"
              v-bind="formBinds.receiving_date"
              :readonly="readonly"
            />
            <text-field
              class="col-12 col-sm-6"
              :label="$t('pop.materialReceiving.fields.batchNumber')"
              v-bind="formBinds.batch_number"
              :readonly="readonly"
            />
            <text-field
              class="col-12 col-sm-4"
              :label="$t('pop.materialReceiving.fields.weight')"
              v-bind="formBinds.weight"
              type="number"
              :readonly="readonly"
            />
            <date-field
              class="col-12 col-sm-4"
              :label="$t('pop.materialReceiving.fields.expirationDate')"
              v-bind="formBinds.expiration_date"
              :readonly="readonly"
            />
            <text-field
              class="col-12 col-sm-4"
              :label="$t('pop.materialReceiving.fields.invoice')"
              v-bind="formBinds.invoice"
              :readonly="readonly"
            />
            <text-field
              class="col-12"
              :label="$t('pop.materialReceiving.fields.performedBy')"
              v-bind="formBinds.performed_by"
              :readonly="readonly"
            />
          </div>

          <!-- Questions table -->
          <div class="text-subtitle2 q-mb-sm">{{ $t('pop.common.conditions') }}</div>
          <q-markup-table flat bordered dense>
            <thead>
              <tr>
                <th class="text-left" style="width: 55%">{{ $t('pop.common.condition') }}</th>
                <th class="text-center" style="width: 15%">C</th>
                <th class="text-center" style="width: 15%">NC</th>
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
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <signature-field
              pop-type="material-receiving"
              :pop-id="props.item?.id"
              field-name="monitored_by"
              :label="$t('pop.common.monitoredBy')"
              :readonly="readonly"
            />
          </div>
          <div class="col-12 col-sm-6">
            <signature-field
              pop-type="material-receiving"
              :pop-id="props.item?.id"
              field-name="verified_by"
              :label="$t('pop.common.verifiedBy')"
              :readonly="readonly"
            />
          </div>
        </div>
      </card-page-section>

      <card-page-section v-if="props.item">
        <pop-evidence-section
          pop-type="material-receiving"
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
          @click="openPrintWindow('material-receiving', props.item.id)"
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
  materialReceivingFormSchema,
  MaterialReceivingForm,
  MaterialReceivingListItem,
} from 'src/schemas/pop/materialReceiving.schemas';
import {
  createMaterialReceiving,
  updateMaterialReceiving,
  materialReceivingDetailQuery,
  materialReceivingsQuery,
} from 'src/services/pop/materialReceiving.service';
import { useFillFormQuery } from 'src/composables/query.composables';
import { showSuccessFeedback } from 'src/helpers/feedback.helpers';
import AppDialog from 'src/components/layout/AppDialog.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import TextField from 'src/components/form/TextField.vue';
import DateField from 'src/components/form/DateField.vue';
import AppButton from 'src/components/misc/AppButton';
import SpinnerAndRetry from 'src/components/misc/SpinnerAndRetry.vue';
import PopEvidenceSection from 'src/components/pop/evidence/PopEvidenceSection.vue';
import SignatureField from 'src/components/pop/signature/SignatureField.vue';

const props = defineProps<{
  item?: MaterialReceivingListItem;
  readonly?: boolean;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { t } = useI18n();
const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const { defineAllAppComponentBinds, handleSubmit, setValues, setFieldValue } = useAppForm(
  materialReceivingFormSchema
);
const formBinds = defineAllAppComponentBinds();

const title = computed(() => {
  if (props.readonly) return t('pop.materialReceiving.titles.details');
  return props.item
    ? t('pop.materialReceiving.titles.edit')
    : t('pop.materialReceiving.titles.new');
});

const questions = [
  { key: 'question1', label: t('pop.materialReceiving.questions.q1') },
  { key: 'question2', label: t('pop.materialReceiving.questions.q2') },
  { key: 'question3', label: t('pop.materialReceiving.questions.q3') },
  { key: 'question4', label: t('pop.materialReceiving.questions.q4') },
];

const { mutate, isLoading: isLoadingMutation } = useMutation(
  (data: MaterialReceivingForm) => {
    if (props.item) return updateMaterialReceiving(props.item.id, data);
    return createMaterialReceiving(data);
  },
  {
    onSuccess: () => {
      onDialogOK();
      showSuccessFeedback(
        props.item
          ? t('pop.materialReceiving.feedback.updated')
          : t('pop.materialReceiving.feedback.created')
      );
      queryClient.invalidateQueries([materialReceivingsQuery.name]);
      if (props.item)
        queryClient.invalidateQueries([materialReceivingDetailQuery.name, props.item.id]);
    },
  }
);

const { fillRefetch, isFillLoading, fillError } = useFillFormQuery({
  query: materialReceivingDetailQuery,
  id: computed(() => props.item?.id),
  readonly: props.readonly,
  setValues,
  onNotFound: onDialogCancel,
});

watch(
  () => props.item,
  (item) => { if (item) setValues(item as Partial<MaterialReceivingForm>, false); },
  { immediate: true }
);

const onSubmit = handleSubmit((data) => mutate(data));

function openPrintWindow(route: string, id: number) {
  const url = `${window.location.origin}${window.location.pathname}#/pop/print/${route}/${id}`;
  window.open(url, '_blank');
}
</script>
