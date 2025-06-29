<script>
export default {
  name: "CameraRecordModeSelect",
  props: {
    modelValue: {
      type: Number,
      default: null
    }
  },
  emits: ['update:model-value'],
  data() {
    return {
      value: null,
      items: [
        {
          title: this.$t('Continuous video'),
          value: 1
        },
        {
          title: this.$t('Interval screenshots'),
          value: 2
        },
        {
          title: this.$t('Motion detection video'),
          value: 3
        },
        {
          title: this.$t('Motion detection screenshots'),
          value: 4
        }
      ]
    }
  },
  watch: {
    value() {
      this.$emit('update:model-value', this.value)
    }
  },
  created() {
    this.value = this.modelValue
  }
}
</script>

<template>
  <VSelect
    v-model.number="value"
    clearable
    :label="$t('Record mode')"
    :items="items"
  />
</template>

<style scoped>

</style>