<script>
export default {
  name: 'DeviceSensorSelect',
  emits: ['update:model-value'],
  computed: {
    activeDevice() {
      return this.$store.getters['devices/getDevice']
    }
  },
  props: {
    modelValue: {
      type: Array
    }
  },
  data() {
    return {
      selected: [],
      params: {
        page: 1,
        size: 25,
        term: null
      },
      sensorsPaginated: []
    }
  },
  watch: {},
  mounted() {
    if (this.modelValue?.length > 0) {
      this.selected = this.modelValue
    }
  },
  methods: {
    chooseSensor() {
      this.$emit('update:model-value', this.selected)
    }
  }
}
</script>

<template>
  <VList
    v-if="activeDevice.sensors.length > 0"
    v-model:selected="selected"
    return-object
    selectable
    select-strategy="leaf"
    min-width="370"
    max-height="300"
    item-value="id"
    clearable
    @update:selected="chooseSensor"
  >
    <VListItem
      v-for="sensor in activeDevice.sensors"
      :key="sensor.id"
      :value="sensor"
    >
      <template #title>{{ sensor.name }}</template>
      <template #append>
        <VChip
          :text="sensor.capability"
          color="primary"
          density="comfortable"
        />
      </template>
    </VListItem>
  </VList>
</template>

<style scoped>

</style>