<script>
import {markRaw} from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'SystemInfoSparkline',
  data(){
    return {
      chart: null,
      options: {
        tooltip: null,
        grid: {
          left: '50px',
          right: '10px',
          bottom: '20px',
          top: '10px'
        },
        dataZoom: [
          {
            id: 'dataZoomX',
            type: 'inside'
          }
        ],
        xAxis: {
          type: 'category',
          show:false
        },
        yAxis: {
          min:0,
          max: 100,
          type: 'value'
        },
        series: [{
          data: []
        }]
      }
    }
  },
  props: {
    values: {
      type: Array,
      required: true
    },
    height: {
      type: Number,
      default: 100
    },
    title: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: 'rgba(0,0,0,0.1)'
    },
    gradient: {
      type: Array[String],
      default: ['rgba(244,47,54,1)', 'rgba(251,140,0,1)', 'rgba(76,175,80,1)']
    }
  },
  computed: {
    appTheme(){
      return this.$store.getters['getTheme']
    },
    chartOptions() {
      return this.$store.getters['getChartOptions']
    }
  },
  created(){
    this.options = {...this.chartOptions,...this.options}
    this.initChart()
  },
  unmounted() {
    window.removeEventListener('resize', this.resize)
  },
  watch:{
    appTheme(){
      this.chart?.setTheme(this.appTheme === 'dark' ? 'dark' : 'default')
    },
    values: {
      deep: true,
      handler(values){
        this.options.series.data = values
        this.chart?.setOption(this.options)
      }
    }
  },
  methods:{
    resize() {
      this.chart.resize()
    },
    initChart(){
      this.$nextTick(() => {
        this.chart = markRaw(echarts.init(this.$refs.chart.$el))
        window.addEventListener('resize', this.resize)
        this.options.series = {
          type: 'line',
          symbol: 'none',
          areaStyle: {},
          data: this.values
        }
        this.chart.setOption(this.options)
        this.chart.setTheme(this.appTheme)
      })
    }
  }
}
</script>

<template>
  <VCard
    variant="text"
    elevation="0"
    class="position-relative"
  >
    <template #title>
      {{ title }}
    </template>
    <template #append>
      <slot
        v-if="values !== undefined"
        name="value"
      >
        {{ values[values.length - 1] }}%
      </slot>
    </template>
    <VSheet
      ref="chart"
      height="170"
    />
  </VCard>
</template>

<style lang="scss" scoped>
</style>