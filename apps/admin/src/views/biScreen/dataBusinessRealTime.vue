<template>
  <div class="business-real-time-page">
    <div class="search">
      <h2>{{ $getMenuName() || '业务实时监控看板' }}</h2>
    </div>
    <div class="chart-shell">
      <div class="chart-panel">
        <div class="top-chart-grid">
          <OnlineCountChart class="business-chart-card" />
          <MatchingBacklogChart class="business-chart-card" />
          <PaymentProcessChart class="business-chart-card" />
        </div>

        <TradeBusinessCharts class="business-chart-card" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MatchingBacklogChart from './components/businessRealTime/MatchingBacklogChart.vue'
import OnlineCountChart from './components/businessRealTime/OnlineCountChart.vue'
import PaymentProcessChart from './components/businessRealTime/PaymentProcessChart.vue'
import TradeBusinessCharts from './components/businessRealTime/TradeBusinessCharts.vue'
</script>

<style scoped lang="less">
.business-real-time-page {
  width: 100%;
  min-height: calc(100vh - 70px);
}

.chart-shell {
  min-height: calc(100vh - 120px);
  padding: 16px;
  background: #f4f6f9;
}

.chart-panel {
  width: 100%;
  display: grid;
  gap: 12px;
}

.business-chart-card {
  box-sizing: border-box;
  padding: 12px;
  background: #fff;
  border: 1px solid #e6ebf2;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(36, 44, 62, 0.08);
}

.top-chart-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 1280px) {
  .top-chart-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .chart-shell {
    padding: 12px;
  }

  .chart-panel {
    gap: 10px;
  }

  .business-chart-card {
    padding: 10px;
  }

  .top-chart-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style>
