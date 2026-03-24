<template>
  <div class="drawer-logo-wrapper" :class="{ 'is-expanded': modelValue }">
    <!-- Logo / Icon -->
    <div
      role="button"
      class="logo-btn cursor-pointer"
      :class="{ 'logo-btn--expanded': modelValue }"
      @click="$emit('update:modelValue', !modelValue)"
      :title="modelValue ? 'Recolher menu' : 'Expandir menu'"
    >
      <q-img
        v-if="modelValue"
        src="~assets/img/logo.png"
        class="logo-full"
        fit="contain"
      />
      <q-icon
        v-else
        name="o_verified_user"
        size="24px"
        class="logo-icon"
      />
    </div>

    <q-separator class="logo-separator" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue?: boolean;
}>();

defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>

<style scoped lang="scss">
.drawer-logo-wrapper {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding-top: 12px;
}

.logo-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  min-height: 60px;
  transition: background 0.15s ease;
  border-radius: 0;

  &:hover {
    background: rgba(14, 50, 114, 0.05);
  }

  .body--dark &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  &--expanded {
    min-height: 80px;
    padding: 12px 20px;
  }
}

.logo-full {
  width: 110px;
  height: auto;
  max-height: 56px;
}

.logo-icon {
  color: $primary;

  .body--dark & {
    color: #93C5FD;
  }
}

.logo-separator {
  margin: 4px 16px;
  opacity: 0.5;
}
</style>
