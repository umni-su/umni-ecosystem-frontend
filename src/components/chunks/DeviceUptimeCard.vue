<script>
import microsecondsToUptime from '../../js/helpers/microsecondsToUptime.js'
import DeviceCardCharacteristicItem from './DeviceCardCharacteristicItem.vue'

export default {
  name: 'DeviceUptimeCard',
  components: {DeviceCardCharacteristicItem},
  computed: {
    device() {
      return this.$store.getters['getDevice']
    },
    uptime() {
      return microsecondsToUptime(this.device.uptime)
    },
    uptimeStr() {
      return `${this.uptime.d} ${this.$t('d')}. ${this.uptime.h} ${this.$t('h')}. ${this.uptime.h} ${this.$t('m')}.`
    },
    memoryUsage() {
      return 100 - (this.device?.free_heap * 100 / this.device.total_heap)
    },
    memoryColor() {
      if (this.memoryUsage < 50) return 'green'
      if (this.memoryUsage > 50 && this.memoryUsage < 75) return 'orange'
      if (this.memoryUsage > 75) return 'red'
      return 'grey'
    }
  }
}
</script>

<template>
  <VCard
    class="mb-8"
    :title="$t('System information')"
  >
    <template #append>
      <VBtn
        icon="mdi-sync"
        density="compact"
        color="primary"
        class="mr-2"
        variant="plain"
      />
      <VBtn
        icon="mdi-update"
        density="compact"
        color="default"
        variant="plain"
        class="mr-2"
      />
      <VBtn
        icon="mdi-restart"
        density="compact"
        variant="plain"
        color="red"
      />
    </template>
    <template #text>
      <DeviceCardCharacteristicItem
        class="mb-2"
        icon="mdi-timer"
        :title="$t('Uptime')"
        :value="uptimeStr"
      />
      <DeviceCardCharacteristicItem
        icon="mdi-memory"
        :title="$t('Memory')"
      >
        <template #value>
          <div class="d-flex align-center justify-between">
            <VProgressLinear
              :color="memoryColor"
              :model-value="memoryUsage.toFixed(2)"
            />
            <div class="text-subtitle-2 ml-4 font-weight-bold opacity-50">
              {{ memoryUsage.toFixed(2) }}%
            </div>
          </div>
        </template>
      </DeviceCardCharacteristicItem>
    </template>
  </VCard>
</template>

<style scoped>

</style>