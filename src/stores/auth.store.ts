import { defineStore } from 'pinia'
import { createCanTree } from 'src/composables/permission.composables'
import { LoginRequest, LoginResponse } from 'src/schemas/auth.schemas'
import { login } from 'src/services/auth.service'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    info: null as LoginResponse | null
  }),
  actions: {
    async login(data: LoginRequest) {
      const resp = await login(data)
      this.info = {
        empresa_id: resp.empresa_id,
        empresa: resp.empresa
      }
    },
    logout() {
      this.info = null
    }
  },
  getters: {
    isLoggedIn: (state) => !!state.info,
    empresaId: (state) => state.info?.empresa_id ?? null,
    empresa: (state) => state.info?.empresa ?? null,
    can: () => createCanTree([])
  },
  persist: true
})
