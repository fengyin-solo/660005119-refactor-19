<template>
  <div class="panel">
    <h3>{{ panel.icon }} {{ panel.title }}</h3>
    <!-- 状态判断只在此处做一次，各面板只负责 ready 状态下的渲染 -->
    <div v-if="store.status === 'empty'" class="panel-state">
      <el-empty description="暂无分析结果，请先生成或导入信号" :image-size="60" />
    </div>
    <div v-else-if="store.status === 'loading'" v-loading="true" element-loading-text="正在计算..." class="panel-state"></div>
    <component :is="panel.component" v-else />
  </div>
</template>

<script setup lang="ts">
import type { PanelDef } from '@/panels'
import { useSignalStore } from '@/store/signal'

defineProps<{ panel: PanelDef }>()

const store = useSignalStore()
</script>

<style scoped>
.panel { background:#1a2332; border-radius:8px; padding:16px; border:1px solid #2a3a4a }
.panel h3 { margin-bottom:12px; color:#90caf9; font-size:14px }
.panel-state { min-height:200px }
</style>
