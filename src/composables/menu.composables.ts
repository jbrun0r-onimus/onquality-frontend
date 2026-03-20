import { Ref, computed } from 'vue';
import { RouteLocationRaw, Router, useRouter } from 'vue-router';
import {
  FinalMenuItem,
  MenuSection,
  ParentMenuItem,
} from 'src/typings/menu.typings';
import {
  isRouteAuthorized,
  resolveRouteInfo,
} from 'src/helpers/routing.helpers';
import { useAuthStore } from 'src/stores/auth.store';
import { TranslationComposer } from 'src/boot/i18n';
import { useI18n } from 'vue-i18n';
import { RouteInfo } from 'src/typings/routing.typings';
import { keepPresent } from 'src/helpers/misc.helpers';
import { createCanTree } from 'src/composables/permission.composables';

function keepWithChildren(item: ParentMenuItem): ParentMenuItem | null {
  return item.children.length ? item : null;
}

function makeMenuSections(
  router: Router,
  i18n: TranslationComposer,
  permissionsCan: ReturnType<typeof createCanTree>
): MenuSection[] {
  const fromRoute = (
    location: RouteLocationRaw,
    stripIcon = false
  ): RouteInfo | null => {
    const route = resolveRouteInfo(router, i18n, location);
    if (!isRouteAuthorized(route.to, permissionsCan)) return null;
    if (stripIcon) route.icon = undefined;
    return route;
  };

  return [
    {
      items: keepPresent([
        keepWithChildren({
          label: i18n.t('pop.title'),
          children: keepPresent([
            fromRoute({ name: 'pop.cargoInspection' }),
            fromRoute({ name: 'pop.materialReceiving' }),
            fromRoute({ name: 'pop.monitoringRoom' }),
            fromRoute({ name: 'pop.monitoringEquipments' }),
            fromRoute({ name: 'pop.cleaningEfficiency' }),
            fromRoute({ name: 'pop.sanitationControl' }),
            fromRoute({ name: 'pop.trainingLog' }),
            fromRoute({ name: 'pop.waterCoolerSanitization' }),
            fromRoute({ name: 'pop.changeWaterCoolerFilter' }),
            fromRoute({ name: 'pop.sanitizationControl' }),
            fromRoute({ name: 'pop.maintenanceControl' }),
            fromRoute({ name: 'pop.cleaningSuppliesControl' }),
            fromRoute({ name: 'pop.maintenanceEquipmentsPop' }),
            fromRoute({ name: 'pop.productionProcess' }),
            fromRoute({ name: 'pop.checkListPest' }),
            fromRoute({ name: 'pop.nonConformanceLog' }),
          ]),
        }),
      ]),
    },
  ];
}

export function useMenu() {
  const router = useRouter();
  const authStore = useAuthStore();
  const i18n = useI18n();

  const sections = computed(() =>
    makeMenuSections(router, i18n, authStore.can)
  );

  return { sections };
}

export function useFinalMenuItem(item: Ref<FinalMenuItem>) {
  const router = useRouter();

  const resolved = computed(() =>
    'to' in item.value ? router.resolve(item.value.to) : undefined
  );

  const isActive = computed(() =>
    resolved.value
      ? resolved.value.path === router.currentRoute.value.path
      : false
  );

  const linkProps = computed(() =>
    'to' in item.value
      ? { to: resolved.value }
      : { href: item.value.href, target: item.value.target }
  );

  return { resolved, isActive, linkProps };
}
