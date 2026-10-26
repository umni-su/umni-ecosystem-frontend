<script>
import DeviceInfoCard from '../../chunks/device/DeviceInfoCard.vue'
import DeviceNetworkInfoCard from '../../chunks/device/DeviceNetworkInfoCard.vue'
import DeviceInfoSensorsCard from '../../chunks/device/DeviceInfoSensorsCard.vue'
import DeviceActiveSensor from '../../chunks/device/DeviceActiveSensor.vue'
import DeviceUptimeCard from '../../chunks/device/DeviceUptimeCard.vue'
import PageActions from '../../chunks/PageActions.vue'
import WidgetCard from '../../chunks/widgets/WidgetCard.vue'

export default {
  name: 'DevicePage',
  components: {
    WidgetCard,
    PageActions,
    DeviceUptimeCard,
    DeviceActiveSensor,
    DeviceInfoSensorsCard,
    DeviceNetworkInfoCard,
    DeviceInfoCard
  },
  props: {
    id: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      add: false,
      cover: null,
      handler: null,
      deviceModel: undefined,
      loading: false
    }
  },
  computed: {
    device() {
      return this.$store.getters['devices/getDevice']
    },
    name() {
      return this.device.title ? this.device.title : this.device.name.toUpperCase()
    },
    type() {
      return this.device.type
    },
    sensors() {
      return this.device?.sensors
    },
    online() {
      return this.device.online
    },
    interval() {
      return this.$store.getters['getInterval']
    },
    widgets() {
      return this.$store.getters['widgets/getWidgets']
    },
    widgetsWithSensors() {
      return this.widgets.map(widget => {
        return {
          ...widget,
          items: widget.items.map(item => {
            return {
              ...item,
              ...{
                entity: this.device.sensors.find(sensor => {
                  return sensor.id === item.entity_id
                })
              }
            }
          })
        }
      })
    }
  },
  watch: {
    device: {
      deep: true,
      handler(newVal) {
        if (newVal !== null && newVal !== undefined) {
          this.deviceModel = this.device
        }
      }
    }
  },
  async created() {
    await this.getDevice()
    this.handler = setInterval(async () => {
      if (this.loading) return
      await this.getDevice()
    }, this.interval)
  },
  unmounted() {
    clearInterval(this.handler)
    this.$store.commit('devices/setDevice', null)
  },
  methods: {
    async getDevice() {
      this.loading = true
      await Promise.all([
        await this.$store.dispatch('devices/getDevice', this.id).finally(() => {
          this.loading = false
        }),
        setTimeout(async () => {
          await this.getWidgets()
        }, 500)
      ])
      this.$store.commit('setTitle', this.$t('Device: {name}', {name: this.name}))
    },
    async getWidgets() {
      if (this.device === null || this.device?.id === null) return false
      await this.$store.dispatch('widgets/getWidgets', {
        entity_id: this.device.id,
        type: 'DEVICE'
      })
    },
    addWidget() {
      this.add = true
    },
    onDeleteWidget(widget) {
      if (widget?.id > 0) {
        console.log('Delete in db')
      }
      this.add = false
    },
    onCreateWidget(widget) {
      this.add = false
    }
  }
}
</script>

<template>
  <VSheet
    v-if="deviceModel"
    class="ma-auto"
    color="transparent"
  >
    <PageActions>
      <template #title>
        {{ name }}
      </template>
      <template #append>
        <VBtn
          :text="$t('Add widget')"
          variant="tonal"
          prepend-icon="mdi-plus"
          @click="addWidget"
        />
      </template>
    </PageActions>
    <VContainer fluid>
      <VRow v-if="add">
        <WidgetCard
          type="DEVICE"
          :entity="device"
          @on-delete="onDeleteWidget"
          @on-create="onCreateWidget"
        />
      </VRow>
      <VRow v-if="widgetsWithSensors">
        <WidgetCard
          v-for="widget in widgetsWithSensors"
          :key="widget.id"
          type="DEVICE"
          :widget="widget"
          :entity="device"
          @on-delete="onDeleteWidget"
        />
      </VRow>
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <VAlert
            v-if="!online"
            color="error"
            variant="tonal"
            class="mb-4"
            :text="$t('This device is probably disabled. Please check his condition.')"
          />
          <DeviceInfoCard :device="deviceModel"/>
          <DeviceNetworkInfoCard :device="deviceModel"/>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <DeviceInfoSensorsCard :device="deviceModel"/>
        </VCol>
      </VRow>
    </VContainer>
    <DeviceActiveSensor/>
  </VSheet>
</template>

<style scoped lang="scss">

</style>
