<template>
  <div class="pop-print" v-if="data">
    <div class="form-header">
      <div class="company">Agro Mix Rações</div>
      <div class="form-title-block">
        <div class="form-title">Planilha de Avaliação da Manutenção e Controle de Registros de Higienização</div>
        <div class="form-subtitle">Frequência: Semestral — CONTROLE DE MANUTENÇÃO</div>
      </div>
      <div class="version-block">
        <div>Versão: 04</div>
        <div>Ano: 2025</div>
      </div>
    </div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Nº da Caixa</th>
          <th>Data</th>
          <th v-for="(q, i) in questions" :key="i">{{ q }}</th>
          <th>Executado por</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center">{{ data.box_number }}</td>
          <td class="text-center">{{ formatDate(data.execution_date) }}</td>
          <td class="text-center">{{ formatBool(data.question1) }}</td>
          <td class="text-center">{{ formatBool(data.question2) }}</td>
          <td class="text-center">{{ formatBool(data.question3) }}</td>
          <td>{{ data.employee_name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else class="loading">Carregando...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { parse, format } from 'date-fns';
import { getMaintenanceControl } from 'src/services/pop/maintenanceControl.service';
import type { MaintenanceControlDetail } from 'src/schemas/pop/maintenanceControl.schemas';

const route = useRoute();
const data = ref<MaintenanceControlDetail | null>(null);

const questions = [
  'Tempo com validade de solução',
  'Vazamentos/Infiltrações',
  'Descascamentos',
];

function formatDate(dateStr: string): string {
  try {
    const parsed = parse(dateStr, 'dd/MM/yyyy', new Date());
    return format(parsed, 'dd/MM/yyyy');
  } catch {
    return dateStr;
  }
}

function formatBool(val: boolean | null | undefined): string {
  if (val === true) return 'SIM';
  if (val === false) return 'NÃO';
  return 'NA';
}

onMounted(async () => {
  const id = Number(route.params.id);
  data.value = await getMaintenanceControl(id);
  setTimeout(() => window.print(), 800);
});
</script>

<style>
.pop-print { font-family: Arial, sans-serif; font-size: 10pt; padding: 20px; max-width: 210mm; margin: 0 auto; }
.form-header { display: flex; border: 1px solid #000; }
.company { padding: 8px; border-right: 1px solid #000; font-weight: bold; white-space: nowrap; writing-mode: vertical-rl; text-align: center; }
.form-title-block { flex: 1; padding: 8px; text-align: center; border-right: 1px solid #000; }
.form-title { font-weight: bold; font-size: 10pt; }
.form-subtitle { font-size: 9pt; margin-top: 4px; }
.version-block { padding: 8px; text-align: center; font-size: 9pt; }
.data-table { width: 100%; border-collapse: collapse; border: 1px solid #000; border-top: none; }
.data-table th, .data-table td { border: 1px solid #000; padding: 4px 6px; }
.data-table th { background: #f0f0f0; font-weight: bold; text-align: center; }
.text-center { text-align: center; }
.loading { padding: 20px; text-align: center; }
@media print {
  .pop-print { padding: 0; margin: 0; max-width: 100%; }
  @page { margin: 15mm; }
}
</style>
