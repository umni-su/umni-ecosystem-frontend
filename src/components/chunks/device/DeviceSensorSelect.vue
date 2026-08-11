<script>
export default {
  name: 'DeviceSensorSelect',
  props: {
    modelValue: {
      type: Number
    }
  },
  data() {
    return {
      params: {
        page: 1,
        size: 25,
        term: null
      },
      sensorsPaginated: []
    }
  },
  async mounted() {
    await this.getSensors()
  },
  methods: {
    async getSensors() {
      const res = await this.$store.dispatch('sensors/getSensors', this.params)
      if (res) {
        this.sensorsPaginated = res
      }
    }
  }
}
</script>

<template>
  {{ res }}
</template>

<style scoped>

</style>