import { RouteLocationRaw } from 'vue-router';

export type FinalMenuItem = {
  icon?: string;
  label: string;
} & (
  | {
      to: RouteLocationRaw;
    }
  | {
      href: string;
      target?: string;
    }
);

export type ParentMenuItem = {
  icon?: string;
  label: string;
  children: FinalMenuItem[];
};

export type MenuItem = ParentMenuItem | FinalMenuItem;

export type MenuSection = {
  label?: string;
  items: MenuItem[];
};
