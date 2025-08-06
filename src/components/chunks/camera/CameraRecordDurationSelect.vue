<script>
export default {
  name: 'CameraRecordDurationSelect',
  props: {
    modelValue: {
      type: Number,
      default: 60
    }
  },
  emits: ['update:model-value'],
  data() {
    return {
      value: 60,
      items: [
        {
          title: this.$t('{n} minutes', 5),
          value: 5
        }, {
          title: this.$t('{n} minutes', 10),
          value: 10
        },
        {
          title: this.$t('{n} minutes', 15),
          value: 15
        },
        {
          title: this.$t('{n} minutes', 30),
          value: 30
        },
        {
          title: this.$t('{n} minutes', 45),
          value: 45
        },
        {
          title: this.$t('{n} hours', 1),
          value: 60
        }
      ]
    }
  },
  created() {
    if (this.modelValue !== undefined) {
      this.value = this.modelValue
    }
    this.$emit('update:model-value', this.value)
  }
}
</script>

<template>
  <VSelect
    v-model="value"
    :items="items"
    :label="$t('Record segment duration')"
    @update:model-value="$emit('update:model-value', value)"
  />
</template>

<style scoped>

</style>