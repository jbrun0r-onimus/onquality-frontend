<template>
  <div class="pop-print" v-if="data">
    <div class="form-header">
      <div class="logo-block">
        <img src="/agromix-logo.png" alt="Agro Mix Rações" class="logo-img" />
      </div>
      <div class="form-title-block">
        <div class="form-title">CHECK-LIST – CONTROLE DAS CONDIÇÕES DE SAÚDE E HIGIENE DOS FUNCIONÁRIOS</div>
      </div>
      <div class="version-block">
        <div class="version-row">Revisão: 03</div>
        <div class="year-row">ANO: {{ executionYear }}</div>
      </div>
    </div>
    <div class="month-year-row">
      <strong>Mês/Ano:</strong> {{ executionMonth }}/{{ executionYear }}
    </div>
    <table class="conditions-table">
      <thead>
        <tr>
          <th class="condition-col" rowspan="2">HIGIENE PESSOAL</th>
          <th class="semana-col" colspan="2">Semana 1</th>
          <th class="semana-col" colspan="2">Semana 2</th>
          <th class="semana-col" colspan="2">Semana 3</th>
          <th class="semana-col" colspan="2">Semana 4</th>
        </tr>
        <tr>
          <th class="answer-col">Sim</th><th class="answer-col">Não</th>
          <th class="answer-col">Sim</th><th class="answer-col">Não</th>
          <th class="answer-col">Sim</th><th class="answer-col">Não</th>
          <th class="answer-col">Sim</th><th class="answer-col">Não</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(q, i) in questions" :key="i">
          <td class="condition-text">{{ q }}</td>
          <td class="answer-cell">{{ weekNumber === 1 && getQValue(i + 1) === true ? 'X' : '' }}</td>
          <td class="answer-cell">{{ weekNumber === 1 && getQValue(i + 1) === false ? 'X' : '' }}</td>
          <td class="answer-cell">{{ weekNumber === 2 && getQValue(i + 1) === true ? 'X' : '' }}</td>
          <td class="answer-cell">{{ weekNumber === 2 && getQValue(i + 1) === false ? 'X' : '' }}</td>
          <td class="answer-cell">{{ weekNumber === 3 && getQValue(i + 1) === true ? 'X' : '' }}</td>
          <td class="answer-cell">{{ weekNumber === 3 && getQValue(i + 1) === false ? 'X' : '' }}</td>
          <td class="answer-cell">{{ weekNumber === 4 && getQValue(i + 1) === true ? 'X' : '' }}</td>
          <td class="answer-cell">{{ weekNumber === 4 && getQValue(i + 1) === false ? 'X' : '' }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else class="loading">Carregando...</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { parse } from 'date-fns';
import { getSanitationControl } from 'src/services/pop/sanitationControl.service';
import type { SanitationControlDetail } from 'src/schemas/pop/sanitationControl.schemas';

const route = useRoute();
const data = ref<SanitationControlDetail | null>(null);

const questions = [
  'Os uniformes dos funcionários estão limpos e em bom estado de conservação?',
  'Os calçados são adequados e limpos?',
  'Os funcionários estão devidamente barbeados?',
  'Os funcionários estão com cabelos cobertos?',
  'Os funcionários não estão utilizando adornos (pulseira, anéis, cordões, brincos, alianças, etc.)?',
  'Os funcionários sempre praticam atitudes higiênicas, como não tossir, espirrar sobre os produtos, equipamentos e instalações, não levar a mão à boca e nariz, não cuspir no ambiente, etc., evitando contaminação?',
  'Os funcionários utilizam EPIs adequados durante a manipulação e produção?',
  'Os funcionários cumprem as recomendações de lavar e sanificar as mãos e antebraços antes de entrar na área de produção?',
  'Os funcionários cumprem as normas de higiene pessoal conforme os procedimentos estabelecidos?',
  'Os funcionários não apresentam algum tipo de ferimentos ou outras lesões nas mãos, infecções ou problemas gastrointestinais?',
  'Os funcionários cumprem as recomendações de não alimentar, mascar chicletes, palitos, etc. na área de trabalho?',
  'Existem cartazes educativos para os colaboradores e visitantes nas áreas de acesso aos ambientes de processamento, vestiários e sanitários?',
  'A instalação sanitária (vasos, pias, chuveiros) está funcionando adequadamente?',
  'Há disponibilidade de sabonete líquido inodoro antisséptico, água, papel toalha não reciclado e papel higiênico na instalação sanitária?',
  'Há disponibilidade de sabão antisséptico, água, papel toalha não reciclado nos lavatórios de mãos?',
  'Os uniformes são trocados diariamente?',
  'Os funcionários não usam perfume que possa transmitir aos produtos?',
];

const MONTHS_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function parseExecutionDate(dateStr: string): Date {
  try {
    return parse(dateStr, 'dd/MM/yyyy', new Date());
  } catch {
    return new Date(dateStr);
  }
}

const executionDate = computed(() =>
  data.value ? parseExecutionDate(data.value.execution_date) : null
);

const executionMonth = computed(() =>
  executionDate.value ? MONTHS_PT[executionDate.value.getMonth()] : ''
);

const executionYear = computed(() =>
  executionDate.value ? executionDate.value.getFullYear() : ''
);

const weekNumber = computed(() => {
  if (!executionDate.value) return 0;
  const day = executionDate.value.getDate();
  if (day <= 7) return 1;
  if (day <= 14) return 2;
  if (day <= 21) return 3;
  return 4;
});

function getQValue(num: number): boolean | null | undefined {
  return (data.value as any)?.[`question${num}`];
}

onMounted(async () => {
  const id = Number(route.params.id);
  data.value = await getSanitationControl(id);
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
.version-row { font-weight: bold; font-size: 9pt; border-bottom: 1px solid #000; padding: 4px 6px; white-space: nowrap; }
.year-row { flex: 1; font-weight: bold; font-size: 9pt; padding: 0 6px; display: flex; align-items: center; white-space: nowrap; }
.month-year-row { padding: 6px 0 4px 0; font-size: 10pt; text-align: left; }
.conditions-table { width: 100%; border-collapse: collapse; border: 1px solid #000; }
.conditions-table th, .conditions-table td { border: 1px solid #000; padding: 3px 5px; }
.condition-col { width: 40%; text-align: center; font-weight: bold; background: #f0f0f0; }
.semana-col { text-align: center; font-weight: bold; background: #f0f0f0; font-size: 9pt; }
.answer-col { width: 7.5%; text-align: center; font-weight: bold; background: #f0f0f0; font-size: 9pt; }
.condition-text { font-size: 8.5pt; }
.answer-cell { text-align: center; font-size: 10pt; }
.loading { padding: 20px; text-align: center; }
@media print {
  @page { margin: 0; size: A4; }
  html, body { margin: 0; }
  .pop-print { max-width: 100%; }
}
</style>
