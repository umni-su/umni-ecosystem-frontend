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
  mounted() {
    this.selected = this.modelValue
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
  }
}
</script>

<template>
  <VAutocomplete
    v-if="activeDevice.sensors.length > 0"
    v-model="selected"
    :items="activeDevice.sensors"
    return-object
    multiple
    chips
    closable-chips
    item-title="visible_name"
    item-value="id"
    clearable
  />

</template>

<style scoped>

</style>