<script>
import DeviceInfoCard from '../../chunks/device/DeviceInfoCard.vue'
import DeviceNetworkInfoCard from '../../chunks/device/DeviceNetworkInfoCard.vue'
import DeviceInfoSensorsCard from '../../chunks/device/DeviceInfoSensorsCard.vue'
import DeviceActiveSensor from '../../chunks/device/DeviceActiveSensor.vue'
import DeviceUptimeCard from '../../chunks/DeviceUptimeCard.vue'

export default {
  name: 'DevicePage',
  components: {
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
      cover: null,
      handler: null,
      deviceModel: undefined
    }
  },
  computed: {
    device() {
      return this.$store.getters['getDevice']
    },
    name() {
      return this.device.title ? this.device.title : this.device.name.toUpperCase()
    },
    type() {
      return this.device.type
    },
    online() {
      return this.device.online
    },
    interval() {
      return this.$store.getters['getInterval']
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
      await this.getDevice()
    }, this.interval)
  },
  unmounted() {
    clearInterval(this.handler)
    this.$store.commit('setDevice', null)
  },
  methods: {
    async getDevice() {
      await this.$store.dispatch('getDevice', this.id)
      this.$store.commit('setTitle', this.$t('Device: {name}', {name: this.name}))
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
    <VContainer fluid>
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
          <DeviceInfoCard :device="deviceModel" />
          <DeviceNetworkInfoCard :device="deviceModel" />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <DeviceUptimeCard @refresh-device="getDevice" />
          <DeviceInfoSensorsCard :device="deviceModel" />
        </VCol>
      </VRow>
    </VContainer>
    <DeviceActiveSensor />
  </VSheet>
</template>

<style scoped lang="scss">

</style>
