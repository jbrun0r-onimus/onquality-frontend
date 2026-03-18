import { RouteLocation } from 'vue-router';

export type RouteInfo = {
  label: string;
  icon?: string;
  to: RouteLocation & { href: string };
};
