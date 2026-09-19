<template>
  <div class="panel-shell" :class="{ wide }">
    <h3 class="panel-title">{{ title }}</h3>
    <!-- 三态在这里集中渲染，面板本身只按 ready 这一种最终状态工作 -->
    <div v-if="store.status === 'loading'" class="panel-state">
      <span class="spinner" aria-hidden="true"></span>
      <span class="state-text">正在计算…</span>
    </div>
    <div v-else-if="store.status === 'empty'" class="panel-state">
      <span class="state-text">暂无结果，请点击「生成信号并分析」</span>
    </div>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
import { useSignalStore } from '@/store/signal'

defineProps<{ title: string; wide?: boolean }>()

const store = useSignalStore()
</script>

<style scoped>
.panel-shell { background:#1a2332; border-radius:8px; padding:16px; border:1px solid #2a3a4a; min-height:200px; display:flex; flex-direction:column }
.panel-shell.wide { grid-column: 1 / -1 }
.panel-title { margin-bottom:8px; color:#90caf9; font-size:14px; flex:none }
.panel-state { flex:1; display:flex; align-items:center; justify-content:center; gap:10px; min-height:160px }
.state-text { color:#8899aa; font-size:13px }
.spinner { width:18px; height:18px; border:2px solid #2a3a4a; border-top-color:#64b5f6; border-radius:50%; animation:panel-spin 0.8s linear infinite }
@keyframes panel-spin { to { transform:rotate(360deg) } }
</style>
