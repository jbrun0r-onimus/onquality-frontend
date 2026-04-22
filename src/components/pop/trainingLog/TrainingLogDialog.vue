<template>
  <app-dialog ref="dialogRef" :title="title" @hide="onDialogHide">
    <q-form @submit="onSubmit" greedy>
      <div class="relative-position">
        <card-page-section>
          <div class="row q-col-gutter-md">
            <text-field
              class="col-12"
              :label="$t('pop.trainingLog.fields.employeeName')"
              v-bind="formBinds.employee_name"
              :readonly="readonly"
            />
            <div class="col-12">
              <q-checkbox
                :model-value="formBinds.is_present.modelValue"
                @update:model-value="(v) => setFieldValue('is_present', v)"
                :label="$t('pop.trainingLog.fields.isPresent')"
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
          pop-type="training-log"
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
          @click="openPrintWindow('training-log', props.item.id)"
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
  trainingLogFormSchema,
  TrainingLogForm,
  TrainingLogListItem,
} from 'src/schemas/pop/trainingLog.schemas';
import {
  createTrainingLog,
  updateTrainingLog,
  trainingLogDetailQuery,
  trainingLogsQuery,
} from 'src/services/pop/trainingLog.service';
import { useFillFormQuery } from 'src/composables/query.composables';
import { showSuccessFeedback } from 'src/helpers/feedback.helpers';
import AppDialog from 'src/components/layout/AppDialog.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import TextField from 'src/components/form/TextField.vue';
import AppButton from 'src/components/misc/AppButton';
import SpinnerAndRetry from 'src/components/misc/SpinnerAndRetry.vue';
import PopEvidenceSection from 'src/components/pop/evidence/PopEvidenceSection.vue';

const props = defineProps<{
  item?: TrainingLogListItem;
  readonly?: boolean;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { t } = useI18n();
const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const { defineAllAppComponentBinds, handleSubmit, setValues, setFieldValue } = useAppForm(
  trainingLogFormSchema
);
const formBinds = defineAllAppComponentBinds();

const title = computed(() => {
  if (props.readonly) return t('pop.trainingLog.titles.details');
  return props.item ? t('pop.trainingLog.titles.edit') : t('pop.trainingLog.titles.new');
});

const { mutate, isLoading: isLoadingMutation } = useMutation(
  (data: TrainingLogForm) => {
    if (props.item) return updateTrainingLog(props.item.id, data);
    return createTrainingLog(data);
  },
  {
    onSuccess: () => {
      onDialogOK();
      showSuccessFeedback(
        props.item
          ? t('pop.trainingLog.feedback.updated')
          : t('pop.trainingLog.feedback.created')
      );
      queryClient.invalidateQueries([trainingLogsQuery.name]);
      if (props.item)
        queryClient.invalidateQueries([trainingLogDetailQuery.name, props.item.id]);
    },
  }
);

const { fillRefetch, isFillLoading, fillError } = useFillFormQuery({
  query: trainingLogDetailQuery,
  id: computed(() => props.item?.id),
  readonly: props.readonly,
  setValues,
  onNotFound: onDialogCancel,
});

watch(
  () => props.item,
  (item) => { if (item) setValues(item as Partial<TrainingLogForm>, false); },
  { immediate: true }
);

const onSubmit = handleSubmit((data) => mutate(data));

function openPrintWindow(route: string, id: number) {
  const url = `${window.location.origin}${window.location.pathname}#/pop/print/${route}/${id}`;
  window.open(url, '_blank');
}
</script>
