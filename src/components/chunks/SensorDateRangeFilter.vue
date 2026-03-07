<script>
import DateRangePicker from './DateRangePicker.vue'

export default {
  name: 'SensorDateRangeFilter',
  components: {DateRangePicker},
  emits: ['on-update-range'],

  data() {
    return {
      range: [
        this.$moment().add(-4, 'hours').format('YYYY-MM-DD HH:mm'),
        this.$moment().format('YYYY-MM-DD HH:mm')
      ]
    }
  },

  watch: {
    // Следим за изменениями range и автоматически эмитим событие
    range: {
      deep: true,
      handler(newRange) {
        if (newRange[0] && newRange[1]) {
          console.log('Range updated:', newRange)
          this.$emit('on-update-range', [...newRange])
        }
      }
    }
  },

  methods: {
    shiftRange({days, hours}) {
      if (this.range[0] && this.range[1]) {
        const start = this.$moment(this.range[0])
          .add(days, 'days')
          .add(hours, 'hours')
          .format('YYYY-MM-DD HH:mm')

        const end = this.$moment(this.range[1])
          .add(days, 'days')
          .add(hours, 'hours')
          .format('YYYY-MM-DD HH:mm')

        this.range = [start, end]
      }
    }
  }
}
</script>

<template>
  <VSheet class="d-inline-flex align-center gap-1">
    <VBtn
      icon="mdi-arrow-left"
      density="comfortable"
      color="default"
      variant="text"
      @click="shiftRange({days:0, hours:-4})"
    />

    <DateRangePicker
      v-model="range"
    />

    <VBtn
      icon="mdi-arrow-right"
      density="comfortable"
      color="default"
      variant="text"
      @click="shiftRange({days:0, hours:4})"
    />
  </VSheet>
</template>