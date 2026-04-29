<template>
  <div class="pop-print" v-if="data">
    <div class="form-header">
      <div class="header-main">
        <div class="logo-block">
          <img src="/agromix-logo.png" alt="Agro Mix Rações" class="logo-img" />
        </div>
        <div class="header-right">
          <div class="form-title-block">
            <div class="form-title">CHECK-LIST DE AVALIAÇÃO DA EFICIÊNCIA DE LIMPEZA E HIGIENIZAÇÃO</div>
          </div>
          <div class="date-version-block">
            <div class="date-cell"><strong>DIA/MÊS/ANO:</strong> {{ data.execution_date }}</div>
            <div class="version-cell">Versão: 04</div>
          </div>
        </div>
      </div>
      <div class="executor-row"><strong>EXECUTOR:</strong> {{ (data as any).executor ?? '' }}</div>
    </div>
    <table class="conditions-table" style="margin-top: 8px;">
      <thead>
        <tr>
          <th class="condition-col">ITENS</th>
          <th class="answer-col">SIM</th>
          <th class="answer-col">NÃO</th>
          <th class="action-col">AÇÃO CORRETIVA</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(q, i) in questions" :key="i">
          <td class="condition-text">{{ q }}</td>
          <td class="answer-cell">{{ getQValue(i + 1) === true ? 'X' : '' }}</td>
          <td class="answer-cell">{{ getQValue(i + 1) === false ? 'X' : '' }}</td>
          <td class="action-cell"></td>
        </tr>
      </tbody>
    </table>
    <div class="form-footer">
      <table class="footer-table">
        <tbody>
          <tr>
            <th class="footer-th">MONITORADO POR:</th>
            <td class="footer-td">
              <img v-if="sigMonitoredBy" :src="sigMonitoredBy" class="sig-img" />
            </td>
          </tr>
        </tbody>
      </table>
      <table class="footer-table">
        <tbody>
          <tr>
            <th class="footer-th">VERIFICADO POR:</th>
            <td class="footer-td">
              <img v-if="sigVerifiedBy" :src="sigVerifiedBy" class="sig-img" />
            </td>
          </tr>
          <tr>
            <th class="footer-th obs-th">OBSERVAÇÕES:</th>
            <td class="footer-td footer-td-obs">{{ data.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-else class="loading">Carregando...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getCleaningEfficiency } from 'src/services/pop/cleaningEfficiency.service';
import { getPopSignatures } from 'src/services/pop/popSignature.service';
import type { CleaningEfficiencyDetail } from 'src/schemas/pop/cleaningEfficiency.schemas';

const route = useRoute();
const data = ref<CleaningEfficiencyDetail | null>(null);
const sigMonitoredBy = ref<string | null>(null);
const sigVerifiedBy = ref<string | null>(null);

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
  const [detail, sigs] = await Promise.all([
    getCleaningEfficiency(id),
    getPopSignatures('cleaning-efficiency', id),
  ]);
  data.value = detail;
  sigMonitoredBy.value = sigs.find((s) => s.field_name === 'monitored_by')?.url ?? null;
  sigVerifiedBy.value = sigs.find((s) => s.field_name === 'verified_by')?.url ?? null;
  const prevTitle = document.title;
  setTimeout(() => {
    document.title = '';
    window.print();
    document.title = prevTitle;
  }, 800);
});
</script>

<style>
.pop-print { font-family: Arial, sans-serif; font-size: 10pt; padding: 15mm; max-width: 210mm; margin: 0 auto; box-sizing: border-box; }

/* Header */
.form-header { border: 1px solid #000; display: flex; flex-direction: column; }
.header-main { display: flex; border-bottom: 1px solid #000; }
.logo-block { width: 20%; border-right: 1px solid #000; display: flex; align-items: center; justify-content: center; padding: 4px; flex-shrink: 0; }
.logo-img { max-width: 100%; max-height: 70px; object-fit: contain; }
.header-right { flex: 1; display: flex; flex-direction: column; }
.form-title-block { border-bottom: 1px solid #000; display: flex; align-items: center; justify-content: center; padding: 6px 10px; }
.form-title { font-weight: bold; font-size: 10pt; text-transform: uppercase; text-align: center; }
.date-version-block { display: flex; flex-direction: row; flex: 1; }
.date-cell { flex: 1; border-right: 1px solid #000; font-size: 9pt; padding: 4px 6px; display: flex; align-items: center; }
.version-cell { font-size: 9pt; padding: 4px 6px; display: flex; align-items: center; white-space: nowrap; }
.executor-row { padding: 4px 8px; font-size: 9pt; }

/* Table */
.conditions-table { width: 100%; border-collapse: collapse; border: 1px solid #000; }
.conditions-table th, .conditions-table td { border: 1px solid #000; padding: 3px 6px; }
.condition-col { width: 55%; text-align: center; font-weight: bold; background: #f0f0f0; }
.answer-col { width: 8%; text-align: center; font-weight: bold; background: #f0f0f0; }
.action-col { width: 25%; text-align: center; font-weight: bold; background: #f0f0f0; }
.condition-text { font-size: 9pt; }
.answer-cell { text-align: center; font-size: 10pt; }
.action-cell { font-size: 9pt; }

/* Footer */
.form-footer { display: flex; flex-direction: column; gap: 6px; margin-top: 6px; }
.footer-table { width: 100%; border-collapse: collapse; border: 1px solid #000; }
.footer-th { background: #f0f0f0; border: 1px solid #000; padding: 2px 8px; font-size: 9pt; font-weight: bold; text-align: left; white-space: nowrap; width: 1%; vertical-align: middle; }
.footer-td { border: 1px solid #000; padding: 2px 8px; height: 1.4em; vertical-align: middle; font-size: 9pt; }
.sig-img { max-height: 32px; max-width: 200px; object-fit: contain; display: block; }
.obs-th { vertical-align: middle; }
.footer-td-obs { height: 5em; vertical-align: top; padding: 4px 8px; }

.loading { padding: 20px; text-align: center; }
@media print {
  @page { margin: 0; size: A4; }
  html, body { margin: 0; }
  .pop-print { max-width: 100%; }
}
</style>
