<script>
import DeviceCardItem from "../../../components/chunks/DeviceCardItem.vue";

export default {
  name: 'DevicesPage',
  components: {
    DeviceCardItem
  },
  computed: {
    devices() {
      return this.$store.getters['getDevices']
    }
  },
  async mounted() {
    this.$store.commit('setTitle', this.$t('Devices'))
    await this.getDevices()
  },
  methods: {
    async getDevices() {
      await this.$store.dispatch('getDevices')
    }
  }
}
</script>

<template>
  <VContainer
    v-if="devices.length > 0"
    fluid
  >
    <VRow>
      <DeviceCardItem
        v-for="device in devices"
        :key="device.id"
        :device="device"
        @click="$router.push({name: 'device', params: {id:device.id}})"
      />
    </VRow>
  </VContainer>
</template>

<style scoped>

</style>
