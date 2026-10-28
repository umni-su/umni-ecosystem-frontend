<script>
import DeviceInfoCard from '../../chunks/device/DeviceInfoCard.vue'
import DeviceNetworkInfoCard from '../../chunks/device/DeviceNetworkInfoCard.vue'
import DeviceInfoSensorsCard from '../../chunks/device/DeviceInfoSensorsCard.vue'
import DeviceActiveSensor from '../../chunks/device/DeviceActiveSensor.vue'
import DeviceUptimeCard from '../../chunks/device/DeviceUptimeCard.vue'
import PageActions from '../../chunks/PageActions.vue'
import WidgetCard from '../../chunks/widgets/WidgetCard.vue'
import Draggable from 'vuedraggable'
import ConfirmationDialog from '../../chunks/ConfirmationDialog.vue'

export default {
  name: 'DevicePage',
  components: {
    ConfirmationDialog,
    WidgetCard,
    PageActions,
    DeviceUptimeCard,
    DeviceActiveSensor,
    DeviceInfoSensorsCard,
    DeviceNetworkInfoCard,
    DeviceInfoCard,
    Draggable
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
      loading: false,
      widgetsOrder: []
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
      const list = this.widgetsOrder.length ? this.widgetsOrder : this.widgets
      return list.map(widget => {
        return {
          ...widget,
          items: (widget.items || []).map(item => {
            return {
              ...item,
              entity: this.device?.sensors?.find(sensor => {
                return sensor.id === item.entity_id
              })
            }
          })
        }
      })
    },
    widgetsList: {
      get() {
        return this.widgetsWithSensors
      },
      set(val) {
        this.widgetsOrder = val
      }
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
    },
    widgets: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val || !val.length) {
          this.widgetsOrder = []
          return
        }
        const currentIds = this.widgetsOrder.map(w => w.id)
        const newIds = val.map(w => w.id)
        if (currentIds.length !== newIds.length) {
          this.widgetsOrder = JSON.parse(JSON.stringify(val))
          return
        }
        const same = currentIds.every((id, idx) => id === newIds[idx])
        if (!same || !this.widgetsOrder.length) {
          this.widgetsOrder = JSON.parse(JSON.stringify(val))
          return
        }
        this.widgetsOrder = this.widgetsOrder.map(w => {
          const fresh = val.find(v => v.id === w.id)
          if (fresh) {
            return JSON.parse(JSON.stringify(fresh))
          }
          return w
        })
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
        await this.getWidgets(),
        await this.$store.dispatch('devices/getDevice', this.id).finally(() => {
          this.loading = false
        })
      ])
      this.$store.commit('setTitle', this.$t('Device: {name}', {name: this.name}))
    },
    async getWidgets() {
      if (!this.id) return false
      await this.$store.dispatch('widgets/getWidgets', {
        entity_id: this.id,
        type: 'DEVICE'
      })
    },
    addWidget() {
      this.add = true
    },
    onCreateWidget() {
      this.add = false
    },
    async onWidgetsSort() {
      if (!this.widgetsOrder.length) return
      const updates = this.widgetsOrder.map((widget, index) => {
        return this.$store.dispatch('widgets/updateWidgetSort', {
          id: widget.id,
          sort_order: index
        })
      })
      await Promise.allSettled(updates)
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
          @on-create="onCreateWidget"
          @on-delete="add = false"
        />
      </VRow>
      <Draggable
        v-if="widgetsList.length"
        v-model="widgetsList"
        item-key="id"
        tag="div"
        class="v-row v-row--density-default"
        handle=".widget-drag-handle"
        :animation="150"
        @end="onWidgetsSort"
      >
        <template #item="{element}">
          <WidgetCard
            :key="element.id"
            type="DEVICE"
            :widget="element"
            :entity="device"
          />
        </template>
      </Draggable>
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
