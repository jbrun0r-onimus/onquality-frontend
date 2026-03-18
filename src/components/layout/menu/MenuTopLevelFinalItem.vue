<template>
  <q-item exact-active-class="" active-class="active" v-bind="linkProps">
    <menu-top-level-icon-and-label
      :icon="item.icon"
      :label="fullyExpanded ? item.label : undefined"
    />
  </q-item>
</template>

<script lang="ts" setup>
import { toRef } from 'vue';
import { useFinalMenuItem } from 'src/composables/menu.composables';
import MenuTopLevelIconAndLabel from 'src/components/layout/menu/MenuTopLevelIconAndLabel.vue';
import { FinalMenuItem } from 'src/typings/menu.typings';

const props = defineProps<{
  fullyExpanded: boolean;
  item: FinalMenuItem;
}>();

const { linkProps } = useFinalMenuItem(toRef(props, 'item'));
</script>
