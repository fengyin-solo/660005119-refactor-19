import { setActivePinia, createPinia } from 'pinia'
import axios from 'axios'
import { useSignalStore } from '@/store/signal'
import { panels } from '@/panels/registry'
async function main() {

const mem = new Map()
globalThis.localStorage = {
  getItem: k => mem.has(k) ? mem.get(k) : null,
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: k => mem.delete(k)
}

let call = 0
axios.defaults.adapter = async (config) => {
  call++
  if (config.url === '/api/generate-fail') throw new Error('network down')
  return { data: { run: call, spectrum: {}, waterfall: [], constellation: [], modulation: {} }, status: 200, statusText: 'OK', headers: {}, config }
}

let failures = 0
const check = (name, cond) => { console.log((cond ? 'PASS' : 'FAIL') + ' - ' + name); if (!cond) failures++ }

setActivePinia(createPinia())
let s = useSignalStore()
check('初始状态 empty', s.status === 'empty' && s.loading === false && s.hasResult === false)

await s.analyze({ modulation: 'QPSK', samples: 1024, snr: 20 })
check('成功后 ready', s.status === 'ready' && s.result.run === 1)
check('结果已持久化', JSON.parse(mem.get('signal-analysis-result')).run === 1)

let threw = false
try { await s.run(() => axios.post('/api/generate-fail')) } catch { threw = true }
check('失败抛出错误', threw)
check('失败后恢复上一轮结果(切换/恢复一致)', s.status === 'ready' && s.result.run === 1)

mem.clear()
setActivePinia(createPinia())
s = useSignalStore()
check('无持久化时初始 empty', s.status === 'empty')
threw = false
try { await s.run(() => axios.post('/api/generate-fail')) } catch { threw = true }
check('空态失败仍为 empty', threw && s.status === 'empty' && s.result === null)

setActivePinia(createPinia())
await useSignalStore().analyze({ modulation: 'AM', samples: 512, snr: 10 })
setActivePinia(createPinia())
s = useSignalStore()
check('刷新后从持久化恢复 ready', s.status === 'ready' && s.result.run !== undefined)

check('面板注册表有4项且顺序固定',
  panels.map(p => p.key).join(',') === 'spectrum,constellation,waterfall,modulation')
check('waterfall/modulation 为宽面板', !!panels[2].wide && !!panels[3].wide && !panels[0].wide && !panels[1].wide)

return failures

}
main().then(f => process.exit(f ? 1 : 0))
