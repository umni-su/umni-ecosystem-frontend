<script>
export default {
  name: 'DatePicker',
  props: {
    modelValue: {
      type: String,
      default: null
    }
  },
  emits: ['update:model-value'],

  data() {
    return {
      internalDate: null,
      internalTime: '00:00'
    }
  },

  watch: {
    modelValue: {
      immediate: true,
      handler(val) {
        if (val) {
          const momentDate = this.$moment(val)
          this.internalDate = momentDate.isValid() ? momentDate.toDate() : null
          this.internalTime = momentDate.isValid() ? momentDate.format('HH:mm') : '00:00'
        } else {
          this.internalDate = null
          this.internalTime = '00:00'
        }
      }
    },

    internalDate() {
      this.updateOutput()
    },

    internalTime() {
      this.updateOutput()
    }
  },

  methods: {
    updateOutput() {
      if (!this.internalDate) {
        this.$emit('update:model-value', null)
        return
      }

      const dateStr = this.$moment(this.internalDate).format('YYYY-MM-DD')
      const timeStr = this.internalTime || '00:00'
      this.$emit('update:model-value', `${dateStr} ${timeStr}`)
    }
  }
}
</script>

<template>
  <VDateInput
    v-model="internalDate"
    autocomplete="off"
    min-width="270"
  >
    <template #append-inner>
      <VMenu :close-on-content-click="false">
        <template #activator="{props}">
          <VBtn
            v-bind="props"
            density="comfortable"
            variant="tonal"
            prepend-icon="mdi-clock"
            :text="internalTime"
          />
        </template>
        <VSheet class="pa-4">
          <VTimePicker
            v-model="internalTime"
            hide-header
            hide-title
            format="24hr"
          />
        </VSheet>
      </VMenu>
    </template>
  </VDateInput>
</template>

<style scoped>
::v-deep(.v-input__prepend) {
  margin: 0;
}
</style>