<template>
  <div class="pop-print" v-if="data">

    <!-- Header -->
    <table class="header-table">
      <tbody>
        <tr>
          <td class="header-logo" rowspan="2">
            <img src="/agromix-logo.png" alt="Agro Mix Rações" class="logo-img" />
          </td>
          <td class="header-title" rowspan="2">
            PLANILHA DE REGISTRO DE NÃO CONFORMIDADES
          </td>
          <td class="header-year">ANO: {{ year }}</td>
          <td class="header-code">PL- 03</td>
        </tr>
        <tr>
          <td class="header-year"></td>
          <td class="header-code">Versão: 04</td>
        </tr>
        <tr>
          <td colspan="4" class="header-freq">
            <strong>FREQUÊNCIA:</strong> A cada não conformidade detectada nos recebimentos.
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Info rows -->
    <table class="info-table">
      <tbody>
        <tr>
          <td class="info-label">Produto/<br />Fornecedor:</td>
          <td class="info-value" colspan="3">{{ productSupplier }}</td>
        </tr>
        <tr>
          <td class="info-label">Endereço:</td>
          <td class="info-value" colspan="3">{{ data.address ?? '' }}</td>
        </tr>
        <tr>
          <td class="info-label">Nº Registro MAPA:</td>
          <td class="info-value" colspan="3">{{ data.map_record ?? '' }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Main table -->
    <table class="main-table">
      <thead>
        <tr>
          <th class="col-date" rowspan="2">Data do<br />Recebimento</th>
          <th class="col-details" rowspan="2">Não conformidade detectada.</th>
          <th class="col-action" rowspan="2">Ação corretiva</th>
          <th class="col-deadline" rowspan="2">Prazo para<br />cumprimento</th>
          <th colspan="2">Reaprovado?</th>
        </tr>
        <tr>
          <th class="col-yn">SIM</th>
          <th class="col-yn">NÃO</th>
        </tr>
      </thead>
      <tbody>
        <!-- filled row -->
        <tr>
          <td class="col-date center">{{ receivingDateDisplay }}</td>
          <td class="col-details">{{ data.details ?? '' }}</td>
          <td class="col-action">{{ data.corrective_action ?? '' }}</td>
          <td class="col-deadline center">{{ data.deadline ?? '' }}</td>
          <td class="col-yn center">{{ data.is_approved === true ? 'X' : '' }}</td>
          <td class="col-yn center">{{ data.is_approved === false ? 'X' : '' }}</td>
        </tr>
        <!-- blank filler rows -->
        <tr v-for="i in 5" :key="i">
          <td class="col-date"></td>
          <td class="col-details"></td>
          <td class="col-action"></td>
          <td class="col-deadline"></td>
          <td class="col-yn"></td>
          <td class="col-yn"></td>
        </tr>
      </tbody>
    </table>

    <!-- Monitored By -->
    <table class="sig-table">
      <tbody>
        <tr>
          <td class="sig-label">MONITORADO POR:</td>
          <td class="sig-value">
            <img v-if="sigMonitoredBy" :src="sigMonitoredBy" class="sig-img" />
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Verified By + Observations -->
    <table class="sig-table sig-bottom">
      <tbody>
        <tr>
          <td class="sig-label" style="width: 50%">VERIFICADO POR:</td>
          <td class="sig-label obs-label" style="width: 50%">OBSERVAÇÕES:</td>
        </tr>
        <tr>
          <td class="sig-content">
            <img v-if="sigVerifiedBy" :src="sigVerifiedBy" class="sig-img" />
          </td>
          <td class="sig-content obs-content">{{ data.notes ?? '' }}</td>
        </tr>
      </tbody>
    </table>

  </div>
  <div v-else class="loading">Carregando…</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { format, parse } from 'date-fns';
import { getNonConformanceLog } from 'src/services/pop/nonConformanceLog.service';
import { getPopSignatures } from 'src/services/pop/popSignature.service';
import type { NonConformanceLogDetail } from 'src/schemas/pop/nonConformanceLog.schemas';

const route = useRoute();
const data = ref<NonConformanceLogDetail | null>(null);
const sigMonitoredBy = ref<string | null>(null);
const sigVerifiedBy = ref<string | null>(null);

const year = computed(() => {
  if (!data.value?.created_at) return new Date().getFullYear();
  try { return new Date(data.value.created_at).getFullYear(); } catch { return new Date().getFullYear(); }
});

const productSupplier = computed(() => {
  const parts = [data.value?.product, data.value?.supplier].filter(Boolean);
  return parts.join(' – ');
});

const receivingDateDisplay = computed(() => {
  const d = data.value?.receiving_date;
  if (!d) return '';
  try {
    // fromIsoDate already converts to dd/MM/yyyy in the service
    return d;
  } catch {
    return d;
  }
});

onMounted(async () => {
  const id = Number(route.params.id);
  const [detail, sigs] = await Promise.all([
    getNonConformanceLog(id),
    getPopSignatures('non-conformance-log', id),
  ]);
  data.value = detail;
  sigMonitoredBy.value = sigs.find((s) => s.field_name === 'monitored_by')?.url ?? null;
  sigVerifiedBy.value = sigs.find((s) => s.field_name === 'verified_by')?.url ?? null;
  setTimeout(() => window.print(), 800);
});
</script>

<style>
* { box-sizing: border-box; }
body { margin: 0; padding: 0; }

.pop-print {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 9pt;
  color: #000;
  padding: 10mm;
  max-width: 210mm;
  margin: 0 auto;
}

/* Header */
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
  font-size: 10pt;
  font-weight: bold;
  text-transform: uppercase;
}

.header-year {
  text-align: center;
  font-size: 9pt;
  font-weight: bold;
  width: 90px;
}

.header-code {
  text-align: center;
  font-size: 9pt;
  font-weight: bold;
  width: 90px;
}

.header-freq {
  font-size: 9pt;
  padding: 4px 8px;
}

/* Info table */
.info-table {
  width: 100%;
  border-collapse: collapse;
  border: 1.5px solid #000;
  border-top: none;
  margin-bottom: 0;
}

.info-table td {
  border: 1px solid #000;
  padding: 4px 8px;
  font-size: 9pt;
  vertical-align: middle;
  height: 22px;
}

.info-label {
  font-weight: bold;
  width: 130px;
  background: #f0f0f0;
  white-space: nowrap;
}

.info-value {
  min-width: 200px;
}

/* Main table */
.main-table {
  width: 100%;
  border-collapse: collapse;
  border: 1.5px solid #000;
  border-top: none;
  margin-bottom: 8px;
  font-size: 9pt;
}

.main-table th,
.main-table td {
  border: 1px solid #000;
  padding: 4px 6px;
  vertical-align: middle;
}

.main-table thead th {
  background: #e0e0e0;
  font-weight: bold;
  text-align: center;
  font-size: 8.5pt;
}

.main-table tbody td {
  height: 22px;
}

.col-date { width: 80px; text-align: center; }
.col-details { }
.col-action { width: 130px; }
.col-deadline { width: 80px; text-align: center; }
.col-yn { width: 40px; text-align: center; }

.center { text-align: center; }

/* Signature tables */
.sig-table {
  width: 60%;
  border-collapse: collapse;
  border: 1.5px solid #000;
  margin-bottom: 8px;
  font-size: 9pt;
}

.sig-bottom {
  width: 100%;
}

.sig-table td {
  border: 1px solid #000;
  padding: 4px 8px;
  vertical-align: middle;
}

.sig-label {
  font-weight: bold;
  background: #e0e0e0;
  height: 22px;
}

.obs-label {
  background: #e0e0e0;
}

.sig-value {
  min-height: 40px;
  height: 40px;
}

.sig-content {
  height: 60px;
  vertical-align: top;
  padding-top: 4px;
}

.obs-content {
  vertical-align: top;
  white-space: pre-wrap;
}

.sig-img {
  max-height: 40px;
  max-width: 200px;
  object-fit: contain;
  display: block;
}

.loading {
  padding: 40px;
  text-align: center;
  font-family: Arial, sans-serif;
}

@media print {
  .pop-print {
    padding: 0;
    margin: 0;
    max-width: 100%;
  }
  @page {
    size: A4 portrait;
    margin: 10mm;
  }
}
</style>
