<template>
  <canvas ref="cvs" width="800" height="200" class="waterfall-canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSignalStore } from '../store/signal'
const store = useSignalStore()
const cvs = ref<HTMLCanvasElement>()

// 只在 ready 时挂载，rows 必然存在；绘图逻辑与原先一致
function draw() {
  const c = cvs.value!; const ctx = c.getContext('2d')!; const W = c.width, H = c.height
  const rows = store.result!.waterfall
  ctx.fillStyle = '#0d1520'; ctx.fillRect(0, 0, W, H)
  const rowH = H / rows.length
  for (let r = 0; r < rows.length; r++) {
    const vals = rows[r].values, n = vals.length
    if (!n) continue
    const valsMin = Math.min(...vals), valsMax = Math.max(...vals)
    const vRange = valsMax - valsMin || 1
    for (let i = 0; i < n; i++) {
      const t = (vals[i] - valsMin) / vRange
      const rv = Math.round(t * 200)
      const gv = Math.round(t * 100 + (1-t) * 50)
      const bv = Math.round((1-t) * 200 + 30)
      ctx.fillStyle = `rgb(${rv},${gv},${bv})`
      ctx.fillRect(i * W / n, r * rowH, W / n + 1, rowH + 1)
    }
  }
}

onMounted(draw)
</script>

<style scoped>
.waterfall-canvas { display:block; width:100%; border-radius:4px }
</style>
