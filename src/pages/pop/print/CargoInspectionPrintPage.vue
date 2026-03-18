<template>
  <div class="pop-print" v-if="data">
    <div class="form-header">
      <div class="company">Agro Mix Rações</div>
      <div class="form-title-block">
        <div class="form-title">CHECK-LIST – INSPEÇÃO DE CARGA E DO CONTROLE DAS CONDIÇÕES FÍSICAS E HIGIÊNICO-SANITÁRIAS DOS VEÍCULOS</div>
      </div>
      <div class="version-block">
        <div>Versão: 04</div>
        <div>ANO: 2026</div>
      </div>
    </div>
    <div class="form-fields">
      <div class="field-row">
        <span><strong>MOTORISTA:</strong> {{ data.driver }}</span>
        <span><strong>DATA:</strong> {{ formatDate(data.created_at) }}</span>
      </div>
      <div class="field-row">
        <span><strong>PLACA:</strong> {{ data.license_plate }}</span>
        <span><strong>NOTA FISCAL:</strong> {{ data.invoice }}</span>
      </div>
      <div class="field-row">
        <span><strong>PRODUTO:</strong> {{ data.product }}</span>
        <span>
          <span class="checkbox">{{ data.inbound ? '☑' : '☐' }}</span> RECEBIMENTO &nbsp;
          <span class="checkbox">{{ data.outbound ? '☑' : '☐' }}</span> EXPEDIÇÃO
        </span>
      </div>
    </div>
    <table class="conditions-table">
      <thead>
        <tr>
          <th class="condition-col">CONDIÇÕES</th>
          <th class="answer-col">SIM</th>
          <th class="answer-col">NÃO</th>
          <th class="answer-col">NA</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(q, i) in questions" :key="i">
          <td class="condition-text">{{ q }}</td>
          <td class="answer-cell">{{ getQValue(i + 1) === true ? 'X' : '' }}</td>
          <td class="answer-cell">{{ getQValue(i + 1) === false ? 'X' : '' }}</td>
          <td class="answer-cell">{{ getQValue(i + 1) === null ? 'X' : '' }}</td>
        </tr>
      </tbody>
    </table>
    <div class="na-note">NA: Não se aplica.</div>
    <div class="form-footer">
      <div class="footer-field"><strong>MONITORADO POR:</strong> {{ data.monitored_by }}</div>
      <div class="footer-field"><strong>VERIFICADO POR:</strong> {{ data.verified_by }}</div>
      <div class="footer-field observacoes"><strong>OBSERVAÇÕES:</strong> {{ data.note }}</div>
    </div>
  </div>
  <div v-else class="loading">Carregando...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getCargoInspection } from 'src/services/pop/cargoInspection.service';
import type { CargoInspectionDetail } from 'src/schemas/pop/cargoInspection.schemas';

const route = useRoute();
const data = ref<CargoInspectionDetail | null>(null);

const questions = [
  'O veículo está com parte interna limpa, livre de pó, poeira, vestígios de pragas e resíduos de cargas anteriores?',
  'O veículo está em bom estado de conservação? *Verificar tanto a parte externa como internamente.*',
  'O veículo está sem furos, frestas, goteiras ou pontos de umidade internamente?',
  'O veículo está livre de odores fortes e/ou estranhos?',
  'O piso do veículo encontra-se limpo, é forrado com lona ou o produto está sobre paletes?',
  'Houve transporte de cargas anteriores? Se sim, escrever as três últimas:',
  'Há transporte de materiais tóxicos ou produtos químicos juntos com alimento e/ou embalagens?',
  'A lona está limpa, tem boa espessura e é resistente?',
  'Foi colocado forro plástico no lastro do caminhão?',
  'Em caso de caminhão aberto, a lona é suficiente para cobertura total da carga e do lastro?',
  'A carga está sem avarias?',
  'A carga está sem sinais de infestação por pragas ou sinais visíveis de ocorrência destes?',
  'Os paletes utilizados estão em bom estado de conservação, limpos e secos?',
  'O lote do produto e as quantidades conferem com os dados descritos na NF?',
  'As matérias-primas são recebidas com a identificação de número de lote, data de fabricação e validade?',
  'Matéria prima ensacada devidamente rotulada?',
  'Matéria prima a granel, rótulo anexada a NF?',
  'Rotulagem com letras legíveis?',
  'As embalagens estão íntegras e sem sinais de fraude?',
];

function getQValue(num: number): boolean | null | undefined {
  return (data.value as any)?.[`question${num}`];
}

function formatDate(dateStr: string) {
  try {
    return format(new Date(dateStr), 'dd/MM/yyyy', { locale: ptBR });
  } catch {
    return dateStr;
  }
}

onMounted(async () => {
  const id = Number(route.params.id);
  data.value = await getCargoInspection(id);
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
.field-row { display: flex; justify-content: space-between; margin-bottom: 4px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
.conditions-table { width: 100%; border-collapse: collapse; margin-top: 0; border: 1px solid #000; border-top: none; }
.conditions-table th, .conditions-table td { border: 1px solid #000; padding: 3px 6px; }
.condition-col { width: 70%; text-align: center; font-weight: bold; background: #f0f0f0; }
.answer-col { width: 10%; text-align: center; font-weight: bold; background: #f0f0f0; }
.condition-text { font-size: 9pt; }
.answer-cell { text-align: center; font-size: 10pt; }
.na-note { font-size: 8pt; text-align: right; margin-top: 2px; }
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
