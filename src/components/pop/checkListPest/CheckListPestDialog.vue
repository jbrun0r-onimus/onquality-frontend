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
          <div class="text-subtitle2 q-mb-sm">{{ $t('pop.common.conditions') }}</div>
          <q-markup-table flat bordered dense>
            <thead>
              <tr>
                <th class="text-left" style="width: 65%">{{ $t('pop.common.condition') }}</th>
                <th class="text-center" style="width: 11%">{{ $t('pop.common.sim') }}</th>
                <th class="text-center" style="width: 11%">{{ $t('pop.common.nao') }}</th>
                <th class="text-center" style="width: 13%">{{ $t('pop.common.na') }}</th>
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

          <div class="row q-col-gutter-md q-mt-md">
            <text-field
              class="col-12"
              type="textarea"
              :label="$t('pop.checkListPest.fields.note')"
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
          pop-type="check-list-pest"
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
          @click="openPrintWindow('check-list-pest', props.item.id)"
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
  checkListPestFormSchema,
  CheckListPestForm,
  CheckListPestListItem,
} from 'src/schemas/pop/checkListPest.schemas';
import {
  createCheckListPest,
  updateCheckListPest,
  checkListPestDetailQuery,
  checkListPestsQuery,
} from 'src/services/pop/checkListPest.service';
import { useFillFormQuery } from 'src/composables/query.composables';
import { showSuccessFeedback } from 'src/helpers/feedback.helpers';
import AppDialog from 'src/components/layout/AppDialog.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import TextField from 'src/components/form/TextField.vue';
import AppButton from 'src/components/misc/AppButton';
import SpinnerAndRetry from 'src/components/misc/SpinnerAndRetry.vue';
import PopEvidenceSection from 'src/components/pop/evidence/PopEvidenceSection.vue';

const props = defineProps<{
  item?: CheckListPestListItem;
  readonly?: boolean;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { t } = useI18n();
const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const { defineAllAppComponentBinds, handleSubmit, setValues, setFieldValue } = useAppForm(
  checkListPestFormSchema
);
const formBinds = defineAllAppComponentBinds();

const title = computed(() => {
  if (props.readonly) return t('pop.checkListPest.titles.details');
  return props.item ? t('pop.checkListPest.titles.edit') : t('pop.checkListPest.titles.new');
});

const questions = [
  { key: 'question1', label: t('pop.checkListPest.questions.q1') },
  { key: 'question2', label: t('pop.checkListPest.questions.q2') },
  { key: 'question3', label: t('pop.checkListPest.questions.q3') },
  { key: 'question4', label: t('pop.checkListPest.questions.q4') },
  { key: 'question5', label: t('pop.checkListPest.questions.q5') },
  { key: 'question6', label: t('pop.checkListPest.questions.q6') },
  { key: 'question7', label: t('pop.checkListPest.questions.q7') },
  { key: 'question8', label: t('pop.checkListPest.questions.q8') },
  { key: 'question9', label: t('pop.checkListPest.questions.q9') },
  { key: 'question10', label: t('pop.checkListPest.questions.q10') },
  { key: 'question11', label: t('pop.checkListPest.questions.q11') },
  { key: 'question12', label: t('pop.checkListPest.questions.q12') },
  { key: 'question13', label: t('pop.checkListPest.questions.q13') },
  { key: 'question14', label: t('pop.checkListPest.questions.q14') },
  { key: 'question15', label: t('pop.checkListPest.questions.q15') },
  { key: 'question16', label: t('pop.checkListPest.questions.q16') },
  { key: 'question17', label: t('pop.checkListPest.questions.q17') },
];

const { mutate, isLoading: isLoadingMutation } = useMutation(
  (data: CheckListPestForm) => {
    if (props.item) return updateCheckListPest(props.item.id, data);
    return createCheckListPest(data);
  },
  {
    onSuccess: () => {
      onDialogOK();
      showSuccessFeedback(
        props.item
          ? t('pop.checkListPest.feedback.updated')
          : t('pop.checkListPest.feedback.created')
      );
      queryClient.invalidateQueries([checkListPestsQuery.name]);
      if (props.item)
        queryClient.invalidateQueries([checkListPestDetailQuery.name, props.item.id]);
    },
  }
);

const { fillRefetch, isFillLoading, fillError } = useFillFormQuery({
  query: checkListPestDetailQuery,
  id: computed(() => props.item?.id),
  readonly: props.readonly,
  setValues,
  onNotFound: onDialogCancel,
});

watch(
  () => props.item,
  (item) => { if (item) setValues(item as Partial<CheckListPestForm>, false); },
  { immediate: true }
);

const onSubmit = handleSubmit((data) => mutate(data));

function openPrintWindow(route: string, id: number) {
  const url = `${window.location.origin}${window.location.pathname}#/pop/print/${route}/${id}`;
  window.open(url, '_blank');
}
</script>
