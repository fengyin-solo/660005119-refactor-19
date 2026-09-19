import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { createPinia } from 'pinia'
import ElementPlus, { ID_INJECTION_KEY, ZINDEX_INJECTION_KEY } from 'element-plus'
import App from '@/App.vue'
import { useSignalStore } from '@/store/signal'

console.warn = () => {}; console.error = () => {}

const fixture = {
  spectrum: { frequencies: [0, 1], magnitudes: [-10, -20] },
  waterfall: [{ time: 0, values: [-5, 0] }],
  constellation: [{ i: 0.1, q: 0.2 }],
  modulation: { type: 'QPSK', confidence: 0.82, candidates: [{ type: 'QPSK', score: 0.82 }], symbolRate: 62, frequencyOffset: 1.2 }
}

async function renderFor(status) {
  const app = createSSRApp(App)
  const pinia = createPinia()
  app.use(pinia).use(ElementPlus)
  app.provide(ID_INJECTION_KEY, { prefix: 1024, current: 0 })
  app.provide(ZINDEX_INJECTION_KEY, { current: 0 })
  const store = useSignalStore()
  if (status === 'ready') { store.result = fixture; store.status = 'ready' }
  if (status === 'loading') store.status = 'loading'
  return await renderToString(app)
}

// 只取面板网格区域，避开控制表单里的 QPSK 下拉选项
function panelsArea(html) {
  const start = html.indexOf('panels-grid')
  return html.slice(start)
}

let failures = 0
const check = (n, c) => { console.log((c ? 'PASS' : 'FAIL') + ' - ' + n); if (!c) failures++ }
const ordered = h =>
  h.indexOf('FFT频谱图') < h.indexOf('星座图') &&
  h.indexOf('星座图') < h.indexOf('瀑布图') &&
  h.indexOf('瀑布图') < h.indexOf('调制识别结果')

const emptyHtml = panelsArea(await renderFor('empty'))
check('空态:4个面板均提示"暂无结果"', (emptyHtml.match(/暂无结果/g) || []).length === 4)
check('空态:不渲染canvas/进度条', !emptyHtml.includes('waterfall-canvas') && !emptyHtml.includes('el-progress'))
check('空态:面板顺序 频谱→星座→瀑布→识别', ordered(emptyHtml))

const loadingHtml = panelsArea(await renderFor('loading'))
check('加载态:4个面板均显示"正在计算"', (loadingHtml.match(/正在计算/g) || []).length === 4)
check('加载态:面板内不残留旧读数/绘图',
  !loadingHtml.includes('waterfall-canvas') && !loadingHtml.includes('const-canvas') && !loadingHtml.includes('82'))

const readyHtml = panelsArea(await renderFor('ready'))
check('结果态:显示真实读数(QPSK/82%/62 Baud)',
  readyHtml.includes('QPSK') && readyHtml.includes('82') && readyHtml.includes('62'))
check('结果态:canvas 已挂载', readyHtml.includes('waterfall-canvas') && readyHtml.includes('const-canvas'))
check('结果态:无空态/加载文案', !readyHtml.includes('正在计算') && !readyHtml.includes('暂无结果'))
check('结果态:面板顺序仍固定', ordered(readyHtml))

process.exit(failures ? 1 : 0)
