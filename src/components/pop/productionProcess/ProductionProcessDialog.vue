<template>
  <app-dialog
    ref="dialogRef"
    :title="title"
    @hide="onDialogHide"
    full-width
    style="max-width: 700px"
  >
    <q-form @submit="onSubmit" greedy>
      <div class="relative-position">
        <card-page-section>
          <div class="row q-col-gutter-md">
            <text-field
              class="col-12 col-sm-6"
              :label="$t('pop.productionProcess.fields.product')"
              v-bind="formBinds.product"
              :readonly="readonly"
            />
            <div class="col-12 col-sm-6">
              <q-select
                :model-value="formBinds.frequency.modelValue"
                @update:model-value="(v) => setFieldValue('frequency', v)"
                :error="!!formBinds.frequency.errorMessage"
                :error-message="formBinds.frequency.errorMessage"
                :label="$t('pop.productionProcess.fields.frequency')"
                :options="filteredFrequencyOptions"
                use-input
                fill-input
                hide-selected
                input-debounce="0"
                @filter="filterFrequencyOptions"
                @input-value="(v: string) => v !== '' && setFieldValue('frequency', v)"
                :readonly="readonly"
                outlined
                dense
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-input
                :model-value="executionDateDisplay"
                :label="$t('pop.productionProcess.fields.executionDate')"
                :error="!!formBinds.execution_date.errorMessage"
                :error-message="formBinds.execution_date.errorMessage"
                :readonly="readonly"
                outlined
                dense
                clearable
                @clear="setFieldValue('execution_date', null)"
              >
                <template v-slot:append>
                  <q-icon name="o_event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <div class="column">
                        <q-date
                          :model-value="executionDatePart"
                          @update:model-value="onDateChange"
                          mask="DD/MM/YYYY"
                          minimal
                        />
                        <q-time
                          :model-value="executionTimePart"
                          @update:model-value="onTimeChange"
                          format24h
                          minimal
                        />
                      </div>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <text-field
              class="col-12 col-sm-6"
              :label="$t('pop.productionProcess.fields.parameter')"
              v-bind="formBinds.parameter"
              :readonly="readonly"
            />
            <text-field
              class="col-12 col-sm-6"
              :label="$t('pop.productionProcess.fields.employeeName')"
              v-bind="formBinds.employee_name"
              :readonly="readonly"
            />
            <text-field
              class="col-12"
              type="textarea"
              :label="$t('pop.productionProcess.fields.note')"
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
          pop-type="production-process"
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
  productionProcessFormSchema,
  ProductionProcessForm,
  ProductionProcessListItem,
} from 'src/schemas/pop/productionProcess.schemas';
import {
  createProductionProcess,
  updateProductionProcess,
  productionProcessDetailQuery,
  productionProcessesQuery,
} from 'src/services/pop/productionProcess.service';
import { useFillFormQuery } from 'src/composables/query.composables';
import { showSuccessFeedback } from 'src/helpers/feedback.helpers';
import AppDialog from 'src/components/layout/AppDialog.vue';
import CardPageSection from 'src/components/layout/CardPageSection.vue';
import TextField from 'src/components/form/TextField.vue';
import AppButton from 'src/components/misc/AppButton';
import SpinnerAndRetry from 'src/components/misc/SpinnerAndRetry.vue';
import PopEvidenceSection from 'src/components/pop/evidence/PopEvidenceSection.vue';

const props = defineProps<{
  item?: ProductionProcessListItem;
  readonly?: boolean;
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { t } = useI18n();
const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const { defineAllAppComponentBinds, handleSubmit, setValues, setFieldValue } = useAppForm(
  productionProcessFormSchema
);
const formBinds = defineAllAppComponentBinds();

const title = computed(() => {
  if (props.readonly) return t('pop.productionProcess.titles.details');
  return props.item
    ? t('pop.productionProcess.titles.edit')
    : t('pop.productionProcess.titles.new');
});

const frequencyOptions = ['Diário', 'Semanal', 'Quinzenal', 'Mensal'];
const filteredFrequencyOptions = ref(frequencyOptions);
function filterFrequencyOptions(val: string, update: (fn: () => void) => void) {
  update(() => {
    filteredFrequencyOptions.value = !val
      ? frequencyOptions
      : frequencyOptions.filter(o => o.toLowerCase().includes(val.toLowerCase()));
  });
}

// Datetime helpers for execution_date (stored as 'DD/MM/YYYY HH:mm')
const executionDatePart = computed(() => {
  const val = formBinds.execution_date.modelValue as string | null;
  if (!val) return '';
  return val.split(' ')[0] ?? '';
});
const executionTimePart = computed(() => {
  const val = formBinds.execution_date.modelValue as string | null;
  if (!val) return '00:00';
  return val.split(' ')[1] ?? '00:00';
});
const executionDateDisplay = computed(() => {
  const val = formBinds.execution_date.modelValue as string | null;
  return val ?? '';
});
function onDateChange(date: string) {
  const time = executionTimePart.value || '00:00';
  setFieldValue('execution_date', date ? `${date} ${time}` : null);
}
function onTimeChange(time: string) {
  const date = executionDatePart.value;
  if (date) setFieldValue('execution_date', `${date} ${time}`);
}

function isoToDisplay(date: string | null | undefined): string | null {
  if (!date) return null;
  try { return format(new Date(date), 'dd/MM/yyyy HH:mm'); } catch { return date; }
}

const { mutate, isLoading: isLoadingMutation } = useMutation(
  (data: ProductionProcessForm) => {
    if (props.item) return updateProductionProcess(props.item.id, data);
    return createProductionProcess(data);
  },
  {
    onSuccess: () => {
      onDialogOK();
      showSuccessFeedback(
        props.item
          ? t('pop.productionProcess.feedback.updated')
          : t('pop.productionProcess.feedback.created')
      );
      queryClient.invalidateQueries([productionProcessesQuery.name]);
      if (props.item)
        queryClient.invalidateQueries([productionProcessDetailQuery.name, props.item.id]);
    },
  }
);

const { fillRefetch, isFillLoading, fillError } = useFillFormQuery({
  query: productionProcessDetailQuery,
  id: computed(() => props.item?.id),
  readonly: props.readonly,
  setValues,
  onNotFound: onDialogCancel,
});

watch(
  () => props.item,
  (item) => {
    if (item) setValues({
      ...item,
      execution_date: isoToDisplay(item.execution_date),
    } as Partial<ProductionProcessForm>, false);
  },
  { immediate: true }
);

const onSubmit = handleSubmit((data) => mutate(data));
</script>
