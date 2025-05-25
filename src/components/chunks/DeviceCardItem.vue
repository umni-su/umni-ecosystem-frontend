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
  data() {
    return {
      src: null
    }
  },
  computed: {
    online() {
      return this.device.online
    },
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
  created() {
    if (this.device.photo !== null) {
      this.getCover()
    }
  },
  methods: {
    async getCover() {
      this.src = await this.$store.dispatch('getDeviceCover', this.device.id)
    }
  }
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
      <template #title>
        {{ name.toUpperCase() }}
      </template>
      <template #append>
        <VChip
          class="mr-2"
          density="compact"
          :color="online ? 'green' : 'red'"
          variant="tonal"
          :prepend-icon="online ? 'mdi-eye' : 'mdi-eye-off'"
          :text="online ? $t('Online') : $t('Offline')"
        />
        <VChip
          density="compact"
          color="primary"
          variant="tonal"
        >
          {{ typeStr }}
        </VChip>
        <VImg
          v-if="device.photo"
          rounded="pill"
          inline
          class="ml-2"
          cover
          :src="src"
          width="40"
          height="40"
        />
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
