<template>
  <q-card v-bind="$props">
    <q-form @submit="onSubmit">
      <q-card-section class="logo-wrapper flex flex-center">
        <q-img src="~assets/img/logo.png" width="75%" />
      </q-card-section>

      <q-card-section class="q-pb-sm">
        <text-field
          class="q-mb-md"
          :label="$t('common.fields.username')"
          v-bind="userBinds"
          data-cy="user"
        />
        <password-field
          :label="$t('common.fields.password')"
          class="q-mb-md"
          v-bind="passwordBinds"
          data-cy="password"
        />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <app-button
          :label="$t('auth.login.submit')"
          class="full-width"
          type="submit"
        />
      </q-card-section>
    </q-form>
  </q-card>
  <loading-overlay v-if="isLoading" />
</template>

<script setup lang="ts">
import { QCardProps } from 'quasar';
import { useMutation } from '@tanstack/vue-query';
import { useAuthStore } from 'src/stores/auth.store';
import { inputBindsConfig } from 'src/helpers/misc.helpers';
import { loginSchema } from 'src/schemas/auth.schemas';
import TextField from 'src/components/form/TextField.vue';
import PasswordField from 'src/components/form/PasswordField.vue';
import AppButton from 'src/components/misc/AppButton';
import LoadingOverlay from 'src/components/misc/LoadingOverlay.vue';
import { useAppForm } from 'src/composables/form.composables';
const authStore = useAuthStore();

defineProps<Pick<QCardProps, 'flat'>>();

const { defineComponentBinds, handleSubmit } = useAppForm(loginSchema);

const userBinds = defineComponentBinds('user', inputBindsConfig);
const passwordBinds = defineComponentBinds('password', inputBindsConfig);

const { mutate, isLoading } = useMutation(authStore.login);

const onSubmit = handleSubmit((data) => mutate(data));
</script>

<style scoped lang="scss">
.q-card {
  width: min(400px, 100%);
}

.logo-wrapper {
  width: 100%;
  aspect-ratio: 2 / 1;
}
</style>
