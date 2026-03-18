<template>
  <div class="pop-print" v-if="data">
    <div class="form-header">
      <div class="company">Agro Mix Rações</div>
      <div class="form-title-block">
        <div class="form-title">PLANILHA DE CONTROLE DE RECEBIMENTO DE MATÉRIAS PRIMAS E INGREDIENTES - PL 01</div>
        <div class="form-subtitle">Versão: 04</div>
        <div class="form-subtitle">FREQUÊNCIA: A cada recebimento de Matéria-Prima e Ingrediente.</div>
      </div>
      <div class="version-block">
        <div>Versão: 04</div>
        <div>ANO: 2026</div>
      </div>
    </div>
    <table class="main-table">
      <thead>
        <tr>
          <th>Fornecedor</th>
          <th>Produto</th>
          <th>Data do Recebimento</th>
          <th>Lote</th>
          <th>Peso (kg)</th>
          <th>Data de Validade</th>
          <th>Integridade da(s) embalagem(ns) C/NC</th>
          <th>Condições físicas do(s) produto(s) C/NC</th>
          <th>Informações do rótulo C/NC</th>
          <th>Condições higiênicas do transporte C/NC</th>
          <th>Nº NF</th>
          <th>Executor</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ data.supplier }}</td>
          <td>{{ data.product }}</td>
          <td>{{ data.receiving_date }}</td>
          <td>{{ data.batch_number }}</td>
          <td>{{ data.weight }}</td>
          <td>{{ data.expiration_date }}</td>
          <td class="answer-cell">{{ formatBoolCNC(data.question1) }}</td>
          <td class="answer-cell">{{ formatBoolCNC(data.question2) }}</td>
          <td class="answer-cell">{{ formatBoolCNC(data.question3) }}</td>
          <td class="answer-cell">{{ formatBoolCNC(data.question4) }}</td>
          <td>{{ data.invoice }}</td>
          <td>{{ data.performed_by }}</td>
        </tr>
      </tbody>
    </table>
    <div class="form-footer">
      <div class="footer-field"><strong>DATA:</strong> {{ data.receiving_date }}</div>
    </div>
  </div>
  <div v-else class="loading">Carregando...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getMaterialReceiving } from 'src/services/pop/materialReceiving.service';
import type { MaterialReceivingDetail } from 'src/schemas/pop/materialReceiving.schemas';

const route = useRoute();
const data = ref<MaterialReceivingDetail | null>(null);

function formatBoolCNC(val: boolean | null | undefined): string {
  if (val === true) return 'C';
  if (val === false) return 'NC';
  return '-';
}

onMounted(async () => {
  const id = Number(route.params.id);
  data.value = await getMaterialReceiving(id);
  setTimeout(() => window.print(), 800);
});
</script>

<style>
.pop-print { font-family: Arial, sans-serif; font-size: 9pt; padding: 20px; max-width: 297mm; margin: 0 auto; }
.form-header { display: flex; border: 1px solid #000; margin-bottom: 0; }
.company { padding: 8px; border-right: 1px solid #000; font-weight: bold; white-space: nowrap; writing-mode: vertical-rl; text-align: center; }
.form-title-block { flex: 1; padding: 8px; text-align: center; border-right: 1px solid #000; }
.form-title { font-weight: bold; font-size: 10pt; text-transform: uppercase; }
.form-subtitle { font-size: 8pt; margin-top: 2px; }
.version-block { padding: 8px; text-align: center; font-size: 9pt; }
.main-table { width: 100%; border-collapse: collapse; border: 1px solid #000; border-top: none; }
.main-table th, .main-table td { border: 1px solid #000; padding: 4px 6px; font-size: 8pt; }
.main-table th { background: #f0f0f0; font-weight: bold; text-align: center; }
.answer-cell { text-align: center; }
.form-footer { margin-top: 16px; border: 1px solid #000; }
.footer-field { padding: 8px; border-bottom: 1px solid #000; }
.footer-field:last-child { border-bottom: none; }
.loading { padding: 20px; text-align: center; }
@media print {
  .pop-print { padding: 0; margin: 0; max-width: 100%; }
  @page { margin: 10mm; size: A4 landscape; }
}
</style>
