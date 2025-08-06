<script>
import * as echarts from 'echarts'
import {markRaw} from 'vue'
import SensorDateRangeFilter from '../SensorDateRangeFilter.vue'
import {createErrorNotification} from '../../../js/helpers/notificationHelper.js'
import {SENSOR_GROUP, SENSOR_TEXT} from '../../../js/helpers/sensorGroups.js'
import ModalDialog from '../ModalDialog.vue'

export default {
  name: 'DeviceActiveSensor',
  components: {
    ModalDialog,
    SensorDateRangeFilter
  },
  data() {
    return {
      activeSensor: null,
      src: null,
      cover: null,
      open: false,
      edit: false,
      chart: null,
      filter: {
        range: null
      },
      options: {
        grid: {
          left: '50px',
          right: '50px',
          bottom: '30px',
          top: '30px'
        },
        dataZoom: [
          {
            id: 'dataZoomX',
            type: 'inside'
          },
          {
            id: 'dataZoomY',
            type: 'inside'
          }
        ],
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'time'
        },
        yAxis: {
          type: 'value',
          scale: true
        },
        series: []
      }
    }
  },
  computed: {
    loading() {
      return this.$store.getters['isLoading']
    },
    device() {
      return this.$store.getters['getDevice']
    },
    sensor() {
      return this.$store.getters['getActiveSensor']
    },
    title() {
      return this.sensor?.visible_name !== null ? this.sensor?.visible_name?.toUpperCase() : this.sensor?.name?.toUpperCase()
    },
    typeText() {
      let t = 'Unknown'
      switch (this.sensor.type) {
      case SENSOR_GROUP.SENSOR_RF433:
        t = SENSOR_TEXT.SENSOR_RF433
        break
      case SENSOR_GROUP.SENSOR_ADC:
        t = SENSOR_TEXT.SENSOR_ADC
        break
      case SENSOR_GROUP.SENSOR_NTC:
        t = SENSOR_TEXT.SENSOR_NTC
        break
      case  SENSOR_GROUP.SENSOR_INPUTS:
        t = SENSOR_TEXT.SENSOR_INPUTS
        break
      case  SENSOR_GROUP.SENSOR_RELAYS:
        t = SENSOR_TEXT.SENSOR_RELAYS
        break
      case SENSOR_GROUP.SENSOR_DS18B20:
        t = SENSOR_TEXT.SENSOR_DS18B20
        break
      case SENSOR_GROUP.SENSOR_OPENTHERM:
        t = SENSOR_TEXT.SENSOR_OPENTHERM
        break
      }

      return this.$t(t)
    }
  },
  watch: {
    sensor: {
      deep: true,
      handler(s) {
        this.activeSensor = s
        this.open = this.activeSensor !== null
      }
    },
    open() {
      if (!this.open) {
        this.$store.commit('setActiveSensor', null)
        this.src = null
      } else {
        if (this.sensor.photo !== null) {
          this.src = this.getCover()
        }
        this.$nextTick(() => {
          this.chart = markRaw(echarts.init(this.$refs.chart.$el))
          window.addEventListener('resize', this.resize)
          this.getSensorHistory().then(() => {
            this.chart.setOption(this.options)
          })
        })
      }
    }
  },
  unmounted() {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    resize() {
      this.chart.resize()
    },
    async getSensorHistory() {
      if (this.filter.range === null) {
        return false
      }
      this.options.series = await this.$store.dispatch('getSensorHistory',
        {
          ...{
            id: this.sensor.id
          },
          ...this.filter
        }
      ).catch(e => {
        this.$store.commit('addNotification', createErrorNotification(e.response.data.message))
      })
      this.chart.setOption(this.options)
    },
    async onUpdateRange(e) {
      if (this.$refs.chart !== null && this.$refs.chart !== undefined) {
        if (e.indexOf(null) === -1) {
          this.filter.range = e
          await this.getSensorHistory()
        }
      }
    },
    async saveSensor() {
      const data = {
        id: this.activeSensor.id,
        name: this.activeSensor.visible_name,
        cover: this.cover
      }
      if (await this.$store.dispatch('updateSensor', data)) {
        this.edit = false
      }
    },
    async getCover() {
      this.src = await this.$store.dispatch('getDeviceSensorCover', {id: this.sensor.id, width: 200})
    }
  }
}
</script>

<template>
  <VBottomSheet
    v-model="open"
  >
    <VCard
      v-if="sensor"
      :loading="loading"
      rounded="0"
    >
      <VCardTitle class="pl-6 bg-primary d-flex align-center justify-space-between">
        <div class="text-h6">
          {{ title }}
        </div>
        <div>
          <VChip
            :text="typeText"
            inline
          />
          <VBtn
            class="ml-2"
            color="default"
            icon="mdi-fullscreen"
            variant="text"
            density="comfortable"
          />
        </div>
      </VCardTitle>
      <VCardTitle class="d-flex align-center justify-space-between overflow-visible">
        <div class="d-flex align-center justify-space-between">
          <VImg
            v-if="src !== null"
            rounded="pill"
            class="mr-2"
            :src="src"
            cover
            :width="40"
            :height="40"
            inline
          />
          <SensorDateRangeFilter
            v-if="chart"
            @on-update-range="onUpdateRange"
          />
        </div>
        <VBtnGroup
          variant="plain"
          density="comfortable"
        >
          <VBtn
            icon="mdi-pencil"
            @click="edit = true"
          />
          <VBtn
            icon="mdi-trash-can"
            color="red"
          />
        </VBtnGroup>
      </VCardTitle>
      <VCardText>
        <VSheet
          ref="chart"
          class="mt-6"
          height="400"
        />
      </VCardText>
    </VCard>
    <ModalDialog
      v-model="edit"
      :title="$t('Sensor editing')"
    >
      <VTextField
        v-model="activeSensor.visible_name"
        :label="$t('Name')"
      />
      <VFileInput
        v-model="cover"
        class="mt-4"
        prepend-inner-icon="mdi-image"
        prepend-icon=""
        :label="$t('Upload cover')"
      />
      <template #actions>
        <VBtn
          :text="$t('Save')"
          prepend-icon="mdi-content-save"
          @click="saveSensor"
        />
      </template>
    </ModalDialog>
  </VBottomSheet>
</template>

<style scoped>

</style>