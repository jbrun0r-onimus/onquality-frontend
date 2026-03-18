<template>
  <div class="pop-print" v-if="data">
    <div class="form-header">
      <div class="company">Agro Mix Rações</div>
      <div class="form-title-block">
        <div class="form-title">PLANILHA DE FREQUÊNCIA E MONITORAMENTO DE LIMPEZA E HIGIENIZAÇÃO DAS INSTALAÇÕES, EQUIPAMENTOS E UTENSÍLIOS</div>
        <div class="form-subtitle">PL 04, Versão: 04</div>
      </div>
      <div class="version-block">
        <div>Versão: 04</div>
        <div>ANO: 2026</div>
      </div>
    </div>
    <table class="main-table">
      <thead>
        <tr>
          <th>Equipamento</th>
          <th>Limpeza Realizada (C/NC/-)</th>
          <th>Data de Execução</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ data.equipment }}</td>
          <td class="answer-cell">{{ formatBoolCNC(data.is_cleaning) }}</td>
          <td>{{ data.execution_date }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else class="loading">Carregando...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getMonitoringEquipment } from 'src/services/pop/monitoringEquipments.service';
import type { MonitoringEquipmentsDetail } from 'src/schemas/pop/monitoringEquipments.schemas';

const route = useRoute();
const data = ref<MonitoringEquipmentsDetail | null>(null);

function formatBoolCNC(val: boolean | null | undefined): string {
  if (val === true) return 'C';
  if (val === false) return 'NC';
  return '-';
}

onMounted(async () => {
  const id = Number(route.params.id);
  data.value = await getMonitoringEquipment(id);
  setTimeout(() => window.print(), 800);
});
</script>

<style>
.pop-print { font-family: Arial, sans-serif; font-size: 10pt; padding: 20px; max-width: 210mm; margin: 0 auto; }
.form-header { display: flex; border: 1px solid #000; }
.company { padding: 8px; border-right: 1px solid #000; font-weight: bold; white-space: nowrap; writing-mode: vertical-rl; text-align: center; }
.form-title-block { flex: 1; padding: 8px; text-align: center; border-right: 1px solid #000; }
.form-title { font-weight: bold; font-size: 10pt; text-transform: uppercase; }
.form-subtitle { font-size: 8pt; margin-top: 4px; }
.version-block { padding: 8px; text-align: center; font-size: 9pt; }
.main-table { width: 100%; border-collapse: collapse; border: 1px solid #000; border-top: none; }
.main-table th, .main-table td { border: 1px solid #000; padding: 6px 8px; }
.main-table th { background: #f0f0f0; font-weight: bold; text-align: center; }
.answer-cell { text-align: center; }
.loading { padding: 20px; text-align: center; }
@media print {
  .pop-print { padding: 0; margin: 0; max-width: 100%; }
  @page { margin: 15mm; }
}
</style>
