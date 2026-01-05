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
          text: `${this.metricData.metric} 측정값 비교`,
          subtext: hasMyValue
            ? '다른 차량들의 분포 속에서 내 차량 위치를 확인해보세요'
            : '다른 차량들의 측정값 분포를 확인해보세요',
          left: 'center'
        },

        tooltip: {
          trigger: 'item',
          formatter: p => {
            if (p.componentType === 'markLine') {
              const isMyCar = p.data.lineStyle?.color === '#22c55e'

              return isMyCar
                ? `
                  <b>내 차량 측정값</b><br/>
                  현재 값: ${p.data.xAxis}<br/>
                  ${
                    isOutOfRange
                      ? '다른 차량 분포에서는 거의 나타나지 않는 값이에요'
                      : '다른 차량들과 비슷한 범위에 있어요'
                  }
                `
                : `
                  <b>기준값</b><br/>
                  이 값을 넘으면 기준 초과로 판단돼요
                `
            }

            return `
              <b>다른 차량들은 보통 이 값이에요</b><br/>
              측정값 구간: ${p.value[0]}<br/>
              해당 차량 수: ${p.value[1]}대
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
                  label: {
                    formatter: '이 선을 넘으면 기준 초과',
                    position: 'end'
                  }
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
                            ? '내 차량은 분포 범위 밖에 있어요'
                            : '내 차량은 이 위치에 있어요',
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
