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
      sensor: null,
      src: null
    }
  },
  computed: {
    icon() {
      let icon = 'mdi-help-circle'
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
    hasCover() {
      return this.sensor.photo !== null
    },
    name() {
      if (this.sensor.visible_name !== null) {
        return this.sensor.visible_name
      } else {
        return this.sensor?.name !== null ? this.sensor?.name : this.$t('No name')
      }
    }
  },
  watch: {
    sensor() {
      this.$emit('update:model-value', this.sensor)
    },
  },
  async mounted() {
    this.sensor = this.modelValue
    if (this.modelValue.type === SENSOR_GROUP.SENSOR_INPUTS || this.modelValue.type === SENSOR_GROUP.SENSOR_RELAYS) {
      this.sensor.value = parseInt(this.modelValue.value)
    }
    if (this.hasCover) {
      await this.getCover()
    }
  },
  methods: {
    async changeRelayState(e) {
      await this.$store.dispatch('setRelayState', {
        id: this.sensor.id,
        value: e.target.checked ? 1 : 0
      })
    },
    async getCover() {
      this.src = await this.$store.dispatch('getDeviceSensorCover', {id: this.sensor.id, width: 200})
    }
  }
}
</script>

<template>
  <VListItem
    v-if="sensor"
    density="compact"
    variant="text"
    rounded="lg"
    :value="modelValue"
    :class="disabled ? 'opacity-50' : ''"
    color="primary"
  >
    <template #prepend>
      <VAvatar
        v-if="src !== null"
        :image="src"
        rounded="pill"
      />
      <VAvatar
        v-else
        variant="tonal"
        rounded="pill"
        color="primary"
        :icon="icon"
      />
    </template>
    <template
      #title
    >
      <div class="text-subtitle-2">
        {{ name }}
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
        @click.stop="changeRelayState"
      />
      <VBtn
        v-else
        readonly
        class="text-center"
        variant="text"
        color="default"
        :text="value"
      />
    </template>
  </VListItem>
</template>

<style scoped>

</style>
