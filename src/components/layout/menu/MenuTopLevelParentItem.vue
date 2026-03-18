<template>
  <q-expansion-item
    :model-value="expanded"
    @update:model-value="onUpdateModelValue"
    :class="{ active: isActive }"
    :hide-expand-icon="!fullyExpanded"
    exact-active-class=""
    active-class=""
    :header-class="{ active: isActive }"
  >
    <template v-slot:header>
      <menu-top-level-icon-and-label
        :icon="item.icon"
        :label="fullyExpanded ? item.label : undefined"
        active
      />
    </template>
    <q-list>
      <menu-sub-item
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
        ref="childrenRefs"
      />
    </q-list>
  </q-expansion-item>
</template>

<script lang="ts" setup>
import { ComputedRef, computed, ref, watch } from 'vue';
import { ParentMenuItem } from 'src/typings/menu.typings';
import MenuTopLevelIconAndLabel from 'src/components/layout/menu/MenuTopLevelIconAndLabel.vue';
import MenuSubItem from 'src/components/layout/menu/MenuSubItem.vue';

const props = defineProps<{
  fullyExpanded: boolean;
  item: ParentMenuItem;
}>();

const emit = defineEmits<{
  (e: 'expand'): void;
}>();

const childrenRefs = ref<InstanceType<typeof MenuSubItem>[]>([]);
const expanded = ref(false);

const isActive: ComputedRef<boolean> = computed(
  () => childrenRefs.value.some((child) => child.isActive) ?? false
);

watch(isActive, (value) => {
  if (value) expanded.value = true;
});

watch(
  () => props.fullyExpanded,
  (fullyExpanded) => {
    if (!fullyExpanded) expanded.value = false;
  }
);

function onUpdateModelValue(value: boolean) {
  expanded.value = value;
  if (value) emit('expand');
}
</script>
