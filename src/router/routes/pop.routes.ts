import { RouteRecordRaw } from 'vue-router';

export const popPrintRoute: RouteRecordRaw = {
  path: '/pop/print',
  component: () => import('layouts/PrintLayout.vue'),
  children: [
    { path: 'cargo-inspection/:id', component: () => import('pages/pop/print/CargoInspectionPrintPage.vue') },
    { path: 'material-receiving/:id', component: () => import('pages/pop/print/MaterialReceivingPrintPage.vue') },
    { path: 'cleaning-efficiency/:id', component: () => import('pages/pop/print/CleaningEfficiencyPrintPage.vue') },
    { path: 'sanitation-control/:id', component: () => import('pages/pop/print/SanitationControlPrintPage.vue') },
    { path: 'monitoring-room/:id', component: () => import('pages/pop/print/MonitoringRoomPrintPage.vue') },
    { path: 'monitoring-equipments/:id', component: () => import('pages/pop/print/MonitoringEquipmentsPrintPage.vue') },
    { path: 'training-log/:id', component: () => import('pages/pop/print/TrainingLogPrintPage.vue') },
  ],
};

export const popRoute: RouteRecordRaw = {
  path: 'pop',
  meta: {
    name: (i18n: any) => i18n.t('pop.title'),
    icon: 'o_checklist',
    nonClickableInBreadcrumb: true,
  },
  children: [
    {
      name: 'pop.cargoInspection',
      path: 'cargo-inspection',
      component: () => import('pages/pop/CargoInspectionPage.vue'),
      meta: {
        name: (i18n: any) => i18n.t('pop.cargoInspection.titles.list'),
        icon: 'o_local_shipping',
      },
    },
    {
      name: 'pop.materialReceiving',
      path: 'material-receiving',
      component: () => import('pages/pop/MaterialReceivingPage.vue'),
      meta: {
        name: (i18n: any) => i18n.t('pop.materialReceiving.titles.list'),
        icon: 'o_inventory_2',
      },
    },
    {
      name: 'pop.monitoringRoom',
      path: 'monitoring-room',
      component: () => import('pages/pop/MonitoringRoomPage.vue'),
      meta: {
        name: (i18n: any) => i18n.t('pop.monitoringRoom.titles.list'),
        icon: 'o_home_work',
      },
    },
    {
      name: 'pop.monitoringEquipments',
      path: 'monitoring-equipments',
      component: () => import('pages/pop/MonitoringEquipmentsPage.vue'),
      meta: {
        name: (i18n: any) => i18n.t('pop.monitoringEquipments.titles.list'),
        icon: 'o_precision_manufacturing',
      },
    },
    {
      name: 'pop.cleaningEfficiency',
      path: 'cleaning-efficiency',
      component: () => import('pages/pop/CleaningEfficiencyPage.vue'),
      meta: {
        name: (i18n: any) => i18n.t('pop.cleaningEfficiency.titles.list'),
        icon: 'o_clean_hands',
      },
    },
    {
      name: 'pop.sanitationControl',
      path: 'sanitation-control',
      component: () => import('pages/pop/SanitationControlPage.vue'),
      meta: {
        name: (i18n: any) => i18n.t('pop.sanitationControl.titles.list'),
        icon: 'o_health_and_safety',
      },
    },
    {
      name: 'pop.trainingLog',
      path: 'training-log',
      component: () => import('pages/pop/TrainingLogPage.vue'),
      meta: {
        name: (i18n: any) => i18n.t('pop.trainingLog.titles.list'),
        icon: 'o_school',
      },
    },
  ],
};
