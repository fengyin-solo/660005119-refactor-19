import type { Component } from 'vue'
import SpectrumPlot from '@/components/SpectrumPlot.vue'
import ConstellationPlot from '@/components/ConstellationPlot.vue'
import WaterfallPlot from '@/components/WaterfallPlot.vue'
import ModulationResult from '@/components/ModulationResult.vue'

export interface PanelDef {
  /** 稳定唯一标识，切换/刷新后顺序保持一致 */
  key: string
  title: string
  icon: string
  /** 24 栅格布局中的占位宽度，24 为整行 */
  span: number
  component: Component
}

/** 面板的唯一顺序来源，App 通过 v-for 渲染，避免各处硬编码 */
export const PANELS: PanelDef[] = [
  { key: 'spectrum', title: 'FFT频谱图', icon: '📊', span: 12, component: SpectrumPlot },
  { key: 'constellation', title: '星座图 (IQ平面)', icon: '⭐', span: 12, component: ConstellationPlot },
  { key: 'waterfall', title: '瀑布图 (Spectrogram)', icon: '🌊', span: 24, component: WaterfallPlot },
  { key: 'modulation', title: '调制识别结果', icon: '🔬', span: 24, component: ModulationResult }
]
