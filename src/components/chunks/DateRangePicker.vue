<script>
import DatePicker from './DatePicker.vue'

export default {
  name: 'DateRangePicker',
  components: {
    DatePicker
  },
  props: {
    modelValue: {
      type: Array,
      default: () => [null, null]
    }
  },
  emits: ['update:model-value'],

  data() {
    return {
      internalStart: this.modelValue[0],
      internalEnd: this.modelValue[1]
    }
  },

  watch: {
    modelValue: {
      immediate: true,
      handler(val) {
        this.internalStart = val?.[0] || null
        this.internalEnd = val?.[1] || null
      }
    },

    internalStart(newStart) {
      this.$emit('update:model-value', [newStart, this.internalEnd])
    },

    internalEnd(newEnd) {
      this.$emit('update:model-value', [this.internalStart, newEnd])
    }
  }
}
</script>

<template>
  <VSheet class="d-flex align-center gap-2">
    <DatePicker
      v-model="internalStart"
      :label="$t('Start')"
    />
    <VIcon icon="mdi-chevron-right"/>
    <DatePicker
      v-model="internalEnd"
      :label="$t('End')"
    />
  </VSheet>
</template>