import { format } from 'date-fns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export function useDateLocalizer() {
  const { t } = useI18n();

  return computed(() => {
    const dateFormat = t('common.formats.date');
    return (date: Date) => format(date, dateFormat);
  });
}
