<script>
import DeviceCardCharacteristicItem from './DeviceCardCharacteristicItem.vue'

export default {
  name: 'DeviceCardNetworkItem',
  components: {
    DeviceCardCharacteristicItem
  },
  props: {
    adapter: {
      type: Object,
      required: true
    }
  }
}
</script>

<template>
  <DeviceCardCharacteristicItem
    :icon="adapter.name === 'Ethernet' ? 'mdi-ethernet' : 'mdi-wifi'"
    :title="adapter.name"
    :value="adapter.ip"
  />
</template>

<style scoped>

</style>
