<template>
  <q-select
    :options="options"
    :model-value="i18n.locale.value"
    @update:model-value="setLocale"
    emit-value
    map-options
    dense
    options-dense
    hide-bottom-space
    borderless
    :loading="loading"
  >
    <template #selected>
      <q-img :src="selected.flag" width="24px" height="16px" class="rounded" />
    </template>
    <template #option="{ opt, itemProps }">
      <q-item v-bind="itemProps" class="items-center gap-2">
        <q-img :src="opt.flag" width="24px" height="16px" class="rounded" />
        <span>{{ opt.label }}</span>
      </q-item>
    </template>
  </q-select>
</template>

<script lang="ts" setup>
import { Quasar } from 'quasar';
import { locales } from 'src/i18n';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const options = Object.entries(locales).map(([key, value]) => ({
  label: value.label,
  value: key,
  flag: value.flag,
}));

const i18n = useI18n();

const loading = ref(false);

const selected = computed(
  () => locales[i18n.locale.value as keyof typeof locales]
);

async function setLocale(newLocale: string) {
  try {
    loading.value = true;
    const loaded = await locales[newLocale as keyof typeof locales].loader();
    Quasar.lang.set(loaded.quasar);
    i18n.setLocaleMessage(newLocale, loaded);
    i18n.locale.value = newLocale;
    localStorage.setItem('locale', newLocale);
  } finally {
    loading.value = false;
  }
}
</script>
