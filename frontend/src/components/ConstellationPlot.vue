<template>
  <canvas ref="cvs" width="300" height="300" class="const-canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSignalStore } from '../store/signal'
const store = useSignalStore()
const cvs = ref<HTMLCanvasElement>()

// 只在 ready 时挂载，pts 必然存在；绘图逻辑与原先一致
function draw() {
  const c = cvs.value!; const ctx = c.getContext('2d')!; const W = c.width, H = c.height
  ctx.fillStyle = '#0d1520'; ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = '#2a3a4a'; ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(0, H/2); ctx.lineTo(W, H/2); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.stroke()

  const pts = store.result!.constellation
  const scale = W * 0.4
  for (const pt of pts) {
    const x = W/2 + pt.i * scale, y = H/2 - pt.q * scale
    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI*2)
    ctx.fillStyle = '#42a5f5'; ctx.fill()
    ctx.strokeStyle = 'rgba(66,165,245,0.5)'; ctx.stroke()
  }
  ctx.fillStyle = '#8899aa'; ctx.font = '10px system-ui'
  ctx.fillText('I →', W-25, H/2-5); ctx.fillText('Q ↑', W/2+5, 14)
}

onMounted(draw)
</script>

<style scoped>
.const-canvas { display:block; margin:0 auto; border-radius:4px }
</style>
