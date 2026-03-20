<template>
  <div class="pop-print" v-if="data">
    <div class="form-header">
      <div class="logo-block">
        <img src="/agromix-logo.png" alt="Agro Mix Rações" class="logo-img" />
      </div>
      <div class="form-title-block">
        <div class="form-title">CHECK-LIST – INSPEÇÃO DE CARGA E DO CONTROLE DAS CONDIÇÕES FÍSICAS E HIGIÊNICO-SANITÁRIAS DOS VEÍCULOS</div>
      </div>
      <div class="version-block">
        <div class="version-row">Versão: 04</div>
        <div class="year-row">ANO: 2026</div>
      </div>
    </div>
    <div class="form-fields">
      <div class="field-row">
        <div class="field field-large"><strong>MOTORISTA:</strong><span class="field-value">{{ data.driver }}</span></div>
        <div class="field field-small"><strong>DATA:</strong><span class="field-value">{{ formatDate(data.created_at) }}</span></div>
      </div>
      <div class="field-row">
        <div class="field field-medium"><strong>PLACA:</strong><span class="field-value">{{ data.license_plate }}</span></div>
        <div class="field field-medium"><strong>NOTA FISCAL:</strong><span class="field-value">{{ data.invoice }}</span></div>
      </div>
      <div class="field-row">
        <div class="field field-large"><strong>PRODUTO:</strong><span class="field-value">{{ data.product }}</span></div>
        <div class="checkboxes">
          <span class="checkbox">{{ data.inbound ? '☑' : '☐' }}</span> RECEBIMENTO
          <span class="checkbox">{{ data.outbound ? '☑' : '☐' }}</span> EXPEDIÇÃO
        </div>
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
    <div class="na-note"><strong>NA</strong>: Não se aplica.</div>
    <div class="form-footer">
      <table class="footer-table">
        <tbody>
          <tr>
            <th class="footer-th">MONITORADO POR:</th>
            <td class="footer-td">{{ data.monitored_by }}</td>
          </tr>
        </tbody>
      </table>
      <table class="footer-table">
        <tbody>
          <tr>
            <th class="footer-th">VERIFICADO POR:</th>
            <td class="footer-td">{{ data.verified_by }}</td>
          </tr>
          <tr>
            <th class="footer-th">OBSERVAÇÕES:</th>
            <td class="footer-td footer-td-tall">{{ data.note }}</td>
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
.form-header { display: flex; border: 1px solid #000; min-height: 60px; }
.logo-block { width: 25%; border-right: 1px solid #000; display: flex; align-items: center; justify-content: center; padding: 4px; }
.logo-img { max-width: 100%; max-height: 70px; object-fit: contain; }
.form-title-block { flex: 1; border-right: 1px solid #000; display: flex; align-items: center; justify-content: center; padding: 6px 10px; }
.form-title { font-weight: bold; font-size: 10pt; text-transform: uppercase; text-align: center; }
.version-block { display: flex; flex-direction: column; min-width: 75px; }
.version-row { font-weight: bold; font-size: 9pt; border-bottom: 1px solid #000; padding: 1px 6px; line-height: 1.2; white-space: nowrap; }
.year-row { flex: 1; font-weight: bold; font-size: 9pt; padding: 0 6px; display: flex; align-items: center; white-space: nowrap; }
.form-fields { padding: 4px 0; }
.field-row { display: flex; align-items: flex-end; gap: 8px; margin-bottom: 3px; }
.field { display: flex; align-items: flex-end; gap: 4px; }
.field-large { flex: 3; }
.field-medium { flex: 1; }
.field-small { flex: 1; }
.field-value { flex: 1; border-bottom: 1px solid #000; min-width: 30px; padding-bottom: 1px; display: inline-block; }
.checkboxes { display: flex; align-items: center; gap: 6px; white-space: nowrap; font-size: 9pt; padding-bottom: 1px; }
.conditions-table { width: 100%; border-collapse: collapse; margin-top: 4px; border: 1px solid #000; }
.conditions-table th, .conditions-table td { border: 1px solid #000; padding: 3px 6px; }
.condition-col { width: 70%; text-align: center; font-weight: bold; background: #f0f0f0; }
.answer-col { width: 10%; text-align: center; font-weight: bold; background: #f0f0f0; }
.condition-text { font-size: 9pt; }
.answer-cell { text-align: center; font-size: 10pt; }
.na-note { font-size: 8pt; text-align: right; margin-top: 2px; }
.form-footer { display: flex; flex-direction: column; gap: 6px; margin-top: 6px; }
.footer-table { width: 100%; border-collapse: collapse; border: 1px solid #000; }
.footer-th { background: #f0f0f0; border: 1px solid #000; padding: 2px 8px; font-size: 9pt; font-weight: bold; text-align: left; white-space: nowrap; width: 1%; vertical-align: middle; }
.footer-td { border: 1px solid #000; padding: 2px 8px; height: 1.4em; vertical-align: middle; font-size: 9pt; text-align: left; }
.footer-td-tall { height: 2.8em; }
.loading { padding: 20px; text-align: center; }
@media print {
  @page { margin: 0; size: A4; }
  html, body { margin: 0; }
  .pop-print { max-width: 100%; }
}
</style>
