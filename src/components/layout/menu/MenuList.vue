<template>
  <q-list class="menu-list">
    <template v-for="(section, index) in sections" :key="index">
      <q-item-label
        v-if="section.label && fullyExpanded"
        header
        class="menu-section-label"
      >
        {{ section.label }}
      </q-item-label>

      <menu-top-level-item
        v-for="(item, itemIndex) in section.items"
        :key="itemIndex"
        :fully-expanded="fullyExpanded"
        :item="item"
        @expand="$emit('expand')"
      />

      <q-separator
        v-if="index < sections.length - 1"
        class="menu-separator"
        spaced
      />
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
.menu-list {
  padding: 4px 0;
}

.menu-section-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #94A3B8;
  padding: 12px 18px 6px;

  .body--dark & {
    color: #475569;
  }
}

.menu-separator {
  margin: 4px 12px;
  opacity: 0.4;
}
</style>
