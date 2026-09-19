import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type { AnalysisResult, PanelStatus } from '@/types'

const STORAGE_KEY = 'signal-analysis-result'

/** 所有面板的状态只由这里推导，组件不再各自判空/判 loading */
function loadPersisted(): AnalysisResult | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AnalysisResult) : null
  } catch {
    return null
  }
}

export const useSignalStore = defineStore('signal', () => {
  // status 是唯一的状态源；loading/empty 不再散落在各组件里判断
  const status = ref<PanelStatus>(loadPersisted() ? 'ready' : 'empty')
  const result = ref<AnalysisResult | null>(loadPersisted())

  const loading = computed(() => status.value === 'loading')
  const hasResult = computed(() => status.value === 'ready')

  /**
   * 统一的请求入口：
   * - 发起时所有面板一起进入 loading，旧读数不会残留在某个面板上
   * - 成功后一起进入 ready
   * - 失败时若有上一轮结果则恢复 ready，否则回到 empty
   * 切换参数重新分析与刷新恢复走的是同一条路径，表现一致。
   */
  async function run(request: () => Promise<AnalysisResult>) {
    const previous = result.value
    status.value = 'loading'
    try {
      result.value = await request()
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(result.value)) } catch { /* 存储失败不影响展示 */ }
      status.value = 'ready'
    } catch (e) {
      result.value = previous
      status.value = previous ? 'ready' : 'empty'
      throw e
    }
  }

  function analyze(params: { modulation: string; samples: number; snr: number }) {
    return run(async () => (await axios.post('/api/generate', params)).data as AnalysisResult)
  }

  function importCSV(formData: FormData) {
    return run(async () => (await axios.post('/api/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })).data as AnalysisResult)
  }

  return { status, result, loading, hasResult, analyze, importCSV }
})
