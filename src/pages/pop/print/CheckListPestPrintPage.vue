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
          <!-- Title (spans 2 rows) -->
          <td class="header-title" rowspan="2">
            CHECK-LIST DE CONTROLE DE PRAGAS E MANEJO DE RESÍDUOS
          </td>
          <!-- Version -->
          <td class="header-version">Versão: 04</td>
        </tr>
        <tr>
          <!-- Month / Year -->
          <td class="header-month">Mês/Ano: {{ monthYear }}</td>
        </tr>
      </tbody>
    </table>

    <!-- ─── Questions Table ───────────────────────────────────────────────── -->
    <table class="main-table">
      <thead>
        <tr>
          <th class="col-item">ITENS</th>
          <th class="col-yn">SIM</th>
          <th class="col-yn">NÃO</th>
          <th class="col-action">AÇÃO CORRETIVA</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(q, idx) in questions" :key="idx">
          <td class="col-item">{{ idx + 1 }}. {{ q.text }}</td>
          <td class="col-yn center">{{ q.value === true ? 'X' : '' }}</td>
          <td class="col-yn center">{{ q.value === false ? 'X' : '' }}</td>
          <td class="col-action">&nbsp;</td>
        </tr>
      </tbody>
    </table>

    <!-- ─── Monitored By ───────────────────────────────────────────────────── -->
    <table class="signature-table">
      <tbody>
        <tr>
          <td class="sig-label">MONITORADO POR:</td>
          <td class="sig-line"></td>
        </tr>
      </tbody>
    </table>

    <!-- ─── Verified By ──────────────────────────────────────────────────── -->
    <table class="signature-table">
      <tbody>
        <tr>
          <td class="sig-label">VERIFICADO POR:</td>
          <td class="sig-line"></td>
        </tr>
      </tbody>
    </table>

    <!-- ─── Observations ──────────────────────────────────────────────────── -->
    <table class="signature-table">
      <tbody>
        <tr>
          <td class="sig-label">OBSERVAÇÕES</td>
          <td class="sig-line">{{ data.note ?? '' }}</td>
        </tr>
      </tbody>
    </table>

    <!-- ─── Date ──────────────────────────────────────────────────────────── -->
    <table class="signature-table">
      <tbody>
        <tr>
          <td class="sig-label">DATA:</td>
          <td class="sig-line">{{ formattedDate }}</td>
        </tr>
      </tbody>
    </table>

  </div>
  <div v-else class="loading">Carregando…</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getCheckListPest } from 'src/services/pop/checkListPest.service';
import type { CheckListPestDetail } from 'src/schemas/pop/checkListPest.schemas';

const QUESTIONS = [
  'As áreas ao redor das edificações apresentam material em desuso, grama e mato não aparado?',
  'Os portões externos estão adaptados com barreiras para proteções contra as pragas e estão em bom estado de conservação?',
  'Todas as aberturas estão adequadamente teladas?',
  'As telas estão limpas e em bom estado de conservação?',
  'Há presença de animais domésticos na área interna ou externa da fábrica?',
  'Há indicativos que demonstrem a presença de pragas tais como resíduos de fezes, animais mortos, penas ou pelos?',
  'Existe porta-iscas estrategicamente localizados e numerados?',
  'Os portas-iscas estão em bom estado de conservação?',
  'É observada a presença de insetos, roedores, morcegos e pássaros dentro das instalações da fábrica?',
  'Existe casa de lixo ou depósito fechado exclusivo para o armazenamento de resíduos fora da fábrica?',
  'As lixeiras estão identificadas e são limpas e higienizadas constantemente?',
  'As lixeiras possuem tampa, são constituídos de material de fácil limpeza e estão em bom estado de conservação?',
  'Os resíduos são retirados da fábrica diariamente?',
  'Existem alimentos estocados nos armários dos colaboradores?',
  'Os resíduos estão sendo recolhidos pela terceirizada, conforme previsto em contrato?',
  'No controle de pragas é utilizado produtos químicos registrados no Ministério da Saúde?',
  'Existe registro do controle de pragas (relatório de visitas, ordens de serviço, mapa de iscas)?',
];

const route = useRoute();
const data = ref<CheckListPestDetail | null>(null);

const questions = computed(() =>
  QUESTIONS.map((text, i) => ({
    text,
    value: data.value?.[`question${i + 1}` as keyof CheckListPestDetail] as boolean | null,
  }))
);

const formattedDate = computed(() => {
  if (!data.value?.created_at) return '';
  try {
    return format(new Date(data.value.created_at), 'dd/MM/yyyy');
  } catch {
    return data.value.created_at;
  }
});

const monthYear = computed(() => {
  if (!data.value?.created_at) return '';
  try {
    return format(new Date(data.value.created_at), 'MM/yyyy', { locale: ptBR });
  } catch {
    return '';
  }
});

onMounted(async () => {
  const id = Number(route.params.id);
  data.value = await getCheckListPest(id);
  setTimeout(() => window.print(), 800);
});
</script>

<style>
.pop-print {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 8pt;
  color: #000;
  padding: 8mm;
  box-sizing: border-box;
}

/* ─── Header ───────────────────────────────────────────────────────────────── */
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

.header-version {
  text-align: center;
  font-size: 8.5pt;
  width: 100px;
}

.header-month {
  text-align: left;
  font-size: 8.5pt;
  width: 100px;
}

/* ─── Questions Table ──────────────────────────────────────────────────────── */
.main-table {
  width: 100%;
  border-collapse: collapse;
  border: 1.5px solid #000;
  margin-top: 6px;
}

.main-table th,
.main-table td {
  border: 1px solid #000;
  padding: 5px 6px;
  font-size: 9.5pt;
  vertical-align: middle;
}

.main-table th {
  background: #e8e8e8;
  font-weight: bold;
  text-align: center;
}

.col-item {
  height: 24px;
}

.col-yn {
  width: 36px;
  text-align: center;
}

.col-action {
  width: 25%;
}

.center {
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
  min-width: 120px;
}

.sig-obs {
  width: 50%;
  vertical-align: top;
  padding: 4px 6px;
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
    size: A4 portrait;
    margin: 8mm;
  }

  .pop-print {
    padding: 0;
    margin: 0;
  }
}
</style>
