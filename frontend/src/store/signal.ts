import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type { AnalysisResult, AnalysisStatus } from '@/types'

export const useSignalStore = defineStore('signal', () => {
  const loading = ref(false)
  const result = ref<AnalysisResult | null>(null)
  const activeView = ref('spectrum')

  /** 唯一的状态判断入口：面板只根据该状态渲染 */
  const status = computed<AnalysisStatus>(() => {
    if (loading.value) return 'loading'
    return result.value ? 'ready' : 'empty'
  })

  async function analyze(params: { modulation: string; samples: number; snr: number }) {
    loading.value = true
    try {
      const { data } = await axios.post('/api/generate', params)
      result.value = data
    } finally { loading.value = false }
  }

  async function importCSV(formData: FormData) {
    loading.value = true
    try {
      const { data } = await axios.post('/api/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      result.value = data
    } finally { loading.value = false }
  }

  return { loading, result, activeView, status, analyze, importCSV }
})
