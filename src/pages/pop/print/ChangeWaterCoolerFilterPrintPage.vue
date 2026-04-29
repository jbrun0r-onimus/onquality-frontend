<template>
  <div class="pop-print" v-if="data">
    <div class="form-header">
      <div class="logo-block">
        <img src="/agromix-logo.png" alt="Agro Mix Rações" class="logo-img" />
      </div>
      <div class="form-title-block">
        <div class="form-title">REGISTRO DA TROCA DO FILTRO DO BEBEDOURO</div>
        <div class="form-subtitle">Frequência: Semestral</div>
      </div>
      <div class="version-block">
        <div>Versão: 04</div>
      </div>
    </div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Data</th>
          <th>Assinatura do Responsável</th>
          <th>Observações</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ formatDate(data.execution_date) }}</td>
          <td>
            {{ data.employee_signature }}
            <img v-if="sigEmployeeSignature" :src="sigEmployeeSignature" class="sig-img" />
          </td>
          <td>{{ data.note ?? '' }}</td>
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
import { getChangeWaterCoolerFilter } from 'src/services/pop/changeWaterCoolerFilter.service';
import type { ChangeWaterCoolerFilterDetail } from 'src/schemas/pop/changeWaterCoolerFilter.schemas';
import { getPopSignatures } from 'src/services/pop/popSignature.service';

const route = useRoute();
const data = ref<ChangeWaterCoolerFilterDetail | null>(null);
const sigEmployeeSignature = ref<string | null>(null);

function formatDate(dateStr: string): string {
  try {
    const parsed = parse(dateStr, 'dd/MM/yyyy', new Date());
    return format(parsed, 'dd/MM/yyyy');
  } catch {
    return dateStr;
  }
}

onMounted(async () => {
  const id = Number(route.params.id);
  const [detail, sigs] = await Promise.all([
    getChangeWaterCoolerFilter(id),
    getPopSignatures('change-water-cooler-filter', id),
  ]);
  data.value = detail;
  sigEmployeeSignature.value = sigs.find((s) => s.field_name === 'employee_signature')?.url ?? null;
  setTimeout(() => window.print(), 800);
});
</script>

<style>
.pop-print { font-family: Arial, sans-serif; font-size: 10pt; padding: 15mm; max-width: 210mm; margin: 0 auto; box-sizing: border-box; }
.form-header { display: flex; border: 1px solid #000; align-items: stretch; }
.logo-block { width: 18%; border-right: 1px solid #000; display: flex; align-items: center; justify-content: center; padding: 4px; flex-shrink: 0; }
.logo-img { max-width: 100%; max-height: 70px; object-fit: contain; }
.form-title-block { flex: 1; padding: 8px; text-align: center; border-right: 1px solid #000; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.form-title { font-weight: bold; font-size: 10pt; text-transform: uppercase; }
.form-subtitle { font-size: 9pt; margin-top: 4px; }
.version-block { padding: 8px; text-align: center; font-size: 9pt; display: flex; align-items: center; white-space: nowrap; }
.data-table { width: 100%; border-collapse: collapse; border: 1px solid #000; border-top: none; }
.data-table th, .data-table td { border: 1px solid #000; padding: 4px 6px; }
.data-table th { background: #f0f0f0; font-weight: bold; text-align: center; }
.sig-img { display: block; max-height: 40px; max-width: 160px; margin-top: 2px; }
.loading { padding: 20px; text-align: center; }
@media print {
  .pop-print { padding: 0; margin: 0; max-width: 100%; }
  @page { margin: 15mm; }
}
</style>
