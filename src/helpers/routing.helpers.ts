import {
  RouteLocationRaw,
  RouteLocationMatched,
  Router,
  RouteMeta,
  RouteLocation,
} from 'vue-router';
import { RouteInfo } from 'src/typings/routing.typings';
import { TranslationComposer } from 'src/boot/i18n';
import { createCanTree } from 'src/composables/permission.composables';

function getRouteName(route: { meta: RouteMeta }, i18n: TranslationComposer) {
  return typeof route.meta.name === 'function'
    ? route.meta.name(i18n)
    : route.meta.name;
}

export function resolveRouteInfo(
  router: Router,
  i18n: TranslationComposer,
  location: RouteLocationRaw
): RouteInfo {
  const resolved = router.resolve(location);

  if (resolved.matched.length === 1 && resolved.matched[0].name === 'not-found')
    throw new Error(`Route ${location} not found`);

  if (!resolved.meta)
    throw new Error(`Route resolved from ${location} has no meta information`);

  return {
    label: getRouteName(resolved, i18n),
    icon: resolved.meta.icon,
    to: resolved,
  };
}

export function isRouteAuthorized(
  location: RouteLocation,
  permissionsCan: ReturnType<typeof createCanTree>
): boolean {
  return location.meta?.permission
    ? location.meta.permission(permissionsCan)
    : true;
}

export function getBreadcrumbItems(
  matched: RouteLocationMatched[],
  i18n: TranslationComposer
) {
  return matched
    .filter((item) => !item.meta?.hideInBreadcrumb)
    .map((item) => ({
      label: getRouteName(item, i18n),
      to: item.meta?.nonClickableInBreadcrumb ? undefined : item.path,
    }));
}
