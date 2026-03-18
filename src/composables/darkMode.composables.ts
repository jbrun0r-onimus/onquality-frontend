import { watch } from 'vue';
import { useQuasar } from 'quasar';

export function usePreferenceOrStoredDarkMode(storageKey = 'darkMode') {
  const $q = useQuasar();

  const stored = localStorage.getItem(storageKey);

  switch (stored?.toLowerCase()) {
    case 'true':
      $q.dark.set(true);
      break;
    case 'false':
      $q.dark.set(false);
      break;
    default:
      $q.dark.set('auto');
      break;
  }

  watch(
    () => $q.dark.isActive,
    (value) => localStorage.setItem(storageKey, value.toString()),
    {
      immediate: true,
    }
  );
}
