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
      const values = this.metricData.values
        .map(v => ({ x: Number(v.val), y: Number(v.cnt) }))
        .filter(v => Number.isFinite(v.x) && Number.isFinite(v.y))
        .sort((a, b) => a.x - b.x)

      if (!values.length) return {}

      const lim = Number(this.metricData.lim)
      const rawMyValue = this.metricData.myValue
      const myValue =
        rawMyValue === null || rawMyValue === undefined || rawMyValue === ''
          ? null
          : Number(rawMyValue)
      const hasMyValue = Number.isFinite(myValue)

      const binGap = values.length > 1 ? values[1].x - values[0].x : 0
      const rangeMin = values[0].x - binGap / 2
      const rangeMax = values[values.length - 1].x + binGap / 2
      const isOutOfRange =
        hasMyValue && myValue !== 0 &&
        (myValue < rangeMin || myValue > rangeMax)

      const BAR_MIN_WIDTH = 30
      const BAR_MAX_WIDTH = binGap > 0 ? binGap * 0.8 : 20

      // 막대 색상: 기준 초과는 빨강, 내 차량 위치는 초록, 나머지는 파랑
      const getColor = (val) => {
        if (val > lim) return '#f87171'
        if (hasMyValue && Math.abs(val - myValue) <= binGap / 2) return '#34d399'
        return '#93c5fd'
      }

      return {
        title: {
          text: `${this.metricData.metric} 분포`,
          subtext: hasMyValue
            ? isOutOfRange
              ? '⚠ 내 차량은 일반적인 분포 범위를 벗어났습니다'
              : '✔ 내 차량 위치가 초록색으로 표시됩니다'
            : '다른 차량들의 측정값 분포',
          left: 'center',
          top: 8,
          textStyle: {
            fontSize: 15,
            fontWeight: 'bold',
            color: '#1b2638'
          },
          subtextStyle: {
            fontSize: 12,
            color: isOutOfRange ? '#ef4444' : '#6b7280'
          }
        },

        tooltip: {
          trigger: 'item',
          backgroundColor: '#fff',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          textStyle: { color: '#1b2638', fontSize: 13 },
          formatter: p => {
            if (p.componentType === 'markLine') {
              const isMyCar = p.data.lineStyle?.color === '#10b981'
              if (isMyCar) {
                return `<div style="font-weight:600;margin-bottom:4px">🚗 내 차량</div>
                  측정값: <b>${p.data.xAxis}</b><br/>
                  ${isOutOfRange
                    ? '<span style="color:#ef4444">분포 범위를 벗어난 값이에요</span>'
                    : '<span style="color:#10b981">정상 분포 범위 내에 있어요</span>'}`
              }
              return `<div style="font-weight:600;margin-bottom:4px">⚠ 기준값</div>
                이 값(<b>${lim}</b>)을 초과하면 기준 초과로 판정돼요`
            }
            return `<div style="font-weight:600;margin-bottom:4px">📊 분포 현황</div>
              측정값 구간: <b>${p.value[0]}</b><br/>
              해당 차량 수: <b>${p.value[1]}대</b>`
          }
        },

        grid: {
          left: 16,
          right: 24,
          bottom: 60,
          top: 80,
          containLabel: true
        },

        xAxis: {
          type: 'value',
          name: '측정값',
          nameLocation: 'middle',
          nameGap: 30,
          nameTextStyle: { color: '#6b7280', fontSize: 12 },
          axisLine: { lineStyle: { color: '#e5e7eb' } },
          splitLine: { lineStyle: { color: '#f3f4f6' } }
        },

        yAxis: {
          type: 'value',
          name: '차량 수',
          nameTextStyle: { color: '#6b7280', fontSize: 12 },
          minInterval: 1,
          axisLine: { show: false },
          splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } }
        },

        series: [
          {
            type: 'bar',
            barMinWidth: BAR_MIN_WIDTH,
            barMaxWidth: BAR_MAX_WIDTH,
            data: values.map(v => [v.x, v.y]),
            itemStyle: {
              color: p => getColor(p.value[0]),
              borderRadius: [4, 4, 0, 0]   // 막대 상단 모서리 둥글게
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 8,
                shadowColor: 'rgba(0,0,0,0.15)'
              }
            },
            markLine: {
              symbol: 'none',
              animation: false,
              data: [
                {
                  xAxis: lim,
                  lineStyle: { type: 'dashed', width: 2, color: '#9ca3af' },
                  label: {
                    formatter: `기준값 ${lim}`,
                    position: 'insideEndTop',
                    backgroundColor: '#f3f4f6',
                    padding: [3, 6],
                    borderRadius: 4,
                    color: '#374151',
                    fontSize: 11
                  }
                },
                ...(hasMyValue ? [{
                  xAxis: myValue,
                  lineStyle: { width: 2, color: '#10b981', type: 'solid' },
                  label: {
                    formatter: `내 차량 ${myValue}`,
                    position: 'insideEndTop',
                    backgroundColor: isOutOfRange ? '#fef2f2' : '#ecfdf5',
                    padding: [3, 6],
                    borderRadius: 4,
                    color: isOutOfRange ? '#ef4444' : '#10b981',
                    fontSize: 11
                  }
                }] : [])
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
  height: 320px;
}
</style>
