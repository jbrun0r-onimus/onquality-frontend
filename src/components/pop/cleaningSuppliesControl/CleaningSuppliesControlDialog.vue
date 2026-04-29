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
          <div class="text-subtitle2 q-mb-sm">{{ $t('pop.cleaningSuppliesControl.sections.cleaning') }}</div>
          <div class="row q-col-gutter-md q-mb-md">
            <date-field
              class="col-12 col-sm-6"
              :label="$t('pop.cleaningSuppliesControl.fields.executionDate')"
              v-bind="formBinds.execution_date"
              :readonly="readonly"
            />
            <text-field
              class="col-12 col-sm-6"
              :label="$t('pop.cleaningSuppliesControl.fields.product')"
              v-bind="formBinds.product"
              :readonly="readonly"
            />
            <text-field
              class="col-12 col-sm-6"
              :label="$t('pop.cleaningSuppliesControl.fields.weight')"
              v-bind="formBinds.weight"
              type="number"
              :readonly="readonly"
            />
            <text-field
              class="col-12 col-sm-6"
              :label="$t('pop.cleaningSuppliesControl.fields.productionOrder')"
              v-bind="formBinds.production_order"
              :readonly="readonly"
            />
          </div>

          <div class="text-subtitle2 q-mb-sm">{{ $t('pop.cleaningSuppliesControl.sections.reuse') }}</div>
          <div class="row q-col-gutter-md">
            <date-field
              class="col-12 col-sm-4"
              :label="$t('pop.cleaningSuppliesControl.fields.reuseDate')"
              v-bind="formBinds.reuse_date"
              :readonly="readonly"
            />
            <text-field
              class="col-12 col-sm-4"
              :label="$t('pop.cleaningSuppliesControl.fields.reuseWeight')"
              v-bind="formBinds.reuse_weight"
              type="number"
              :readonly="readonly"
            />
            <text-field
              class="col-12 col-sm-4"
              :label="$t('pop.cleaningSuppliesControl.fields.reuseProductionOrder')"
              v-bind="formBinds.reuse_production_order"
              :readonly="readonly"
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
              pop-type="cleaning-supplies-control"
              :pop-id="props.item.id"
              field-name="monitored_by"
              :label="$t('pop.common.monitoredBy')"
              :readonly="readonly"
            />
          </div>
          <div class="col-12 col-sm-6">
            <signature-field
              pop-type="cleaning-supplies-control"
              :pop-id="props.item.id"
              field-name="verified_by"
              :label="$t('pop.common.verifiedBy')"
              :readonly="readonly"
            />
          </div>
        </div>
      </card-page-section>

      <card-page-section v-if="props.item">
        <pop-evidence-section
          pop-type="cleaning-supplies-control"
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
          @click="openPrintWindow('cleaning-supplies-control', props.item.id)"
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
  cleaningSuppliesControlFormSchema,
  CleaningSuppliesControlForm,
  CleaningSuppliesControlListItem,
} from 'src/schemas/pop/cleaningSuppliesControl.schemas';
import {
  createCleaningSuppliesControl,
  updateCleaningSuppliesControl,
  cleaningSuppliesControlDetailQuery,
  cleaningSuppliesControlsQuery,
} from 'src/services/pop/cleaningSuppliesControl.service';
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
  item?: CleaningSuppliesControlListItem;
  readonly?: boolean;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { t } = useI18n();
const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const { defineAllAppComponentBinds, handleSubmit, setValues } = useAppForm(
  cleaningSuppliesControlFormSchema
);
const formBinds = defineAllAppComponentBinds();

const title = computed(() => {
  if (props.readonly) return t('pop.cleaningSuppliesControl.titles.details');
  return props.item
    ? t('pop.cleaningSuppliesControl.titles.edit')
    : t('pop.cleaningSuppliesControl.titles.new');
});

const { mutate, isLoading: isLoadingMutation } = useMutation(
  (data: CleaningSuppliesControlForm) => {
    if (props.item) return updateCleaningSuppliesControl(props.item.id, data);
    return createCleaningSuppliesControl(data);
  },
  {
    onSuccess: () => {
      onDialogOK();
      showSuccessFeedback(
        props.item
          ? t('pop.cleaningSuppliesControl.feedback.updated')
          : t('pop.cleaningSuppliesControl.feedback.created')
      );
      queryClient.invalidateQueries([cleaningSuppliesControlsQuery.name]);
      if (props.item)
        queryClient.invalidateQueries([cleaningSuppliesControlDetailQuery.name, props.item.id]);
    },
  }
);

const { fillRefetch, isFillLoading, fillError } = useFillFormQuery({
  query: cleaningSuppliesControlDetailQuery,
  id: computed(() => props.item?.id),
  readonly: props.readonly,
  setValues,
  onNotFound: onDialogCancel,
});

function isoToDisplay(date: string | null | undefined): string | null {
  if (!date) return null;
  try { return format(new Date(date), 'dd/MM/yyyy'); } catch { return date; }
}

watch(
  () => props.item,
  (item) => {
    if (item) setValues({
      ...item,
      execution_date: isoToDisplay(item.execution_date) ?? '',
      reuse_date: isoToDisplay(item.reuse_date),
    } as Partial<CleaningSuppliesControlForm>, false);
  },
  { immediate: true }
);

const onSubmit = handleSubmit((data) => mutate(data));

function openPrintWindow(route: string, id: number) {
  const url = `${window.location.origin}${window.location.pathname}#/pop/print/${route}/${id}`;
  window.open(url, '_blank');
}
</script>
