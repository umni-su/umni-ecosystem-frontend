<script>
import DeviceSensor from "./DeviceListItemSensor.vue";

export default {
  name: "DeviceSensors",
  components: {
    DeviceSensor
  },
  props: {
    modelValue: {
      type: Object,
      required: true
    }
  },
  emits: ['update:model-value'],
  data() {
    return {
      open: true,
      sensors: []
    }
  },
  watch: {
    sensors() {
      this.$emit('update:model-value', this.sensors)
    }
  },
  mounted() {
    this.sensors = this.modelValue
  }
}
</script>

<template>
  <VSheet>
    <VCardTitle class="text-subtitle-1">
      <VBtn
        :icon="open ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        variant="tonal"
        class="mr-4"
        density="compact"
        @click="open = !open"
      />
      {{ $t($.vnode.key) }}
    </VCardTitle>
    <VContainer
      v-if="open"
      no-gutters
    >
      <VRow>
        <VCol
          v-for="(sensor, index) in sensors"
          :key="sensor.id"
          cols="12"
          :md="sensors.length % 3 === 0 ? 4 : 6"
          sm="6"
        >
          <DeviceSensor v-model="sensors[index]" />
        </VCol>
      </VRow>
    </VContainer>
  </VSheet>
</template>

<style scoped>

</style>
