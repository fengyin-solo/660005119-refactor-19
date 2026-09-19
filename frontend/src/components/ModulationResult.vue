<template>
  <div>
    <el-row :gutter="16">
      <el-col :span="8">
        <div class="result-card">
          <div class="label">检测类型</div>
          <div class="value highlight">{{ store.result!.modulation.type }}</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="result-card">
          <div class="label">置信度</div>
          <div class="value">{{ pct }}%</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="result-card">
          <div class="label">符号速率</div>
          <div class="value">{{ store.result!.modulation.symbolRate?.toFixed(0) || 'N/A' }} Baud</div>
        </div>
      </el-col>
    </el-row>
    <div class="candidates">
      <div class="label" style="margin-top:12px">候选调制方式</div>
      <div v-for="c in store.result!.modulation.candidates" :key="c.type" class="candidate-row">
        <span class="c-type">{{ c.type }}</span>
        <el-progress :percentage="Math.round(c.score * 100)" :stroke-width="8" :color="progressColor(c.score)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSignalStore } from '../store/signal'
const store = useSignalStore()
const pct = computed(() => Math.round((store.result?.modulation.confidence || 0) * 100))
function progressColor(score: number) {
  if (score > 0.7) return '#66bb6a'; if (score > 0.4) return '#ffa726'; return '#ef5350'
}
</script>

<style scoped>
.result-card { text-align:center; padding:12px; background:#0d1520; border-radius:8px }
.label { font-size:12px; color:#8899aa; margin-bottom:4px }
.value { font-size:20px; font-weight:700; color:#e0e0e0 }
.value.highlight { color:#64b5f6 }
.candidate-row { display:flex; align-items:center; gap:12px; margin:8px 0 }
.c-type { width:60px; font-size:13px; color:#e0e0e0 }
</style>
