<template>
  <q-page class="dashboard-page">

    <!-- ─── Page Header ──────────────────────────────────────────────────── -->
    <div class="dash-header">
      <div>
        <h1 class="dash-title">Painel de Controle</h1>
        <p class="dash-subtitle">Visão geral das operações de qualidade</p>
      </div>
      <div class="dash-header-right">
        <div class="system-status">
          <span class="status-dot" />
          <span class="status-text">Sistema Online</span>
        </div>
        <div class="dash-date">{{ currentDate }}</div>
      </div>
    </div>

    <!-- ─── KPI Cards ────────────────────────────────────────────────────── -->
    <div class="kpi-grid q-mb-lg">
      <div v-for="kpi in kpis" :key="kpi.id" class="kpi-card-wrapper">
        <div class="kpi-card">
          <div class="kpi-icon-box" :style="{ background: kpi.gradient }">
            <q-icon :name="kpi.icon" size="20px" color="white" />
          </div>
          <div class="kpi-body">
            <div class="kpi-label">{{ kpi.label }}</div>
            <div class="kpi-value">{{ kpi.value }}</div>
            <div class="kpi-trend" :class="kpi.trendClass">
              <q-icon :name="kpi.trendIcon" size="11px" />
              <span>{{ kpi.trend }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Charts Row ───────────────────────────────────────────────────── -->
    <div class="charts-row q-mb-lg">

      <!-- Activity Bar Chart -->
      <div class="chart-card chart-card--main">
        <div class="chart-header">
          <div>
            <div class="chart-title">Atividade Mensal</div>
            <div class="chart-subtitle">Total de registros por mês (últimos 6 meses)</div>
          </div>
          <div class="chart-legend">
            <span class="legend-dot" style="background: #2563EB" />
            <span class="legend-label">Registros</span>
          </div>
        </div>

        <!-- SVG Bar Chart -->
        <div class="bar-chart-wrapper">
          <svg :viewBox="`0 0 ${svgW} ${svgH}`" class="bar-chart-svg" preserveAspectRatio="xMidYMid meet">
            <!-- Y-axis grid lines -->
            <line
              v-for="tick in yTicks"
              :key="tick.y"
              :x1="chartLeft"
              :y1="tick.y"
              :x2="svgW - 10"
              :y2="tick.y"
              class="grid-line"
            />
            <!-- Y labels -->
            <text
              v-for="tick in yTicks"
              :key="`l-${tick.y}`"
              :x="chartLeft - 6"
              :y="tick.y + 4"
              text-anchor="end"
              class="axis-label"
            >{{ tick.label }}</text>

            <!-- Bars -->
            <g v-for="(bar, i) in barData" :key="i">
              <!-- Bar shadow -->
              <rect
                :x="bar.x + 3"
                :y="bar.y + 4"
                :width="barW"
                :height="bar.h"
                rx="5"
                class="bar-shadow"
              />
              <!-- Bar fill -->
              <rect
                :x="bar.x"
                :y="bar.y"
                :width="barW"
                :height="bar.h"
                rx="5"
                class="bar-fill"
                :class="{ 'bar-fill--current': i === monthlyActivity.length - 1 }"
              />
              <!-- Value label on top -->
              <text
                :x="bar.x + barW / 2"
                :y="bar.y - 5"
                text-anchor="middle"
                class="bar-value-label"
              >{{ bar.value }}</text>
              <!-- Month label at bottom -->
              <text
                :x="bar.x + barW / 2"
                :y="svgH - 6"
                text-anchor="middle"
                class="axis-label"
              >{{ bar.label }}</text>
            </g>
          </svg>
        </div>
      </div>

      <!-- POP Distribution -->
      <div class="chart-card chart-card--side">
        <div class="chart-header">
          <div>
            <div class="chart-title">Volume por POP</div>
            <div class="chart-subtitle">Top 5 procedimentos</div>
          </div>
        </div>

        <div class="pop-bars">
          <div
            v-for="(pop, i) in popDistribution"
            :key="i"
            class="pop-bar-item"
          >
            <div class="pop-bar-label-row">
              <span class="pop-bar-name">{{ pop.label }}</span>
              <span class="pop-bar-count">{{ pop.count }}</span>
            </div>
            <div class="pop-bar-track">
              <div
                class="pop-bar-fill"
                :style="{
                  width: (pop.count / maxPopCount * 100) + '%',
                  background: pop.color,
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Bottom Row ───────────────────────────────────────────────────── -->
    <div class="bottom-row">

      <!-- Non-Conformances -->
      <div class="chart-card chart-card--nc">
        <div class="chart-header">
          <div>
            <div class="chart-title">Não Conformidades</div>
            <div class="chart-subtitle">Registros recentes</div>
          </div>
          <q-badge
            :label="openNcCount + ' abertas'"
            color="negative"
            class="nc-badge"
          />
        </div>

        <div class="nc-list">
          <div
            v-for="nc in recentNonConformances"
            :key="nc.id"
            class="nc-item"
          >
            <div class="nc-status-dot" :class="`nc-status-dot--${nc.status}`" />
            <div class="nc-info">
              <div class="nc-desc">{{ nc.desc }}</div>
              <div class="nc-meta">{{ nc.date }} · {{ nc.operator }}</div>
            </div>
            <q-chip
              dense
              :color="nc.status === 'open' ? 'negative' : nc.status === 'in_progress' ? 'warning' : 'positive'"
              text-color="white"
              class="nc-chip"
            >{{ nc.statusLabel }}</q-chip>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="chart-card chart-card--activity">
        <div class="chart-header">
          <div>
            <div class="chart-title">Atividade Recente</div>
            <div class="chart-subtitle">Últimos registros de todos os POPs</div>
          </div>
        </div>

        <div class="activity-table">
          <div class="activity-table-header">
            <span>Procedimento</span>
            <span>Operador</span>
            <span>Data/Hora</span>
            <span>Status</span>
          </div>
          <div
            v-for="rec in recentActivity"
            :key="rec.id"
            class="activity-row"
          >
            <span class="activity-type">
              <q-icon :name="rec.icon" size="14px" class="q-mr-xs" />
              {{ rec.type }}
            </span>
            <span class="activity-operator">{{ rec.operator }}</span>
            <span class="activity-date">{{ rec.date }}</span>
            <span class="activity-status">
              <span class="status-badge" :class="`status-badge--${rec.status}`">
                {{ rec.statusLabel }}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>

  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ─── Current Date ─────────────────────────────────────────────────────────────

const currentDate = format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });

// ─── KPIs ─────────────────────────────────────────────────────────────────────
// TODO: Substituir pelos dados reais via useQuery quando a API expor totalizadores
// Exemplo: const { data } = useQuery(dashboardKpiQuery)

const kpis = [
  {
    id: 'today',
    label: 'Registros Hoje',
    value: '24',
    trend: '+12% vs ontem',
    trendClass: 'kpi-trend--up',
    trendIcon: 'o_trending_up',
    icon: 'o_assignment',
    gradient: 'linear-gradient(135deg, #0E3272 0%, #2563EB 100%)',
  },
  {
    id: 'nonconformance',
    label: 'Não Conformidades',
    value: '3',
    trend: '2 abertas este mês',
    trendClass: 'kpi-trend--down',
    trendIcon: 'o_warning',
    icon: 'o_report_problem',
    gradient: 'linear-gradient(135deg, #991B1B 0%, #DC2626 100%)',
  },
  {
    id: 'compliance',
    label: 'Conformidade',
    value: '94,2%',
    trend: '+1,8% este mês',
    trendClass: 'kpi-trend--up',
    trendIcon: 'o_trending_up',
    icon: 'o_verified',
    gradient: 'linear-gradient(135deg, #065F46 0%, #059669 100%)',
  },
  {
    id: 'training',
    label: 'Treinamentos',
    value: '18',
    trend: 'Este mês',
    trendClass: 'kpi-trend--neutral',
    trendIcon: 'o_info',
    icon: 'o_school',
    gradient: 'linear-gradient(135deg, #92400E 0%, #D97706 100%)',
  },
  {
    id: 'inspections',
    label: 'Inspeções de Carga',
    value: '47',
    trend: '+5 esta semana',
    trendClass: 'kpi-trend--up',
    trendIcon: 'o_trending_up',
    icon: 'o_local_shipping',
    gradient: 'linear-gradient(135deg, #1E1B4B 0%, #4338CA 100%)',
  },
];

// ─── Monthly Activity Chart ────────────────────────────────────────────────────
// TODO: Substituir com dados reais de cada serviço POP agrupados por mês
// Endpoint sugerido: GET /onquality/dashboard/monthly-activity

const monthlyActivity = [
  { label: 'Out', value: 156 },
  { label: 'Nov', value: 189 },
  { label: 'Dez', value: 142 },
  { label: 'Jan', value: 201 },
  { label: 'Fev', value: 178 },
  { label: 'Mar', value: 234 },
];

// SVG chart calculations
const svgW = 560;
const svgH = 200;
const chartLeft = 36;
const chartRight = 10;
const chartTop = 20;
const chartBottom = 24;
const chartH = svgH - chartTop - chartBottom;
const chartW = svgW - chartLeft - chartRight;
const barW = 44;

const maxVal = computed(() => Math.max(...monthlyActivity.map((d) => d.value)));

const barData = computed(() =>
  monthlyActivity.map((d, i) => {
    const n = monthlyActivity.length;
    const spacing = (chartW - barW * n) / (n + 1);
    const x = chartLeft + spacing + i * (barW + spacing);
    const h = Math.max(4, (d.value / maxVal.value) * (chartH - 16));
    const y = chartTop + chartH - h;
    return { x, y, h, label: d.label, value: d.value };
  })
);

const yTicks = computed(() => {
  const ticks = [0, 0.25, 0.5, 0.75, 1];
  return ticks.map((t) => ({
    y: chartTop + chartH - t * (chartH - 16),
    label: t === 0 ? '0' : Math.round(maxVal.value * t).toString(),
  }));
});

// ─── POP Distribution ─────────────────────────────────────────────────────────
// TODO: Agrupar count de registros por tipo de POP
// Pode ser feito somando totalElements de cada paginatedQuery com pageSize=1

const popDistribution = [
  { label: 'Monitoramento de Sala',    count: 287, color: '#2563EB' },
  { label: 'Inspeção de Carga',        count: 234, color: '#7C3AED' },
  { label: 'Controle de Saneamento',   count: 198, color: '#059669' },
  { label: 'Monitoramento de Equip.', count: 167, color: '#D97706' },
  { label: 'Registro de Treinamento',  count: 134, color: '#DC2626' },
];

const maxPopCount = Math.max(...popDistribution.map((p) => p.count));

// ─── Non-Conformances ─────────────────────────────────────────────────────────
// TODO: Substituir com nonConformanceLogQuery (nonConformanceLog.service.ts)

const recentNonConformances = [
  { id: 1, desc: 'Temperatura fora do range permitido', date: '23/03/2026', operator: 'João Silva', status: 'open',        statusLabel: 'Aberta' },
  { id: 2, desc: 'Equipamento com falha de calibração',  date: '22/03/2026', operator: 'Ana Costa',  status: 'in_progress', statusLabel: 'Em andamento' },
  { id: 3, desc: 'EPI não utilizado durante operação',   date: '21/03/2026', operator: 'Pedro M.',   status: 'closed',      statusLabel: 'Fechada' },
  { id: 4, desc: 'Prazo de validade excedido',           date: '20/03/2026', operator: 'Maria L.',   status: 'closed',      statusLabel: 'Fechada' },
];

const openNcCount = recentNonConformances.filter((nc) => nc.status === 'open').length;

// ─── Recent Activity ──────────────────────────────────────────────────────────
// TODO: Chamar cada service com pageSize=1 e pegar os registros mais recentes
// ou criar endpoint dedicado GET /onquality/dashboard/recent-activity

const recentActivity = [
  { id: 1, type: 'Inspeção de Carga',      icon: 'o_local_shipping',       operator: 'João Silva',  date: '23/03 14:32', status: 'ok',      statusLabel: 'Conforme' },
  { id: 2, type: 'Monitoramento de Sala',  icon: 'o_home_work',            operator: 'Ana Costa',   date: '23/03 13:15', status: 'ok',      statusLabel: 'Conforme' },
  { id: 3, type: 'Não Conformidade',       icon: 'o_report_problem',       operator: 'Pedro Santos', date: '23/03 12:00', status: 'warning', statusLabel: 'Atenção' },
  { id: 4, type: 'Treinamento',            icon: 'o_school',               operator: 'Maria Lima',  date: '23/03 10:45', status: 'ok',      statusLabel: 'Conforme' },
  { id: 5, type: 'Controle de Saneamento', icon: 'o_health_and_safety',    operator: 'Carlos Souza', date: '22/03 16:20', status: 'ok',      statusLabel: 'Conforme' },
  { id: 6, type: 'Manutenção de Equip.',   icon: 'o_precision_manufacturing', operator: 'Lucas Reis',  date: '22/03 14:10', status: 'ok',      statusLabel: 'Conforme' },
];
</script>

<style scoped lang="scss">
// ─── Page ─────────────────────────────────────────────────────────────────────

.dashboard-page {
  padding: 20px 24px;
  background: transparent;
}

// ─── Header ───────────────────────────────────────────────────────────────────

.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.dash-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 4px;
  letter-spacing: -0.4px;

  .body--dark & { color: #F1F5F9; }
}

.dash-subtitle {
  font-size: 0.8rem;
  color: #64748B;
  margin: 0;
}

.dash-header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.system-status {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(5, 150, 105, 0.08);
  border: 1px solid rgba(5, 150, 105, 0.2);
  padding: 4px 10px;
  border-radius: 20px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #059669;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

.status-text {
  font-size: 11px;
  font-weight: 600;
  color: #059669;
  letter-spacing: 0.3px;
}

.dash-date {
  font-size: 11px;
  color: #94A3B8;
  text-transform: capitalize;
}

// ─── KPI Grid ─────────────────────────────────────────────────────────────────

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;

  @media (max-width: 1200px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 768px)  { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px)  { grid-template-columns: 1fr; }
}

.kpi-card {
  background: #FFFFFF;
  border: 1px solid #E8EDF4;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  box-shadow:
    0 1px 3px rgba(14, 50, 114, 0.06),
    0 2px 8px rgba(14, 50, 114, 0.03);
  transition: box-shadow 0.2s ease, transform 0.2s ease;

  &:hover {
    box-shadow:
      0 4px 12px rgba(14, 50, 114, 0.1),
      0 2px 4px rgba(14, 50, 114, 0.06);
    transform: translateY(-1px);
  }

  .body--dark & {
    background: #0F1E35;
    border-color: rgba(255, 255, 255, 0.07);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);

    &:hover {
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
    }
  }
}

.kpi-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kpi-body {
  flex: 1;
  min-width: 0;
}

.kpi-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: #94A3B8;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kpi-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.1;
  letter-spacing: -0.5px;
  margin-bottom: 4px;

  .body--dark & { color: #F1F5F9; }
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  font-weight: 500;

  &--up    { color: #059669; }
  &--down  { color: #DC2626; }
  &--neutral { color: #64748B; }
}

// ─── Charts Row ───────────────────────────────────────────────────────────────

.charts-row {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 14px;

  @media (max-width: 1100px) { grid-template-columns: 1fr; }
}

// ─── Shared Card ─────────────────────────────────────────────────────────────

.chart-card {
  background: #FFFFFF;
  border: 1px solid #E8EDF4;
  border-radius: 12px;
  padding: 20px;
  box-shadow:
    0 1px 3px rgba(14, 50, 114, 0.05),
    0 2px 8px rgba(14, 50, 114, 0.03);

  .body--dark & {
    background: #0F1E35;
    border-color: rgba(255, 255, 255, 0.07);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  }
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.chart-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1E293B;
  margin-bottom: 2px;
  letter-spacing: -0.2px;

  .body--dark & { color: #E2E8F0; }
}

.chart-subtitle {
  font-size: 11px;
  color: #94A3B8;
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-label {
  font-size: 11px;
  color: #64748B;
}

// ─── SVG Bar Chart ────────────────────────────────────────────────────────────

.bar-chart-wrapper {
  width: 100%;
  overflow: hidden;
}

.bar-chart-svg {
  width: 100%;
  height: 200px;
}

.grid-line {
  stroke: #F1F5F9;
  stroke-width: 1;
  stroke-dasharray: 3 3;

  .body--dark & { stroke: rgba(255, 255, 255, 0.06); }
}

.axis-label {
  font-size: 10px;
  fill: #94A3B8;
  font-family: 'Montserrat', sans-serif;
}

.bar-shadow {
  fill: rgba(14, 50, 114, 0.08);

  .body--dark & { fill: rgba(0, 0, 0, 0.2); }
}

.bar-fill {
  fill: #BFDBFE;
  transition: fill 0.2s ease;

  &--current {
    fill: #2563EB;
  }

  .body--dark & {
    fill: #1E3A6E;

    &--current {
      fill: #3B82F6;
    }
  }
}

.bar-value-label {
  font-size: 9.5px;
  fill: #475569;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;

  .body--dark & { fill: #94A3B8; }
}

// ─── POP Bars ─────────────────────────────────────────────────────────────────

.pop-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pop-bar-item {}

.pop-bar-label-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.pop-bar-name {
  font-size: 11.5px;
  color: #475569;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  margin-right: 8px;

  .body--dark & { color: #94A3B8; }
}

.pop-bar-count {
  font-size: 11.5px;
  font-weight: 700;
  color: #1E293B;

  .body--dark & { color: #CBD5E1; }
}

.pop-bar-track {
  height: 6px;
  background: #F1F5F9;
  border-radius: 3px;
  overflow: hidden;

  .body--dark & { background: rgba(255, 255, 255, 0.08); }
}

.pop-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.85;
}

// ─── Bottom Row ───────────────────────────────────────────────────────────────

.bottom-row {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 14px;

  @media (max-width: 1100px) { grid-template-columns: 1fr; }
}

// ─── Non-Conformances ─────────────────────────────────────────────────────────

.nc-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 20px;
}

.nc-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nc-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #F1F5F9;

  &:last-child { border-bottom: none; }

  .body--dark & { border-bottom-color: rgba(255, 255, 255, 0.06); }
}

.nc-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;

  &--open        { background: #DC2626; box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2); }
  &--in_progress { background: #D97706; box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.2); }
  &--closed      { background: #059669; }
}

.nc-info {
  flex: 1;
  min-width: 0;
}

.nc-desc {
  font-size: 12.5px;
  font-weight: 500;
  color: #1E293B;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .body--dark & { color: #E2E8F0; }
}

.nc-meta {
  font-size: 11px;
  color: #94A3B8;
  margin-top: 2px;
}

.nc-chip {
  font-size: 10px;
  height: 20px;
  flex-shrink: 0;
}

// ─── Activity Table ───────────────────────────────────────────────────────────

.activity-table {
  overflow: hidden;
}

.activity-table-header {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 1fr;
  padding: 0 0 8px;
  border-bottom: 2px solid #F1F5F9;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #94A3B8;

  .body--dark & { border-bottom-color: rgba(255, 255, 255, 0.08); }
}

.activity-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 1fr;
  padding: 9px 0;
  border-bottom: 1px solid #F8FAFC;
  transition: background 0.1s;
  border-radius: 6px;
  margin: 0 -4px;

  &:last-child { border-bottom: none; }

  &:hover {
    background: rgba(14, 50, 114, 0.03);

    .body--dark & { background: rgba(255, 255, 255, 0.03); }
  }

  .body--dark & { border-bottom-color: rgba(255, 255, 255, 0.04); }

  > * {
    padding: 0 4px;
    display: flex;
    align-items: center;
  }
}

.activity-type {
  font-size: 12.5px;
  font-weight: 600;
  color: #334155;

  .body--dark & { color: #CBD5E1; }
}

.activity-operator {
  font-size: 12px;
  color: #64748B;
}

.activity-date {
  font-size: 11.5px;
  color: #94A3B8;
}

.activity-status {}

.status-badge {
  font-size: 10.5px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;

  &--ok {
    background: rgba(5, 150, 105, 0.1);
    color: #059669;
  }

  &--warning {
    background: rgba(217, 119, 6, 0.1);
    color: #D97706;
  }

  &--error {
    background: rgba(220, 38, 38, 0.1);
    color: #DC2626;
  }
}
</style>
