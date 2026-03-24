<template>
  <div class="login-container">
    <div class="login-header q-mb-lg">
      <q-img
        src="~assets/img/logo.png"
        class="login-logo q-mb-lg"
        fit="contain"
      />
      <h1 class="login-title">Bem-vindo de volta</h1>
      <p class="login-subtitle">Faça login para acessar o sistema</p>
    </div>

    <q-form @submit="onSubmit" class="login-form">
      <text-field
        class="q-mb-md"
        :label="$t('common.fields.username')"
        v-bind="userBinds"
        data-cy="user"
        outlined
        bg-color="white"
      />
      <password-field
        :label="$t('common.fields.password')"
        class="q-mb-lg"
        v-bind="passwordBinds"
        data-cy="password"
        outlined
        bg-color="white"
      />

      <app-button
        :label="$t('auth.login.submit')"
        class="full-width login-btn"
        type="submit"
        size="md"
        unelevated
      />
    </q-form>

    <loading-overlay v-if="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query';
import { useAuthStore } from 'src/stores/auth.store';
import { inputBindsConfig } from 'src/helpers/misc.helpers';
import { loginSchema } from 'src/schemas/auth.schemas';
import TextField from 'src/components/form/TextField.vue';
import PasswordField from 'src/components/form/PasswordField.vue';
import AppButton from 'src/components/misc/AppButton/AppButton.vue';
import LoadingOverlay from 'src/components/misc/LoadingOverlay.vue';
import { useAppForm } from 'src/composables/form.composables';

const authStore = useAuthStore();
const { defineComponentBinds, handleSubmit } = useAppForm(loginSchema);

const userBinds = defineComponentBinds('user', inputBindsConfig);
const passwordBinds = defineComponentBinds('password', inputBindsConfig);

const { mutate, isLoading } = useMutation(authStore.login);
const onSubmit = handleSubmit((data) => mutate(data));
</script>

<style scoped lang="scss">
.login-container {
  width: min(380px, 100%);
  padding: 40px 32px;
  margin: auto;
}

.login-logo {
  width: 100px;
  height: auto;
  display: block;
  margin: 0 auto 8px;
}

.login-header {
  text-align: center;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0E3272;
  margin: 0 0 6px;
  letter-spacing: -0.3px;
}

.login-subtitle {
  font-size: 0.875rem;
  color: #64748B;
  margin: 0;
  font-weight: 400;
}

.login-btn {
  height: 44px;
  font-weight: 600;
  letter-spacing: 0.3px;
  font-size: 0.9rem;
}

.body--dark {
  .login-title {
    color: #93C5FD;
  }

  .login-subtitle {
    color: #94A3B8;
  }
}
</style>
