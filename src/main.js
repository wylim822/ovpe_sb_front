import Vue from 'vue'
import App from './App.vue'
// 라우터 설정
import router from './router'
import ECharts from 'vue-echarts'

/* echarts core */
import { use } from 'echarts/core'

/* Renderer */
import { CanvasRenderer } from 'echarts/renderers'

/* Chart 종류 */
import { BarChart, RadarChart, ScatterChart } from 'echarts/charts'

/* Component */
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  RadarComponent
} from 'echarts/components'

/* echarts에 등록 */
use([
  CanvasRenderer,
  BarChart,
  RadarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  RadarComponent,
  ScatterChart
])

/* vue 전역 컴포넌트 등록 */
Vue.component('v-chart', ECharts)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
