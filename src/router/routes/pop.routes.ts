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
    { path: 'monitoring-room-monthly', component: () => import('pages/pop/print/MonitoringRoomMonthlyPrintPage.vue') },
    { path: 'monitoring-equipments/:id', component: () => import('pages/pop/print/MonitoringEquipmentsPrintPage.vue') },
    { path: 'training-log/:id', component: () => import('pages/pop/print/TrainingLogPrintPage.vue') },
    { path: 'water-cooler-sanitization/:id', component: () => import('pages/pop/print/WaterCoolerSanitizationPrintPage.vue') },
    { path: 'change-water-cooler-filter/:id', component: () => import('pages/pop/print/ChangeWaterCoolerFilterPrintPage.vue') },
    { path: 'sanitization-control/:id', component: () => import('pages/pop/print/SanitizationControlPrintPage.vue') },
    { path: 'maintenance-control/:id', component: () => import('pages/pop/print/MaintenanceControlPrintPage.vue') },
    { path: 'cleaning-supplies-control/:id', component: () => import('pages/pop/print/CleaningSuppliesControlPrintPage.vue') },
    { path: 'check-list-pest/:id', component: () => import('pages/pop/print/CheckListPestPrintPage.vue') },
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
      name: 'pop.monitoringRoomMonthly',
      path: 'monitoring-room-monthly',
      component: () => import('pages/pop/MonitoringRoomMonthlyPage.vue'),
      meta: {
        name: (i18n: any) => i18n.t('pop.monitoringRoom.titles.monthly'),
        icon: 'o_calendar_month',
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
    {
      name: 'pop.waterCoolerSanitization',
      path: 'water-cooler-sanitization',
      component: () => import('pages/pop/WaterCoolerSanitizationPage.vue'),
      meta: {
        name: (i18n: any) => i18n.t('pop.waterCoolerSanitization.titles.list'),
        icon: 'o_water_drop',
      },
    },
    {
      name: 'pop.changeWaterCoolerFilter',
      path: 'change-water-cooler-filter',
      component: () => import('pages/pop/ChangeWaterCoolerFilterPage.vue'),
      meta: {
        name: (i18n: any) => i18n.t('pop.changeWaterCoolerFilter.titles.list'),
        icon: 'o_filter_alt',
      },
    },
    {
      name: 'pop.sanitizationControl',
      path: 'sanitization-control',
      component: () => import('pages/pop/SanitizationControlPage.vue'),
      meta: {
        name: (i18n: any) => i18n.t('pop.sanitizationControl.titles.list'),
        icon: 'o_water',
      },
    },
    {
      name: 'pop.maintenanceControl',
      path: 'maintenance-control',
      component: () => import('pages/pop/MaintenanceControlPage.vue'),
      meta: {
        name: (i18n: any) => i18n.t('pop.maintenanceControl.titles.list'),
        icon: 'o_build',
      },
    },
    {
      name: 'pop.cleaningSuppliesControl',
      path: 'cleaning-supplies-control',
      component: () => import('pages/pop/CleaningSuppliesControlPage.vue'),
      meta: {
        name: (i18n: any) => i18n.t('pop.cleaningSuppliesControl.titles.list'),
        icon: 'o_cleaning_services',
      },
    },
    {
      name: 'pop.maintenanceEquipmentsPop',
      path: 'maintenance-equipments-pop',
      component: () => import('pages/pop/MaintenanceEquipmentsPopPage.vue'),
      meta: {
        name: (i18n: any) => i18n.t('pop.maintenanceEquipmentsPop.titles.list'),
        icon: 'o_handyman',
      },
    },
    {
      name: 'pop.productionProcess',
      path: 'production-process',
      component: () => import('pages/pop/ProductionProcessPage.vue'),
      meta: {
        name: (i18n: any) => i18n.t('pop.productionProcess.titles.list'),
        icon: 'o_factory',
      },
    },
    {
      name: 'pop.checkListPest',
      path: 'check-list-pest',
      component: () => import('pages/pop/CheckListPestPage.vue'),
      meta: {
        name: (i18n: any) => i18n.t('pop.checkListPest.titles.list'),
        icon: 'o_pest_control',
      },
    },
    {
      name: 'pop.nonConformanceLog',
      path: 'non-conformance-log',
      component: () => import('pages/pop/NonConformanceLogPage.vue'),
      meta: {
        name: (i18n: any) => i18n.t('pop.nonConformanceLog.titles.list'),
        icon: 'o_report_problem',
      },
    },
  ],
};
