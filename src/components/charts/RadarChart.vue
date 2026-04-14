<template>
  <div class="radar-wrap">
    <canvas ref="radarCanvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'RadarChart',

  props: {
    graphExpln: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      radarChart: null
    }
  },

  watch: {
    graphExpln: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          this.drawChart()
        })
      }
    }
  },

  beforeDestroy() {
    if (this.radarChart) {
      this.radarChart.destroy()
      this.radarChart = null
    }
  },

  methods: {
    parseChartData() {
      if (!this.graphExpln) return null

      var text = String(this.graphExpln)
      var lines = text.split('\n')
      var labels = []
      var valuesVhcl = []
      var valuesA = []
      var valuesB = []

      function parseVal(raw) {
        var n = parseFloat(raw)
        return isNaN(n) ? null : n
      }

      for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim()
        if (!line.startsWith('|')) continue
        if (line.includes('---')) continue
        if (line.includes('축') && line.includes('차량')) continue

        var cells = line.split('|')
          .map(function(c) { return c.trim() })
          .filter(Boolean)
        if (cells.length < 2) continue

        labels.push(cells[0])
        valuesVhcl.push(parseVal(cells[1]) !== null ? parseVal(cells[1]) : 0)
        valuesA.push(cells[2] ? parseVal(cells[2]) : null)
        valuesB.push(cells[3] ? parseVal(cells[3]) : null)
      }

      if (labels.length === 0) return null

      var hasA = valuesA.some(function(v) { return v !== null })
      var hasB = valuesB.some(function(v) { return v !== null })

      return { labels, valuesVhcl, valuesA, valuesB, hasA, hasB }
    },

    drawChart() {
      var data = this.parseChartData()
      if (!data) return

      if (this.radarChart) {
        this.radarChart.destroy()
        this.radarChart = null
      }

      var canvas = this.$refs.radarCanvas
      if (!canvas) return

      var Chart = require('chart.js/auto')

      var datasets = [
        {
          label: '차량',
          data: data.valuesVhcl,
          backgroundColor: 'rgba(30, 144, 255, 0.15)',
          borderColor: '#1e90ff',
          borderWidth: 2,
          pointBackgroundColor: '#1e90ff',
          pointRadius: 4
        }
      ]

      if (data.hasA) {
        datasets.push({
          label: '기준선A',
          data: data.valuesA,
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          borderColor: '#2ecc71',
          borderWidth: 2,
          borderDash: [5, 5],
          pointBackgroundColor: '#2ecc71',
          pointRadius: 3
        })
      }

      if (data.hasB) {
        datasets.push({
          label: '기준선B',
          data: data.valuesB,
          backgroundColor: 'rgba(231, 76, 60, 0.1)',
          borderColor: '#e74c3c',
          borderWidth: 2,
          borderDash: [3, 3],
          pointBackgroundColor: '#e74c3c',
          pointRadius: 3
        })
      }

      this.radarChart = new Chart(canvas, {
        type: 'radar',
        data: {
          labels: data.labels,
          datasets: datasets
        },
        options: {
          scales: {
            r: {
              min: 0,
              max: 100,
              ticks: { stepSize: 20, font: { size: 11 } },
              pointLabels: { font: { size: 12 } }
            }
          },
          plugins: {
            legend: { display: data.hasA || data.hasB }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.radar-wrap {
  max-width: 480px;
  margin: 20px auto;
}
</style>