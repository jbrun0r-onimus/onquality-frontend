<template>
  <q-list>
    <template v-for="(section, index) in sections" :key="index">
      <q-item-label v-if="section.label" header>
        {{ fullyExpanded ? section.label : '&nbsp;' }}
      </q-item-label>
      <menu-top-level-item
        v-for="(item, index) in section.items"
        :key="index"
        :fully-expanded="fullyExpanded"
        :item="item"
        @expand="$emit('expand')"
      />
      <q-separator v-if="index < sections.length - 1" spaced inset />
    </template>
  </q-list>
</template>

<script setup lang="ts">
import { useMenu } from 'src/composables/menu.composables';
import MenuTopLevelItem from 'src/components/layout/menu/MenuTopLevelItem.vue';

const { sections } = useMenu();

defineProps<{
  fullyExpanded: boolean;
}>();

defineEmits<{
  (e: 'expand'): void;
}>();
</script>

<style scoped lang="scss">
.q-list {
  color: #707070;
}
</style>
