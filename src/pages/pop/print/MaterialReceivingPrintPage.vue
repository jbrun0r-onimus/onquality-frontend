<template>
  <div class="pop-print" v-if="data">

    <!-- ─── Header ────────────────────────────────────────────────────────── -->
    <table class="header-table">
      <tbody>
        <tr>
          <!-- Logo (spans 2 rows) -->
          <td class="header-logo" rowspan="2">
            <img src="/agromix-logo.png" alt="Agromix" class="logo-img" />
          </td>
          <!-- Title (spans 2 columns) -->
          <td class="header-title" colspan="2">
            PLANILHA DE CONTROLE DE RECEBIMENTO DE MATÉRIAS PRIMAS E INGREDIENTES
          </td>
        </tr>
        <tr>
          <!-- Year -->
          <td class="header-year">{{ currentYear }}</td>
          <!-- Code / Version -->
          <td class="header-version">PL 01<br />Versão: 04</td>
        </tr>
        <tr>
          <!-- Frequency (spans all 3 columns) -->
          <td class="header-freq" colspan="3">
            FREQUÊNCIA: A cada recebimento de Matéria-Prima e Ingrediente
          </td>
        </tr>
      </tbody>
    </table>

    <!-- ─── Main Data Table ────────────────────────────────────────────────── -->
    <table class="main-table">
      <thead>
        <tr>
          <th>Fornecedor</th>
          <th>Produto</th>
          <th>Data do<br />Recebimento</th>
          <th>Lote</th>
          <th>Peso<br />(Kg)</th>
          <th>Data de<br />Validade</th>
          <th>Integridade da(s)<br />embalagem(ns)</th>
          <th>Condições físicas<br />do(s) produto(s)</th>
          <th>Informações<br />do rótulo</th>
          <th>Condições higiênicas<br />do transporte</th>
          <th>N° NF</th>
          <th>Executor</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ data.supplier }}</td>
          <td>{{ data.product }}</td>
          <td class="center">{{ data.receiving_date }}</td>
          <td class="center">{{ data.batch_number }}</td>
          <td class="center">{{ data.weight }}</td>
          <td class="center">{{ data.expiration_date }}</td>
          <td class="center">{{ formatBoolCNC(data.question1) }}</td>
          <td class="center">{{ formatBoolCNC(data.question2) }}</td>
          <td class="center">{{ formatBoolCNC(data.question3) }}</td>
          <td class="center">{{ formatBoolCNC(data.question4) }}</td>
          <td class="center">{{ data.invoice }}</td>
          <td>{{ data.performed_by }}</td>
        </tr>
        <!-- blank rows for future entries on same sheet -->
        <tr v-for="i in 8" :key="i"><td v-for="j in 12" :key="j">&nbsp;</td></tr>
      </tbody>
    </table>

    <!-- ─── Corrective Actions Table ───────────────────────────────────────── -->
    <table class="secondary-table">
      <thead>
        <tr>
          <th class="col-date">DATA</th>
          <th>AÇÃO CORRETIVA</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="col-date">&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
      </tbody>
    </table>

    <!-- ─── Monitored By ───────────────────────────────────────────────────── -->
    <table class="signature-table">
      <tbody>
        <tr>
          <td class="sig-label">MONITORADO POR:</td>
          <td class="sig-line">
            <img v-if="sigMonitoredBy" :src="sigMonitoredBy" class="sig-img" />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- ─── Verified By ────────────────────────────────────────────────────── -->
    <table class="signature-table">
      <tbody>
        <tr>
          <td class="sig-label">VERIFICADO POR:</td>
          <td class="sig-line">
            <img v-if="sigVerifiedBy" :src="sigVerifiedBy" class="sig-img" />
          </td>
        </tr>
      </tbody>
    </table>

  </div>
  <div v-else class="loading">Carregando…</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getMaterialReceiving } from 'src/services/pop/materialReceiving.service';
import { getPopSignatures } from 'src/services/pop/popSignature.service';
import type { MaterialReceivingDetail } from 'src/schemas/pop/materialReceiving.schemas';

const route = useRoute();
const data = ref<MaterialReceivingDetail | null>(null);
const sigMonitoredBy = ref<string | null>(null);
const sigVerifiedBy = ref<string | null>(null);
const currentYear = new Date().getFullYear();

function formatBoolCNC(val: boolean | null | undefined): string {
  if (val === true) return 'C';
  if (val === false) return 'NC';
  return '-';
}

onMounted(async () => {
  const id = Number(route.params.id);
  const [detail, sigs] = await Promise.all([
    getMaterialReceiving(id),
    getPopSignatures('material-receiving', id),
  ]);
  data.value = detail;
  sigMonitoredBy.value = sigs.find((s) => s.field_name === 'monitored_by')?.url ?? null;
  sigVerifiedBy.value = sigs.find((s) => s.field_name === 'verified_by')?.url ?? null;
  setTimeout(() => window.print(), 800);
});
</script>

<style>
/* ─── Reset & Base ─────────────────────────────────────────────────────────── */
.pop-print {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 8pt;
  color: #000;
  padding: 8mm;
  box-sizing: border-box;
}

/* ─── Header Table ─────────────────────────────────────────────────────────── */
.header-table {
  width: 100%;
  border-collapse: collapse;
  border: 1.5px solid #000;
  margin-bottom: 0;
}

.header-table td {
  border: 1px solid #000;
  padding: 4px 8px;
  vertical-align: middle;
  font-weight: bold;
}

.header-logo {
  width: 90px;
  text-align: center;
  padding: 4px !important;
}

.logo-img {
  max-width: 80px;
  max-height: 52px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}

.header-title {
  text-align: center;
  font-size: 9.5pt;
  text-transform: uppercase;
  letter-spacing: 0.2px;
}

.header-year {
  text-align: center;
  font-size: 8.5pt;
  width: 70px;
}

.header-version {
  text-align: center;
  font-size: 8.5pt;
  width: 100px;
  line-height: 1.5;
}

.header-freq {
  text-align: center;
  font-size: 8pt;
}

/* ─── Main Table ───────────────────────────────────────────────────────────── */
.main-table {
  width: 100%;
  border-collapse: collapse;
  border: 1.5px solid #000;
  margin-top: 6px;
  margin-bottom: 0;
}

.main-table th,
.main-table td {
  border: 1px solid #000;
  padding: 3px 4px;
  font-size: 7.5pt;
  vertical-align: middle;
}

.main-table th {
  background: #e8e8e8;
  font-weight: bold;
  text-align: center;
  line-height: 1.3;
}

.main-table td {
  height: 16px;
}

.main-table td.center {
  text-align: center;
}

/* ─── Secondary (Corrective Actions) Table ─────────────────────────────────── */
.secondary-table {
  width: 100%;
  border-collapse: collapse;
  border: 1.5px solid #000;
  margin-top: 6px;
  margin-bottom: 0;
}

.secondary-table th,
.secondary-table td {
  border: 1px solid #000;
  padding: 3px 6px;
  font-size: 7.5pt;
}

.secondary-table th {
  background: #e8e8e8;
  font-weight: bold;
  text-align: center;
}

.secondary-table td {
  height: 16px;
}

.col-date {
  width: 80px;
  text-align: center;
}

/* ─── Signature Tables ─────────────────────────────────────────────────────── */
.signature-table {
  width: 100%;
  border-collapse: collapse;
  border: 1.5px solid #000;
  margin-top: 6px;
  margin-bottom: 0;
}

.signature-table td {
  border: 1px solid #000;
  padding: 4px 6px;
  height: 20px;
  font-size: 7.5pt;
}

.sig-label {
  white-space: nowrap;
  font-weight: bold;
  width: 130px;
  background: #e8e8e8;
}

.sig-line {
  min-width: 80px;
}

.sig-img {
  max-height: 32px;
  max-width: 200px;
  object-fit: contain;
  display: block;
}

/* ─── Loading ──────────────────────────────────────────────────────────────── */
.loading {
  padding: 40px;
  text-align: center;
  font-family: Arial, sans-serif;
}

/* ─── Print ────────────────────────────────────────────────────────────────── */
@media print {
  @page {
    size: A4 landscape;
    margin: 8mm;
  }

  .pop-print {
    padding: 0;
    margin: 0;
  }
}
</style>
