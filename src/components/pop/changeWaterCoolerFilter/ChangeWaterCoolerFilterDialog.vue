<template>
  <app-dialog ref="dialogRef" :title="title" @hide="onDialogHide">
    <q-form @submit="onSubmit" greedy>
      <div class="relative-position">
        <card-page-section>
          <div class="row q-col-gutter-md">
            <date-field
              class="col-12 col-sm-6"
              :label="$t('pop.changeWaterCoolerFilter.fields.executionDate')"
              v-bind="formBinds.execution_date"
              :readonly="readonly"
            />
            <text-field
              class="col-12 col-sm-6"
              :label="$t('pop.changeWaterCoolerFilter.fields.employeeSignature')"
              v-bind="formBinds.employee_signature"
              :readonly="readonly"
            />
            <signature-field
              v-if="props.item"
              class="col-12 col-sm-6"
              pop-type="change-water-cooler-filter"
              :pop-id="props.item?.id"
              field-name="employee_signature"
              :label="$t('pop.changeWaterCoolerFilter.fields.employeeSignature')"
              :readonly="readonly"
            />
            <text-field
              class="col-12"
              type="textarea"
              :label="$t('pop.changeWaterCoolerFilter.fields.note')"
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

      <card-page-section v-if="props.item">
        <pop-evidence-section
          pop-type="change-water-cooler-filter"
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
          @click="openPrintWindow('change-water-cooler-filter', props.item.id)"
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
  changeWaterCoolerFilterFormSchema,
  ChangeWaterCoolerFilterForm,
  ChangeWaterCoolerFilterListItem,
} from 'src/schemas/pop/changeWaterCoolerFilter.schemas';
import {
  createChangeWaterCoolerFilter,
  updateChangeWaterCoolerFilter,
  changeWaterCoolerFilterDetailQuery,
  changeWaterCoolerFiltersQuery,
} from 'src/services/pop/changeWaterCoolerFilter.service';
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
  item?: ChangeWaterCoolerFilterListItem;
  readonly?: boolean;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { t } = useI18n();
const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const { defineAllAppComponentBinds, handleSubmit, setValues } = useAppForm(
  changeWaterCoolerFilterFormSchema
);
const formBinds = defineAllAppComponentBinds();

const title = computed(() => {
  if (props.readonly) return t('pop.changeWaterCoolerFilter.titles.details');
  return props.item
    ? t('pop.changeWaterCoolerFilter.titles.edit')
    : t('pop.changeWaterCoolerFilter.titles.new');
});

const { mutate, isLoading: isLoadingMutation } = useMutation(
  (data: ChangeWaterCoolerFilterForm) => {
    if (props.item) return updateChangeWaterCoolerFilter(props.item.id, data);
    return createChangeWaterCoolerFilter(data);
  },
  {
    onSuccess: () => {
      onDialogOK();
      showSuccessFeedback(
        props.item
          ? t('pop.changeWaterCoolerFilter.feedback.updated')
          : t('pop.changeWaterCoolerFilter.feedback.created')
      );
      queryClient.invalidateQueries([changeWaterCoolerFiltersQuery.name]);
      if (props.item)
        queryClient.invalidateQueries([changeWaterCoolerFilterDetailQuery.name, props.item.id]);
    },
  }
);

const { fillRefetch, isFillLoading, fillError } = useFillFormQuery({
  query: changeWaterCoolerFilterDetailQuery,
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
    if (item) setValues({ ...item, execution_date: isoToDisplay(item.execution_date) } as Partial<ChangeWaterCoolerFilterForm>, false);
  },
  { immediate: true }
);

const onSubmit = handleSubmit((data) => mutate(data));

function openPrintWindow(route: string, id: number) {
  const url = `${window.location.origin}${window.location.pathname}#/pop/print/${route}/${id}`;
  window.open(url, '_blank');
}
</script>
