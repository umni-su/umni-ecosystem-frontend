<script>
export default {
  name: "CameraDeleteAfterSelect",
  props: {
    modelValue: {
      type: Number,
      default: 60 * 24
    },
  },
  emits: ['update:model-value'],
  data() {
    return {
      selected: 60 * 24,
      items: [
        {
          title: this.$t('{n} hours', 1),
          value: 60
        },
        {
          title: this.$t('{n} hours', 3),
          value: 60 * 3
        },
        {
          title: this.$t('{n} hours', 6),
          value: 60 * 6
        },
        {
          title: this.$t('{n} hours', 12),
          value: 60 * 12
        },
        {
          title: this.$t('{n} days', 1),
          value: 60 * 24
        },
        {
          title: this.$t('{n} days', 5),
          value: 60 * 24 * 5
        },
        {
          title: this.$t('{n} days', 7),
          value: 60 * 24 * 7
        },
        {
          title: this.$t('{n} months', 1),
          value: 60 * 24 * 30
        },
        {
          title: this.$t('{n} months', 3),
          value: 60 * 24 * 30 * 3
        },
        {
          title: this.$t('{n} months', 6),
          value: 60 * 24 * 30 * 6
        },
        {
          title: this.$t('{n} year', 1),
          value: 60 * 24 * 30 * 12
        },
        {
          title: this.$t('Store permanent'),
          value: null
        }
      ]
    }
  },
  watch: {
    value(newValue) {
      this.$emit('update:model-value', newValue)
    }
  },
  created() {
    if (this.modelValue !== undefined) {
      this.selected = this.modelValue
    }
    this.$emit('update:model-value', this.selected)
  }
}
</script>

<template>
  <VSelect
    v-model="selected"
    :items="items"
    :label="$t('Record delete after')"
    @update:model-value="$emit('update:model-value', selected)"
  />
</template>

<style scoped>

</style>