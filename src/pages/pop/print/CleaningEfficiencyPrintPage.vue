<template>
  <div class="pop-print" v-if="data">
    <div class="form-header">
      <div class="company">Agro Mix Rações</div>
      <div class="form-title-block">
        <div class="form-title">CHECK-LIST DE AVALIAÇÃO DA EFICIÊNCIA DE LIMPEZA E HIGIENIZAÇÃO</div>
      </div>
      <div class="version-block">
        <div>Versão: 04</div>
        <div>ANO: 2026</div>
      </div>
    </div>
    <div class="form-fields">
      <div class="field-row">
        <span><strong>DIA/MÊS/ANO:</strong> {{ data.execution_date }}</span>
      </div>
    </div>
    <table class="conditions-table">
      <thead>
        <tr>
          <th class="condition-col">CONDIÇÕES</th>
          <th class="answer-col">SIM</th>
          <th class="answer-col">NÃO</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(q, i) in questions" :key="i">
          <td class="condition-text">{{ q }}</td>
          <td class="answer-cell">{{ getQValue(i + 1) === true ? 'X' : '' }}</td>
          <td class="answer-cell">{{ getQValue(i + 1) === false ? 'X' : '' }}</td>
        </tr>
      </tbody>
    </table>
    <div class="form-footer">
      <div class="footer-field"><strong>MONITORADO POR:</strong></div>
      <div class="footer-field"><strong>VERIFICADO POR:</strong></div>
      <div class="footer-field observacoes"><strong>OBSERVAÇÕES:</strong> {{ data.note }}</div>
    </div>
  </div>
  <div v-else class="loading">Carregando...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getCleaningEfficiency } from 'src/services/pop/cleaningEfficiency.service';
import type { CleaningEfficiencyDetail } from 'src/schemas/pop/cleaningEfficiency.schemas';

const route = useRoute();
const data = ref<CleaningEfficiencyDetail | null>(null);

const questions = [
  'Os produtos de higienização/desinfecção são aprovados pelos órgãos competentes (ANVISA ou Vigilância Sanitária)?',
  'Os detergentes estão disponíveis em quantidade suficiente para realização dos procedimentos de limpeza e sanificação?',
  'Os produtos de higienização contém substâncias odorizantes e/ou desodorizantes em suas formulações?',
  'Produtos de limpeza e higienização estão identificados e guardados em local adequado?',
  'Os utensílios (esponja, vassouras, rodos, etc) estão disponíveis e em bom estado de conservação para a realização da operação?',
  'A diluição dos produtos de higienização, tempo de contato e modo de uso/aplicação obedece às instruções recomendadas?',
  'Os encarregados pela limpeza e higienização utilizam os EPIs necessários para realização da operação?',
  'A área de processamento, equipamentos e utensílios são limpos de acordo com escala de periodicidade de limpeza/higienização?',
  'As instalações são providas de água fria em quantidade suficiente?',
  'Os paletes encontram-se limpos e em bom estado de conservação?',
  'Os banheiros e vestiários encontra-se em bom estado de conservação, limpos e organizados?',
  'Os lavatórios estão em bom estado de conservação e dotados de sabonete antisséptico ou inodoro, papel toalha e lixeiras?',
];

function getQValue(num: number): boolean | null | undefined {
  return (data.value as any)?.[`question${num}`];
}

onMounted(async () => {
  const id = Number(route.params.id);
  data.value = await getCleaningEfficiency(id);
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
.form-fields { border: 1px solid #000; border-top: none; padding: 8px; }
.field-row { display: flex; justify-content: space-between; margin-bottom: 4px; padding-bottom: 4px; }
.conditions-table { width: 100%; border-collapse: collapse; border: 1px solid #000; border-top: none; }
.conditions-table th, .conditions-table td { border: 1px solid #000; padding: 3px 6px; }
.condition-col { width: 80%; text-align: center; font-weight: bold; background: #f0f0f0; }
.answer-col { width: 10%; text-align: center; font-weight: bold; background: #f0f0f0; }
.condition-text { font-size: 9pt; }
.answer-cell { text-align: center; font-size: 10pt; }
.form-footer { margin-top: 16px; border: 1px solid #000; }
.footer-field { border-bottom: 1px solid #000; padding: 8px; min-height: 40px; }
.footer-field:last-child { border-bottom: none; }
.observacoes { min-height: 60px; }
.loading { padding: 20px; text-align: center; }
@media print {
  .pop-print { padding: 0; margin: 0; max-width: 100%; }
  @page { margin: 15mm; }
}
</style>
