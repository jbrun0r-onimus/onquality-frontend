<template>
  <app-dialog
    ref="dialogRef"
    :title="title"
    @hide="onDialogHide"
    full-width
    style="max-width: 960px"
  >
    <q-form @submit="onSubmit" greedy>
      <div class="relative-position">
        <card-page-section>
          <div class="row q-col-gutter-md q-mb-md">
            <date-field
              class="col-12 col-sm-4"
              :label="$t('pop.trainingLog.fields.executionDate')"
              v-bind="formBinds.execution_date"
              :readonly="readonly"
            />
            <text-field
              class="col-12 col-sm-4"
              :label="$t('pop.trainingLog.fields.instructor')"
              v-bind="formBinds.instructor"
              :readonly="readonly"
            />
            <text-field
              class="col-12 col-sm-4"
              :label="$t('pop.trainingLog.fields.workload')"
              v-bind="formBinds.workload"
              :readonly="readonly"
            />
            <text-field
              class="col-12"
              :label="$t('pop.trainingLog.fields.professionalFormation')"
              v-bind="formBinds.professional_formation"
              :readonly="readonly"
            />
            <text-field
              class="col-12"
              type="textarea"
              :label="$t('pop.trainingLog.fields.programmaticContent')"
              v-bind="formBinds.programmatic_content"
              :readonly="readonly"
              autogrow
            />
          </div>

          <!-- Participants -->
          <div class="text-subtitle2 q-mb-sm">{{ $t('pop.trainingLog.misc.participants') }}</div>
          <q-markup-table flat bordered dense>
            <thead>
              <tr>
                <th class="text-center" style="width: 50px">Nº</th>
                <th class="text-left">{{ $t('pop.trainingLog.fields.employeeName') }}</th>
                <th class="text-center" style="width: 100px">{{ $t('pop.trainingLog.fields.isPresent') }}</th>
                <th v-if="!readonly" class="text-center" style="width: 60px"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, i) in participants" :key="i">
                <td class="text-center">{{ i + 1 }}</td>
                <td>
                  <q-input
                    v-model="p.employee_name"
                    dense
                    borderless
                    :readonly="readonly"
                    style="min-width: 200px"
                  />
                </td>
                <td class="text-center">
                  <q-checkbox
                    v-model="p.is_present"
                    :disable="readonly"
                  />
                </td>
                <td v-if="!readonly" class="text-center">
                  <q-btn flat round icon="o_delete" color="negative" size="sm" @click="removeParticipant(i)" />
                </td>
              </tr>
              <tr v-if="participants.length === 0">
                <td colspan="4" class="text-center text-grey q-pa-md">
                  {{ $t('pop.trainingLog.misc.noParticipants') }}
                </td>
              </tr>
            </tbody>
          </q-markup-table>
          <div v-if="!readonly" class="q-mt-sm">
            <app-button
              flat
              icon="o_add"
              :label="$t('pop.trainingLog.misc.addParticipant')"
              @click="addParticipant"
            />
          </div>

          <!-- Note -->
          <div class="row q-col-gutter-md q-mt-md">
            <text-field
              class="col-12"
              type="textarea"
              :label="$t('pop.trainingLog.fields.note')"
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

      <!-- Participant signatures (only when editing existing record) -->
      <card-page-section v-if="props.item && participants.length > 0">
        <div class="text-subtitle2 q-mb-sm">{{ $t('pop.trainingLog.misc.participantSignatures') }}</div>
        <div class="row q-col-gutter-md">
          <div
            v-for="p in savedParticipants"
            :key="p.id"
            class="col-12 col-sm-6 col-md-4"
          >
            <signature-field
              pop-type="training-log-participant"
              :pop-id="p.id"
              field-name="signature"
              :label="p.employee_name ?? $t('pop.trainingLog.fields.employeeName')"
              :readonly="readonly"
            />
          </div>
        </div>
      </card-page-section>

      <!-- Monitored/Verified by -->
      <card-page-section v-if="props.item">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <signature-field
              pop-type="training-log"
              :pop-id="props.item.id"
              field-name="monitored_by"
              :label="$t('pop.common.monitoredBy')"
              :readonly="readonly"
            />
          </div>
          <div class="col-12 col-sm-6">
            <signature-field
              pop-type="training-log"
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
          pop-type="training-log"
          :pop-id="props.item.id"
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
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDialogPluginComponent } from 'quasar';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useAppForm } from 'src/composables/form.composables';
import {
  trainingLogFormSchema,
  TrainingLogForm,
  TrainingLogListItem,
  TrainingLogParticipantDetail,
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
import DateField from 'src/components/form/DateField.vue';
import AppButton from 'src/components/misc/AppButton';
import SpinnerAndRetry from 'src/components/misc/SpinnerAndRetry.vue';
import PopEvidenceSection from 'src/components/pop/evidence/PopEvidenceSection.vue';
import SignatureField from 'src/components/pop/signature/SignatureField.vue';

const props = defineProps<{
  item?: TrainingLogListItem;
  readonly?: boolean;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { t } = useI18n();
const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const { defineAllAppComponentBinds, handleSubmit, setValues } = useAppForm(trainingLogFormSchema);
const formBinds = defineAllAppComponentBinds();

const participants = ref<{ employee_name: string | null; is_present: boolean }[]>([]);
const savedParticipants = ref<TrainingLogParticipantDetail[]>([]);

const title = computed(() => {
  if (props.readonly) return t('pop.trainingLog.titles.details');
  return props.item ? t('pop.trainingLog.titles.edit') : t('pop.trainingLog.titles.new');
});

function addParticipant() {
  participants.value.push({ employee_name: null, is_present: true });
}

function removeParticipant(index: number) {
  participants.value.splice(index, 1);
}

const { mutate, isLoading: isLoadingMutation } = useMutation(
  (data: TrainingLogForm) => {
    const parts = participants.value.map((p) => ({
      employee_name: p.employee_name,
      is_present: p.is_present,
    }));
    if (props.item) return updateTrainingLog(props.item.id, data, parts);
    return createTrainingLog(data, parts);
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
  setValues: (vals) => {
    setValues(vals as Partial<TrainingLogForm>, false);
    if (vals.participants) {
      savedParticipants.value = vals.participants as TrainingLogParticipantDetail[];
      participants.value = (vals.participants as TrainingLogParticipantDetail[]).map((p) => ({
        employee_name: p.employee_name,
        is_present: p.is_present ?? true,
      }));
    }
  },
  onNotFound: onDialogCancel,
});

watch(
  () => props.item,
  (item) => {
    if (item) setValues(item as Partial<TrainingLogForm>, false);
  },
  { immediate: true }
);

const onSubmit = handleSubmit((data) => mutate(data));

function openPrintWindow(route: string, id: number) {
  const url = `${window.location.origin}${window.location.pathname}#/pop/print/${route}/${id}`;
  window.open(url, '_blank');
}
</script>
