import { includesAll, includesAny } from 'src/helpers/misc.helpers';
import { useAuthStore } from 'src/stores/auth.store';
import { toRef } from 'vue';

type Role = string;

export function createCanTree(roles: Role[]) {
  const set = new Set(roles);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const has = (role: Role) => set.has(role);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const all = (...roles: Role[]) => includesAll(set, roles);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const any = (...roles: Role[]) => includesAny(set, roles);

  return {};
}

export function usePermissionsCan() {
  const authStore = useAuthStore();

  return toRef(authStore, 'can');
}
