<script>
import DeviceCardItem from '../../../components/chunks/DeviceCardItem.vue'

export default {
  name: 'DevicesPage',
  components: {
    DeviceCardItem
  },
  computed: {
    devices() {
      return this.$store.getters['devices/getDevices']
    }
  },
  async mounted() {
    this.$store.commit('setTitle', this.$t('Devices'))
    await this.getDevices()
  },
  methods: {
    async getDevices() {
      await this.$store.dispatch('devices/getDevices')
    },
    triggerScanModal() {
      this.$store.commit('devices/setScanMode', true)
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
      <VCol cols="12">
        <VSpacer/>
        <VBtn
          :text="$t('Add device')"
          variant="elevated"
          prepend-icon="mdi-plus"
          color="primary"
          @click="triggerScanModal"
        />
      </VCol>
    </VRow>
    <VRow>
      <DeviceCardItem
        v-for="device in devices"
        :key="device.id"
        :device="device"
        @click="$router.push({name: 'device', params: {id:device.id}})"
      />
    </VRow>
  </VContainer>
  <VEmptyState v-else>
    <template #title>{{ $t('Empty') }}</template>
    <template #text>{{ $t('No devices available. Start a scan to find devices.') }}</template>
    <template #actions>
      <VBtn
        :text="$t('Scan')"
        variant="elevated"
        prepend-icon="mdi-magnify"
        color="primary"
        @click="triggerScanModal"
      />
    </template>
  </VEmptyState>
</template>

<style scoped>

</style>
