<template>
  <div class="pop-print" v-if="data">
    <div class="form-header">
      <div class="company">Agro Mix Rações</div>
      <div class="form-title-block">
        <div class="form-title">Check-List - Controle das Condições de Saúde e Higiene dos Funcionários</div>
      </div>
      <div class="version-block">
        <div>Revisão: 03</div>
        <div>Ano: 2025</div>
      </div>
    </div>
    <div class="form-fields">
      <div class="field-row">
        <span><strong>Mês/Ano:</strong> {{ formatMonthYear(data.execution_date) }}</span>
      </div>
    </div>
    <table class="conditions-table">
      <thead>
        <tr>
          <th class="condition-col">HIGIENE PESSOAL</th>
          <th class="answer-col">Sim</th>
          <th class="answer-col">Não</th>
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
  </div>
  <div v-else class="loading">Carregando...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { parse, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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

function getQValue(num: number): boolean | null | undefined {
  return (data.value as any)?.[`question${num}`];
}

function formatMonthYear(dateStr: string): string {
  try {
    // execution_date comes back as DD/MM/YYYY from the service
    const parsed = parse(dateStr, 'dd/MM/yyyy', new Date());
    return format(parsed, 'MM/yyyy', { locale: ptBR });
  } catch {
    return dateStr;
  }
}

onMounted(async () => {
  const id = Number(route.params.id);
  data.value = await getSanitationControl(id);
  setTimeout(() => window.print(), 800);
});
</script>

<style>
.pop-print { font-family: Arial, sans-serif; font-size: 10pt; padding: 20px; max-width: 210mm; margin: 0 auto; }
.form-header { display: flex; border: 1px solid #000; }
.company { padding: 8px; border-right: 1px solid #000; font-weight: bold; white-space: nowrap; writing-mode: vertical-rl; text-align: center; }
.form-title-block { flex: 1; padding: 8px; text-align: center; border-right: 1px solid #000; }
.form-title { font-weight: bold; font-size: 10pt; }
.version-block { padding: 8px; text-align: center; font-size: 9pt; }
.form-fields { border: 1px solid #000; border-top: none; padding: 8px; }
.field-row { display: flex; justify-content: space-between; margin-bottom: 4px; padding-bottom: 4px; }
.conditions-table { width: 100%; border-collapse: collapse; border: 1px solid #000; border-top: none; }
.conditions-table th, .conditions-table td { border: 1px solid #000; padding: 3px 6px; }
.condition-col { width: 80%; text-align: center; font-weight: bold; background: #f0f0f0; }
.answer-col { width: 10%; text-align: center; font-weight: bold; background: #f0f0f0; }
.condition-text { font-size: 9pt; }
.answer-cell { text-align: center; font-size: 10pt; }
.loading { padding: 20px; text-align: center; }
@media print {
  .pop-print { padding: 0; margin: 0; max-width: 100%; }
  @page { margin: 15mm; }
}
</style>
