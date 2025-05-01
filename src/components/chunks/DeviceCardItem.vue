<script>
import {mapType} from "../../js/helpers/mapDeviceType.js";
import DeviceCardCharacteristicItem from "./DeviceCardCharacteristicItem.vue";
import DeviceCardNetworkItem from "./DeviceCardNetworkItem.vue";

export default {
  name: "DeviceCardItem",
  components: {
    DeviceCardNetworkItem,
    DeviceCardCharacteristicItem
  },
  props: {
    device: {
      type: Object,
      required: true
    }
  },
  computed: {
    deviceCount() {
      return this.$store.getters['getDevices'].length
    },
    typeStr() {
      return this.$t(mapType(this.device.type))
    },
    format() {
      return this.$store.getters['getDateTimeFormat']
    },
    lastSync() {
      return this.$moment(this.device.last_sync).format(this.format)
    },
    name() {
      return this.device.title ? this.device.title : this.device.name
    }
  },
}
</script>

<template>
  <VCol
    :md="deviceCount % 3 === 0 ? 4 : 6"
    :sm="12"
  >
    <VCard
      variant="elevated"
      hover
    >
      <template
        v-if="device.cover"
        #image
      >
        <VImg
          rounded="0"
          :src="`/panel/devices/${device.id}/cover/${device.cover}`"
          cover
          height="200"
          class="opacity-20"
        />
      </template>
      <template #title>
        {{ name.toUpperCase() }}
      </template>
      <template #append>
        <VChip
          density="compact"
          color="primary"
          variant="tonal"
        >
          {{ typeStr }}
        </VChip>
      </template>
      <template #text>
        <DeviceCardCharacteristicItem
          icon="mdi-clock"
          :title="$t('Last sync')"
          :value="lastSync"
        />
        <DeviceCardNetworkItem
          v-for="netif in device.network_interfaces"
          :key="netif.id"
          class="mt-2"
          :adapter="netif"
        />
        <DeviceCardCharacteristicItem
          class="mt-2"
          icon="mdi-dip-switch"
          :title="$t('Sensors')"
          :value="`${device.sensors_count}`"
        />
      </template>
    </VCard>
  </VCol>
</template>

<style scoped lang="scss">

</style>
