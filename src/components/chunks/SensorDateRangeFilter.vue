<script>

import DatePicker from "./DatePicker.vue";

export default {
  name: "SensorDateRangeFilter",
  components: {DatePicker},
  emits: ['on-update-range'],
  data() {
    return {
      range: [null, null],
    }
  },
  watch: {
    range: {
      deep: true,
      handler(range) {
        if (range.indexOf(null) === -1) {
          this.onUpdateRange()
        }
      }
    }
  },
  created() {
    this.range = [
      this.$moment(Date.now()).add(-4, 'hour').toDate(),
      this.$moment(Date.now()).toDate(),
    ]
  },
  methods: {
    shiftRange({days, hours}) {
      if (this.range.indexOf(null) === -1) {
        this.range[0] = this.$moment(this.range[0])
            .add(days, 'days')
            .add(hours, 'hour')
            .toDate();
        this.range[1] = this.$moment(this.range[1])
            .add(days, 'days')
            .add(hours, 'hour')
            .toDate();
      }
    },
    onUpdateRange() {
      this.$emit('on-update-range', this.range);
      console.log('onUpdateRange', this.range);
    }
  }
}
</script>

<template>
  <VSheet class="d-inline-flex">
    <VBtn
      icon="mdi-arrow-left"
      density="comfortable"
      color="default"
      variant="text"
      @click="shiftRange({days:0, hours:-4})"
    />
    <VBtn
      icon="mdi-arrow-right"
      density="comfortable"
      color="default"
      variant="text"
      @click="shiftRange({days:0, hours:4})"
    />
    <DatePicker
      v-model="range"
      input-width="450"
    />
  </VSheet>
</template>

<style scoped>

</style>