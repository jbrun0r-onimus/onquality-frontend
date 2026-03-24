<template>
  <q-btn-dropdown
    flat
    no-caps
    class="user-dropdown"
  >
    <template v-slot:label>
      <div class="user-btn-inner">
        <div class="user-avatar">
          {{ userInitial }}
        </div>
        <span class="user-name gt-xs">{{ authStore.empresa ?? '' }}</span>
      </div>
    </template>

    <q-list dense class="user-menu">
      <div class="user-menu-header">
        <div class="user-menu-avatar">{{ userInitial }}</div>
        <div>
          <div class="user-menu-name">{{ authStore.empresa ?? '' }}</div>
          <div class="user-menu-role">Operador</div>
        </div>
      </div>

      <q-separator class="q-my-xs" />

      <q-item clickable v-close-popup @click="authStore.logout" class="user-menu-item">
        <q-item-section avatar>
          <q-icon name="o_logout" size="16px" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t('auth.logout') }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from 'src/stores/auth.store';

const authStore = useAuthStore();

const userInitial = computed(() => {
  const name = authStore.empresa ?? '';
  return name.charAt(0).toUpperCase() || 'U';
});
</script>

<style scoped lang="scss">
.user-dropdown {
  color: #475569;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(14, 50, 114, 0.06);
  }

  .body--dark & {
    color: #94A3B8;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
    }
  }
}

.user-btn-inner {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, $primary, $secondary);
  color: white;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .body--dark & { color: #CBD5E1; }
}

// Dropdown menu
.user-menu {
  min-width: 200px;
  padding: 8px;
}

.user-menu-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px 12px;
}

.user-menu-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, $primary, $secondary);
  color: white;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-menu-name {
  font-size: 13px;
  font-weight: 700;
  color: #1E293B;

  .body--dark & { color: #F1F5F9; }
}

.user-menu-role {
  font-size: 11px;
  color: #94A3B8;
  margin-top: 2px;
}

.user-menu-item {
  border-radius: 6px;
  color: #DC2626;
  font-size: 13px;

  :deep(.q-icon) {
    color: #DC2626;
  }
}
</style>
