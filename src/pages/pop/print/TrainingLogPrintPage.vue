<template>
  <div class="pop-print" v-if="data">
    <div class="form-header">
      <div class="company">Agro Mix Rações</div>
      <div class="form-title-block">
        <div class="form-title">FORMULÁRIO DE REGISTRO DE TREINAMENTO</div>
      </div>
      <div class="version-block">
        <div>Versão: 04</div>
        <div>ANO: 2026</div>
      </div>
    </div>
    <table class="main-table">
      <thead>
        <tr>
          <th class="num-col">Nº</th>
          <th>Nome do Funcionário</th>
          <th class="answer-col">Presente</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="num-col">1</td>
          <td>{{ data.employee_name }}</td>
          <td class="answer-cell">{{ data.is_present ? 'SIM' : 'NÃO' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else class="loading">Carregando...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getTrainingLog } from 'src/services/pop/trainingLog.service';
import type { TrainingLogDetail } from 'src/schemas/pop/trainingLog.schemas';

const route = useRoute();
const data = ref<TrainingLogDetail | null>(null);

onMounted(async () => {
  const id = Number(route.params.id);
  data.value = await getTrainingLog(id);
  setTimeout(() => window.print(), 800);
});
</script>

<style>
.pop-print { font-family: Arial, sans-serif; font-size: 10pt; padding: 20px; max-width: 210mm; margin: 0 auto; }
.form-header { display: flex; border: 1px solid #000; }
.company { padding: 8px; border-right: 1px solid #000; font-weight: bold; white-space: nowrap; writing-mode: vertical-rl; text-align: center; }
.form-title-block { flex: 1; padding: 8px; text-align: center; border-right: 1px solid #000; }
.form-title { font-weight: bold; font-size: 10pt; text-transform: uppercase; }
.version-block { padding: 8px; text-align: center; font-size: 9pt; }
.main-table { width: 100%; border-collapse: collapse; border: 1px solid #000; border-top: none; }
.main-table th, .main-table td { border: 1px solid #000; padding: 6px 8px; }
.main-table th { background: #f0f0f0; font-weight: bold; text-align: center; }
.num-col { width: 50px; text-align: center; }
.answer-col { width: 100px; text-align: center; }
.answer-cell { text-align: center; }
.loading { padding: 20px; text-align: center; }
@media print {
  .pop-print { padding: 0; margin: 0; max-width: 100%; }
  @page { margin: 15mm; }
}
</style>
