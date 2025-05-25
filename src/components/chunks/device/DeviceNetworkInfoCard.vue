<script>
import DeviceCardCharacteristicItem from "../DeviceCardCharacteristicItem.vue";

export default {
  name: "DeviceNetworkInfoCard",
  components: {
    DeviceCardCharacteristicItem
  },
  props: {
    device: {
      type: Object,
      required: true
    }
  },
  computed: {
    network() {
      return this.device.network_interfaces
    },
  },
  methods: {
    url(ip) {
      return `http://${ip}/`
    }
  }
}
</script>

<template>
  <VCard
    v-if="device"
    class="mt-8"
  >
    <template #title>
      {{ $t('Network interfaces') }}
    </template>
    <template
      #text
    >
      <VSheet
        v-for="(net, index) in network"
        :key="net.id"
      >
        <DeviceCardCharacteristicItem
          class="py-1"
          icon="mdi-circle-medium"
          :title="$t('Name')"
          :value="net.name"
        />
        <DeviceCardCharacteristicItem
          class="py-1"
          icon="mdi-circle-medium"
          :title="$t('IP address')"
        >
          <template #value>
            <VBtn
              variant="text"
              :href="url(net.ip)"
              target="_blank"
              class="px-1"
              density="compact"
              append-icon="mdi-open-in-new"
              :text="net.ip"
            />
          </template>
        </DeviceCardCharacteristicItem>
        <DeviceCardCharacteristicItem
          class="py-1"
          icon="mdi-circle-medium"
          :title="$t('MAC address')"
          :value="net.mac.toUpperCase()"
        />
        <DeviceCardCharacteristicItem
          class="py-1"
          icon="mdi-circle-medium"
          :title="$t('Netmask')"
          :value="net.mask"
        />
        <DeviceCardCharacteristicItem
          class="py-1"
          icon="mdi-circle-medium"
          :title="$t('Gateway')"
          :value="net.gw"
        />
        <VDivider
          v-if="index !== network.length - 1"
          class="my-4"
        />
      </VSheet>
    </template>
  </VCard>
</template>

<style scoped>

</style>