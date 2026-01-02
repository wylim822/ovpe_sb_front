<template>
  <div class="metric-chart-wrap">
    <div ref="chart" class="metric-chart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'MetricDistributionChart',

  props: {
    metricData: {
      type: Object,
      required: true
    }
  },

  mounted() {
    this.chart = echarts.init(this.$refs.chart)
    this.render()
    window.addEventListener('resize', this.resize)
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.resize)
    this.chart && this.chart.dispose()
  },

  watch: {
    metricData: {
      deep: true,
      handler() {
        this.render()
      }
    }
  },

  methods: {
    resize() {
      this.chart && this.chart.resize()
    },

    render() {
      if (!this.metricData?.values?.length) return
      this.chart.setOption(this.chartOption, true)
    }
  },

  computed: {
    chartOption() {
      /* 1. 분포 데이터 */
      const values = this.metricData.values
        .map(v => ({ x: Number(v.val), y: Number(v.cnt) }))
        .filter(v => Number.isFinite(v.x) && Number.isFinite(v.y))
        .sort((a, b) => a.x - b.x)

      if (!values.length) return {}

      /* 2. 기준값 / 내 차량 값 */
      const lim = Number(this.metricData.lim)

      const rawMyValue = this.metricData.myValue
      const myValue =
        rawMyValue === null || rawMyValue === undefined || rawMyValue === ''
          ? null
          : Number(rawMyValue)

      const hasMyValue = Number.isFinite(myValue)

      /* 3. bin 간격 기반 범위 계산 */
      const binGap =
        values.length > 1 ? values[1].x - values[0].x : 0

      const rangeMin = values[0].x - binGap / 2
      const rangeMax = values[values.length - 1].x + binGap / 2

      const isOutOfRange =
        hasMyValue &&
        myValue !== 0 &&
        (myValue < rangeMin || myValue > rangeMax)

      /* 4. bin 간격 기준으로 bar 폭을 제한 */ 
      const BAR_MIN_WIDTH = 30    // px
      const BAR_MAX_WIDTH = binGap > 0 ? binGap * 0.8 : 20

      return {
        title: {
          text: `${this.metricData.metric} 분포`,
          subtext: `기준값: ${lim}`,
          left: 'center'
        },

        tooltip: {
          trigger: 'item',
          formatter: p => {
            if (p.componentType === 'markLine') {
              return `
                <b>${p.data.label.formatter}</b><br/>
                측정값: ${p.data.xAxis}
              `
            }

            return `
              <b>${this.metricData.metric}</b><br/>
              측정값: ${p.value[0]}<br/>
              차량 수: ${p.value[1]}
            `
          }
        },

        grid: {
          left: 50,
          right: 30,
          bottom: 70,
          containLabel: true
        },

        xAxis: {
          type: 'value',
          name: '측정값',
          nameLocation: 'middle',
          nameGap: 35
        },

        yAxis: {
          type: 'value',
          name: '차량 수',
          minInterval: 1
        },

        series: [
          {
            type: 'bar',
            barMinWidth: BAR_MIN_WIDTH,
            barMaxWidth: BAR_MAX_WIDTH,
            data: values.map(v => [v.x, v.y]),
            itemStyle: {
              color: p => (p.value[0] > lim ? '#ef4444' : '#60a5fa')
            },

            markLine: {
              symbol: 'none',
              data: [
                {
                  xAxis: lim,
                  lineStyle: {
                    type: 'dashed',
                    width: 2,
                    color: '#9ca3af'
                  },
                  label: { formatter: '기준', position: 'end' }
                },
                ...(hasMyValue
                  ? [
                      {
                        xAxis: myValue,
                        lineStyle: {
                          width: 2,
                          color: '#22c55e'
                        },
                        label: {
                          formatter: isOutOfRange
                            ? '내 차량 (분포 밖)'
                            : '내 차량',
                          position: 'end'
                        }
                      }
                    ]
                  : [])
              ]
            }
          }
        ]
      }
    }
  }
}
</script>

<style scoped>
.metric-chart {
  width: 100%;
  height: 280px;
}
</style>
