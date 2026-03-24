<template>
  <q-layout view="hHh lpR fFf">
    <div class="auth-wrapper">
      <!-- Form Panel -->
      <div class="auth-form-panel">
        <q-page-container>
          <router-view />
        </q-page-container>
      </div>

      <!-- Visual Panel (desktop only) -->
      <div class="auth-visual-panel gt-sm">
        <div class="auth-visual-inner">
          <div class="auth-brand">
            <div class="brand-logo">
              <q-icon name="o_verified_user" size="36px" color="white" />
            </div>
            <div class="brand-name">OnQuality</div>
            <div class="brand-tagline">Sistema de Gestão da Qualidade</div>
          </div>

          <div class="auth-features">
            <div class="feature-item" v-for="f in features" :key="f.icon">
              <div class="feature-icon">
                <q-icon :name="f.icon" size="18px" color="white" />
              </div>
              <span>{{ f.text }}</span>
            </div>
          </div>

          <div class="auth-visual-footer">
            Conformidade &amp; Rastreabilidade em tempo real
          </div>
        </div>

        <!-- Decorative Shapes -->
        <div class="shape shape-1" />
        <div class="shape shape-2" />
        <div class="shape shape-3" />
      </div>
    </div>
  </q-layout>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'src/stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const features: Array<{ icon: string; text: string }> = [
  { icon: 'o_checklist',       text: 'Procedimentos Operacionais Padrão' },
  { icon: 'o_report_problem',  text: 'Registro de Não Conformidades' },
  { icon: 'o_local_shipping',  text: 'Inspeção e Rastreio de Carga' },
  { icon: 'o_school',          text: 'Controle de Treinamentos' },
  { icon: 'o_analytics',       text: 'Painel de Indicadores KPI' },
];

watch(
  () => authStore.isLoggedIn,
  (isLoggedIn) => {
    if (!isLoggedIn) return;
    const redirectTo = router.currentRoute.value.query.redirect?.toString() || {
      name: 'dashboard',
    };
    router.push(redirectTo);
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.auth-wrapper {
  display: flex;
  min-height: 100vh;
}

// ─── Form Panel ───────────────────────────────────────────────────────────────

.auth-form-panel {
  flex: 0 0 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F8FAFC;
  position: relative;
  z-index: 1;

  @media (max-width: 1023px) {
    flex: 1;
  }

  :deep(.q-page-container) {
    background: transparent;
    width: 100%;
  }
}

// ─── Visual Panel ─────────────────────────────────────────────────────────────

.auth-visual-panel {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: linear-gradient(145deg, #0B2559 0%, #0E3272 45%, #1565C0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-visual-inner {
  position: relative;
  z-index: 2;
  padding: 48px;
  max-width: 500px;
  color: white;
}

// Brand
.auth-brand {
  margin-bottom: 56px;
}

.brand-logo {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  backdrop-filter: blur(8px);
}

.brand-name {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 6px;
}

.brand-tagline {
  font-size: 0.95rem;
  opacity: 0.7;
  font-weight: 400;
  letter-spacing: 0.2px;
}

// Features list
.auth-features {
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-bottom: 56px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 0.875rem;
  opacity: 0.88;
  font-weight: 500;
}

.feature-icon {
  width: 34px;
  height: 34px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

// Footer text
.auth-visual-footer {
  font-size: 0.75rem;
  opacity: 0.45;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

// ─── Decorative Shapes ────────────────────────────────────────────────────────

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.shape-1 {
  width: 400px;
  height: 400px;
  top: -120px;
  right: -100px;
}

.shape-2 {
  width: 280px;
  height: 280px;
  bottom: -60px;
  left: 60px;
}

.shape-3 {
  width: 160px;
  height: 160px;
  top: 50%;
  right: 40px;
  transform: translateY(-50%);
  background: rgba(245, 158, 11, 0.06);
  border-color: rgba(245, 158, 11, 0.12);
}
</style>
