import { Dialog } from 'quasar';
import { globalI18n } from 'src/boot/i18n';
import ConfirmationDialog from 'src/components/misc/ConfirmationDialog.vue';

export function askConfirmation({
  title,
  message,
  okLabel,
  cancelLabel,
  okColor,
  cancelColor,
}: {
  title: string;
  message: string;
  okLabel?: string;
  cancelLabel?: string;
  okColor?: string;
  cancelColor?: string;
}): Promise<boolean> {
  return new Promise((resolve) => {
    Dialog.create({
      component: ConfirmationDialog,
      componentProps: {
        title,
        message,
        okLabel,
        cancelLabel,
        okColor,
        cancelColor,
      },
    })
      .onOk(() => resolve(true))
      .onCancel(() => resolve(false));
  });
}

export function askForDeleteConfirmation(title: string, message: string) {
  return askConfirmation({
    title,
    message,
    okLabel: globalI18n.t('common.actions.delete'),
    okColor: 'negative',
  });
}
