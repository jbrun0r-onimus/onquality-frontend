<template>
  <text-field
    ref="textFieldRef"
    v-bind="textFieldProps"
    @blur="handleBlur"
    :mask="makeInputMaskFromDateFormat($t('common.masks.quasarDate'))"
  >
    <template v-slot:append>
      <q-icon name="o_event" class="cursor-pointer">
        <q-popup-proxy
          v-model="popupOpen"
          @hide="handleHide"
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            :navigation-min-year-month="notPastYearMonth"
            :default-year-month="notPastYearMonth"
            :options="notPastFilter"
            :model-value="modelValue"
            @update:model-value="$emit('update:modelValue', $event)"
            :mask="$t('common.masks.quasarDate')"
          >
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </text-field>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { date } from 'yup';
import { QInputProps } from 'quasar';
import { makeInputMaskFromDateFormat } from 'src/helpers/misc.helpers';
import TextField from 'src/components/form/TextField.vue';

const props = withDefaults(
  defineProps<
    Omit<QInputProps, 'type' | 'dark'> & {
      icon?: string;
      notPast?: boolean | string | Date;
    }
  >(),
  {
    outlined: undefined,
    dense: undefined,
    notPast: false,
    hideBottomSpace: true,
  }
);

const emit = defineEmits<{
  (e: 'blur'): void;
  (e: 'update:modelValue', value: string): void;
}>();

const textFieldRef = ref<InstanceType<typeof TextField>>();
const popupOpen = ref(false);

const textFieldProps = computed(() => ({
  ...props,
  // We will replace vee-validate's onBlur handler with our own
  onBlur: undefined,
}));

function handleBlur() {
  if (!popupOpen.value) emit('blur');
}

function handleHide() {
  if (document.activeElement !== textFieldRef.value?.qInputRef?.nativeEl)
    emit('blur');
}

function getNotPastDate(notPastValue: boolean | string | Date): Date {
  if (notPastValue instanceof Date) return notPastValue;
  if (typeof notPastValue === 'boolean') return new Date();
  try {
    return date().acceptLocalFormat().required().validateSync(notPastValue);
  } catch (e) {
    return new Date();
  }
}

const notPastString = computed(() => {
  if (!props.notPast) return undefined;
  const notPastDate = getNotPastDate(props.notPast);
  const yearString = notPastDate.getFullYear().toString();
  const monthString = (notPastDate.getMonth() + 1).toString().padStart(2, '0');
  const dayString = notPastDate.getDate().toString().padStart(2, '0');
  return `${yearString}/${monthString}/${dayString}`;
});

const notPastYearMonth = computed(() => notPastString.value?.substring(0, 7));

const notPastFilter = computed(() => {
  const notPastStringValue = notPastString.value;
  if (!notPastStringValue) return undefined;
  return (date: string) => date >= notPastStringValue;
});
</script>
