<script>

import DeviceSensorValue from './device/DeviceSensorValue.vue'

export default {
  name: 'DeviceListItemSensor',
  components: {DeviceSensorValue},
  props: {
    modelValue: {
      type: Object,
      required: true
    }
  },
  emits: ['update:model-value'],
  data() {
    return {
      sensor: null,
      src: null
    }
  },
  computed: {
    disabled() {
      return !this.sensor.active
    },
    value() {
      return this.sensor.value

    },
    color() {
      return 'default'
    },
    icon() {
      return this.sensor.icon ?? 'mdi-help-circle'
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
    }
  },
  async mounted() {
    this.sensor = this.modelValue
    // if (this.modelValue.type === SENSOR_GROUP.SENSOR_INPUTS || this.modelValue.type === SENSOR_GROUP.SENSOR_RELAYS) {
    //   this.sensor.value = parseInt(this.modelValue.value)
    // }
    if (this.hasCover) {
      await this.getCover()
    }
  },
  methods: {
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
    rounded="pill"
    :value="modelValue"
    :class="disabled ? 'opacity-50' : ''"
    class="pl-1"
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
      #{{ sensor.capability }}.{{ sensor.identifier }}
    </template>

    <template #append>
      <DeviceSensorValue
        v-model="sensor.value"
        :sensor="sensor"
      />
    </template>
  </VListItem>
</template>

<style scoped>

</style>
