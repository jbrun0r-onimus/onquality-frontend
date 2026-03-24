<template>
  <q-drawer v-bind="$props" :width="width" class="app-drawer column">
    <app-drawer-logo v-model="expanded" class="q-mb-sm" />
    <menu-list
      @expand="expanded = true"
      :fully-expanded="expanded && !transitioning"
    />
    <q-space />
    <div class="drawer-footer" :class="{ 'drawer-footer--collapsed': !expanded }">
      <app-header-top-right class="lt-sm justify-center q-pa-sm" />
    </div>
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
  bordered: false,
});

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const expanded = ref(true);
const transitioning = ref(false);
const width = computed(() => (expanded.value ? 220 : 56));

const transitionDelay = 280;

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
.app-drawer {
  background: #FFFFFF;
  border-right: 1px solid #E8EDF4;
  box-shadow: 2px 0 8px rgba(14, 50, 114, 0.04);

  :deep(.q-drawer__content) {
    overflow-x: hidden;
  }

  .body--dark & {
    background: #0B1729;
    border-right-color: rgba(255, 255, 255, 0.06);
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.3);
  }
}

.q-drawer-container {
  > :deep(.q-drawer) {
    --q-transition-duration: v-bind('transitionDelay + "ms"');
    transition: width var(--q-transition-duration) cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.drawer-footer {
  padding: 8px;
  border-top: 1px solid #F1F5F9;

  .body--dark & {
    border-top-color: rgba(255, 255, 255, 0.06);
  }
}
</style>
