<script>
import DeviceInfoCard from "../../chunks/device/DeviceInfoCard.vue";
import DeviceNetworkInfoCard from "../../chunks/device/DeviceNetworkInfoCard.vue";
import DeviceInfoSensorsCard from "../../chunks/device/DeviceInfoSensorsCard.vue";
import DeviceActiveSensor from "../../chunks/device/DeviceActiveSensor.vue";

export default {
  name: "DevicePage",
  components: {
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
  },
  async mounted() {
    await this.getDevice()
    this.$store.commit('setTitle', this.$t('Device: {name}', {name: this.name}))
  },
  methods: {
    async getDevice() {
      await this.$store.dispatch('getDevice', this.id)
      this.$store.commit('setTitle', this.$t('Devices'))
    },
  }
}
</script>

<template>
  <VSheet
    v-if="device"
    class="ma-auto"
    max-width="1200"
    color="transparent"
  >
    <VContainer fluid>
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <DeviceInfoCard />
          <DeviceNetworkInfoCard />
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <DeviceInfoSensorsCard />
        </VCol>
      </VRow>
    </VContainer>
    <DeviceActiveSensor />
  </VSheet>
</template>

<style scoped lang="scss">

</style>
