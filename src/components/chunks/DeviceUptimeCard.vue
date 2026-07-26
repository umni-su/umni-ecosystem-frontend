<script>
import microsecondsToUptime from '../../js/helpers/microsecondsToUptime.js'
import DeviceCardCharacteristicItem from './DeviceCardCharacteristicItem.vue'
import {createSuccessNotification} from '../../js/helpers/notificationHelper.js'

export default {
  name: 'DeviceUptimeCard',
  components: {DeviceCardCharacteristicItem},
  emits: ['refresh-device'],
  data() {
    return {
      disabled: false
    }
  },
  computed: {
    device() {
      return this.$store.getters['devices/getDevice']
    },
    uptime() {
      return microsecondsToUptime(this.device.uptime)
    },
    online() {
      return this.device?.online
    },
    memoryUsage() {
      return 100 - (this.device?.free_heap * 100 / this.device.total_heap)
    },
    memoryColor() {
      if (this.memoryUsage <= 50) return 'green'
      if (this.memoryUsage > 50 && this.memoryUsage < 75) return 'orange'
      if (this.memoryUsage > 75) return 'red'
      return 'grey'
    }
  },
  methods: {
    async locateDevice() {
      this.disabled = true
      const success = await this.$store.dispatch('devices/locateDevice', this.device.id).finally(() => {
        this.disabled = false
      })
      if (success) {
        this.$store.commit('addNotification', createSuccessNotification(this.$t('Success')))
      }
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
        @click="$emit('refresh-device')"
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
        icon="mdi-power"
        :title="$t('Status')"
      >
        <template #value>
          <VChip
            :color="online ? 'green' : 'red'"
            rounded="pill"
            density="comfortable"
            prepend-icon="mdi-circle"
            :text="online ? $t('Online') : $t('Offline')"
          />
        </template>
      </DeviceCardCharacteristicItem>
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
    <template #actions>
      <VBtn
        density="comfortable"
        rounded="pill"
        color="success"
        variant="tonal"
        :text="$t('Locate')"
        :loading="disabled"
        :disabled="disabled"
        prepend-icon="mdi-map-marker"
        @click="locateDevice"
      />
    </template>
  </VCard>
</template>

<style scoped>

</style>