<template>
  <q-drawer v-bind="$props" :width="width" class="column">
    <app-drawer-logo v-model="expanded" class="q-mb-sm" />
    <menu-list
      @expand="expanded = true"
      :fully-expanded="expanded && !transitioning"
    />
    <q-space />
    <app-header-top-right class="lt-sm justify-center q-pa-sm" />
  </q-drawer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { QDrawerProps } from 'quasar';
import AppDrawerLogo from 'src/components/layout/AppDrawerLogo.vue';
import AppHeaderTopRight from 'src/components/layout/header/AppHeaderTopRight.vue';
import MenuList from 'src/components/layout/menu/MenuList.vue';

const props = withDefaults(defineProps<Omit<QDrawerProps, 'dark'>>(), {
  showIfAbove: true,
  bordered: true,
});

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const expanded = ref(true);
const transitioning = ref(false);
const width = computed(() => (expanded.value ? 201 : 51));

const transitionDelay = 300;

watch(expanded, () => {
  transitioning.value = true;
  setTimeout(() => {
    transitioning.value = false;
  }, transitionDelay);
});

watch(
  () => props.modelValue,
  () => {
    expanded.value = true;
  }
);
</script>

<style scoped lang="scss">
.q-drawer-container {
  > :deep(.q-drawer) {
    --q-transition-duration: v-bind('transitionDelay + "ms"');
  }

  :deep(.q-drawer__content) {
    overflow-x: hidden;
  }
}
</style>
