<template>
  <q-btn
    flat
    round
    dense
    icon="o_content_copy"
    :color="color"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import { NamedColor } from 'quasar';
import {
  showErrorFeedback,
  showSuccessFeedback,
} from 'src/helpers/feedback.helpers';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
  defineProps<{
    value?: string;
    showFeedback?: boolean;
    color?: NamedColor;
  }>(),
  {
    showFeedback: true,
    color: 'grey-6',
  }
);

const { t } = useI18n();

async function tryCopyWithClipboardApi(text: string): Promise<boolean> {
  if (!navigator.clipboard) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function tryCopyWithExecCommand(text: string): boolean {
  try {
    if (
      !document.execCommand ||
      !document.queryCommandSupported ||
      !document.queryCommandSupported('copy')
    ) {
      return false;
    }

    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    return true;
  } catch {
    return false;
  }
}

async function handleClick() {
  if (!props.value) return;
  const result = await tryCopyWithClipboardApi(props.value);
  if (result || tryCopyWithExecCommand(props.value)) {
    showSuccessFeedback(t('common.feedback.copiedToClipboard'));
  } else {
    showErrorFeedback(t('common.feedback.couldNotCopyToClipboard'));
  }
}
</script>
