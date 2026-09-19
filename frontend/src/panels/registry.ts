import type { Component } from 'vue'
import SpectrumPlot from '@/components/SpectrumPlot.vue'
import ConstellationPlot from '@/components/ConstellationPlot.vue'
import WaterfallPlot from '@/components/WaterfallPlot.vue'
import ModulationResult from '@/components/ModulationResult.vue'

export interface PanelDef {
  key: string
  title: string
  component: Component
  /** 占据两列网格（原布局中瀑布图、识别结果横跨整行） */
  wide?: boolean
}

/**
 * 面板顺序的唯一来源。
 * App 只按此数组 v-for 渲染，首次加载、切换参数、刷新恢复都得到同样的顺序。
 */
export const panels: PanelDef[] = [
  { key: 'spectrum', title: '📊 FFT频谱图', component: SpectrumPlot },
  { key: 'constellation', title: '⭐ 星座图 (IQ平面)', component: ConstellationPlot },
  { key: 'waterfall', title: '🌊 瀑布图 (Spectrogram)', component: WaterfallPlot, wide: true },
  { key: 'modulation', title: '🔬 调制识别结果', component: ModulationResult, wide: true }
]
