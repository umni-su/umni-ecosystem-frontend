<script>
export default {
  name: 'DeviceSensorSelect',
  props: {
    modelValue: {
      type: Array
    }
  },
  emits: [
    'update:model-value',
    'on-select-sensor'
  ],
  data() {
    return {
      selected: []
    }
  },
  computed: {
    activeDevice() {
      return this.$store.getters['devices/getDevice']
    },
    filteredSensors() {
      return this.activeDevice?.sensors?.filter(sensor => {
        return this.selected.indexOf(sensor.id) === -1
      })
    }
  },
  watch: {
    modelValue: {
      deep: true,
      handler(v) {
        this.selected = v
      }
    },
    selected: {
      deep: true,
      handler(v) {
        this.$emit('update:model-value', v)
      }
    }
  },
  mounted() {
    this.selected = this.modelValue
  },
  methods: {
    onSelectSensor(sensor) {
      if (this.selected.indexOf(sensor.id) === -1) {
        this.selected.push(sensor.id)
      } else {
        this.selected = this.selected.filter(item => item.id !== sensor.id)
      }
      this.$emit('on-select-sensor', sensor)

    }
  }
}
</script>

<template>
  <VList
    v-if="filteredSensors.length > 0"
    max-height="350"
  >
    <VListItem
      v-for="sensor in filteredSensors"
      :key="sensor.id"
      @click="onSelectSensor(sensor)"
    >
      <VListItemTitle>
        {{ sensor.name }}
      </VListItemTitle>
    </VListItem>
  </VList>
</template>

<style scoped>

</style>