<script>
import {SENSOR_GROUP} from "../../js/helpers/sensorGroups.js";

export default {
  name: "DeviceListItemSensor",
  props: {
    modelValue: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:model-value'],
  data() {
    return {
      group: SENSOR_GROUP,
      sensor: null
    }
  },
  computed: {
    icon() {
      let icon = this.sensor.icon
      if (!icon) {
        switch (this.sensor.type) {
          case SENSOR_GROUP.SENSOR_RELAYS:
            icon = 'mdi-lightbulb';
            break
          case SENSOR_GROUP.SENSOR_INPUTS:
            icon = 'mdi-bell';
            break
          case SENSOR_GROUP.SENSOR_NTC :
          case SENSOR_GROUP.SENSOR_DS18B20:
            icon = 'mdi-thermometer'
            break
          case SENSOR_GROUP.SENSOR_ADC:
            icon = 'mdi-square-wave'
            break
          case SENSOR_GROUP.SENSOR_RF433:
            icon = 'mdi-access-point'
            break
        }
      }
      return icon
    },
    value() {
      switch (this.sensor.type) {
        case SENSOR_GROUP.SENSOR_NTC :
        case SENSOR_GROUP.SENSOR_DS18B20:
          return parseFloat(this.sensor.value).toFixed(2)
        default:
          return this.sensor.value
      }
    },
    color() {
      switch (this.sensor.type) {
        case SENSOR_GROUP.SENSOR_RELAYS:
          return parseInt(this.value) === 1 ? 'primary' : 'default'
        case SENSOR_GROUP.SENSOR_INPUTS:
          return parseInt(this.value) === 1 ? 'orange' : 'default'
      }
      return 'default'
    },
    message() {
      return this.$store.getters['getWsLastMessage']
    }
  },
  watch: {
    sensor() {
      this.$emit('update:model-value', this.sensor)
    },
    message() {
      if (this.message.type.startsWith('sensor.')) {
        if (this.message.message.id === this.sensor.id) {
          this.sensor = this.message.message
          console.log(this.message.message.value)
        }
      }
    }
  },
  created() {
    this.sensor = this.modelValue
    if (this.modelValue.type === SENSOR_GROUP.SENSOR_INPUTS || this.modelValue.type === SENSOR_GROUP.SENSOR_RELAYS) {
      this.sensor.value = parseInt(this.modelValue.value)
    }
  },
  methods: {
    async changeRelayState(e) {
      await this.$store.dispatch('setRelayState', {
        id: this.sensor.id,
        value: e.target.checked ? 1 : 0
      })
    }
  }
}
</script>

<template>
  <VListItem
    density="compact"
    variant="text"
    rounded="lg"
    :value="modelValue"
    :class="disabled ? 'opacity-50' : ''"
  >
    <template #prepend>
      <VIcon
        :icon="icon"
        size="large"
      />
    </template>
    <template
      #title
    >
      <div class="text-subtitle-2">
        {{ sensor.name !== null ? sensor.name : $t('No name') }}
      </div>
    </template>
    <template #subtitle>
      {{ sensor.identifier }}
    </template>

    <template #append>
      <VSwitch
        v-if="sensor.type === group.SENSOR_RELAYS"
        v-model="sensor.value"
        class="pa-0 mr-5"
        density="compact"
        value="1"
        :true-value="1"
        :false-value="0"
        @click="changeRelayState"
      />
      <VBtn
        v-else
        readonly
        class="text-center"
        variant="tonal"
        :text="value"
      />
    </template>
  </VListItem>
</template>

<style scoped>

</style>
