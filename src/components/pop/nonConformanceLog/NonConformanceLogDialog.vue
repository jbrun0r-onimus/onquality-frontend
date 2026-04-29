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
          <div class="row q-col-gutter-md">
            <text-field
              class="col-12 col-sm-6"
              :label="$t('pop.nonConformanceLog.fields.product')"
              v-bind="formBinds.product"
              :readonly="readonly"
            />
            <text-field
              class="col-12 col-sm-6"
              :label="$t('pop.nonConformanceLog.fields.supplier')"
              v-bind="formBinds.supplier"
              :readonly="readonly"
            />
            <text-field
              class="col-12 col-sm-6"
              :label="$t('pop.nonConformanceLog.fields.address')"
              v-bind="formBinds.address"
              :readonly="readonly"
            />
            <date-field
              class="col-12 col-sm-6"
              :label="$t('pop.nonConformanceLog.fields.receivingDate')"
              v-bind="formBinds.receiving_date"
              :readonly="readonly"
            />
            <text-field
              class="col-12 col-sm-6"
              :label="$t('pop.nonConformanceLog.fields.mapRecord')"
              v-bind="formBinds.map_record"
              :readonly="readonly"
            />
            <text-field
              class="col-12"
              type="textarea"
              :label="$t('pop.nonConformanceLog.fields.details')"
              v-bind="formBinds.details"
              :readonly="readonly"
              autogrow
            />
            <text-field
              class="col-12"
              type="textarea"
              :label="$t('pop.nonConformanceLog.fields.correctiveAction')"
              v-bind="formBinds.corrective_action"
              :readonly="readonly"
              autogrow
            />
            <text-field
              class="col-12 col-sm-6"
              :label="$t('pop.nonConformanceLog.fields.deadline')"
              v-bind="formBinds.deadline"
              :readonly="readonly"
            />
            <div class="col-12 col-sm-6 flex items-center">
              <q-checkbox
                :model-value="formBinds.is_approved.modelValue"
                @update:model-value="(v) => setFieldValue('is_approved', v)"
                :label="$t('pop.nonConformanceLog.fields.isApproved')"
                :disable="readonly"
              />
            </div>
            <text-field
              class="col-12"
              type="textarea"
              :label="$t('pop.nonConformanceLog.fields.notes')"
              v-bind="formBinds.notes"
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

      <card-page-section v-if="props.item">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <signature-field
              pop-type="non-conformance-log"
              :pop-id="props.item.id"
              field-name="monitored_by"
              :label="$t('pop.nonConformanceLog.fields.monitoredBy')"
            />
          </div>
          <div class="col-12 col-sm-6">
            <signature-field
              pop-type="non-conformance-log"
              :pop-id="props.item.id"
              field-name="verified_by"
              :label="$t('pop.nonConformanceLog.fields.verifiedBy')"
            />
          </div>
        </div>
      </card-page-section>

      <card-page-section v-if="props.item">
        <pop-evidence-section
          pop-type="non-conformance-log"
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
          @click="openPrintWindow(props.item.id)"
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
import { format } from 'date-fns';
import { useI18n } from 'vue-i18n';
import { useDialogPluginComponent } from 'quasar';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useAppForm } from 'src/composables/form.composables';
import {
  nonConformanceLogFormSchema,
  NonConformanceLogForm,
  NonConformanceLogListItem,
} from 'src/schemas/pop/nonConformanceLog.schemas';
import {
  createNonConformanceLog,
  updateNonConformanceLog,
  nonConformanceLogDetailQuery,
  nonConformanceLogsQuery,
} from 'src/services/pop/nonConformanceLog.service';
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
  item?: NonConformanceLogListItem;
  readonly?: boolean;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { t } = useI18n();
const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const { defineAllAppComponentBinds, handleSubmit, setValues, setFieldValue } = useAppForm(
  nonConformanceLogFormSchema
);
const formBinds = defineAllAppComponentBinds();

const title = computed(() => {
  if (props.readonly) return t('pop.nonConformanceLog.titles.details');
  return props.item
    ? t('pop.nonConformanceLog.titles.edit')
    : t('pop.nonConformanceLog.titles.new');
});

const { mutate, isLoading: isLoadingMutation } = useMutation(
  (data: NonConformanceLogForm) => {
    if (props.item) return updateNonConformanceLog(props.item.id, data);
    return createNonConformanceLog(data);
  },
  {
    onSuccess: () => {
      onDialogOK();
      showSuccessFeedback(
        props.item
          ? t('pop.nonConformanceLog.feedback.updated')
          : t('pop.nonConformanceLog.feedback.created')
      );
      queryClient.invalidateQueries([nonConformanceLogsQuery.name]);
      if (props.item)
        queryClient.invalidateQueries([nonConformanceLogDetailQuery.name, props.item.id]);
    },
  }
);

const { fillRefetch, isFillLoading, fillError } = useFillFormQuery({
  query: nonConformanceLogDetailQuery,
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
    if (item) setValues({ ...item, receiving_date: isoToDisplay((item as any).receiving_date) } as Partial<NonConformanceLogForm>, false);
  },
  { immediate: true }
);

const onSubmit = handleSubmit((data) => mutate(data));

function openPrintWindow(id: number) {
  const url = `${window.location.origin}${window.location.pathname}#/pop/print/non-conformance-log/${id}`;
  window.open(url, '_blank');
}
</script>
