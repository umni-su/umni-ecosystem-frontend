<script>
export default {
  name: 'AvailabilitySelect',
  props: {
    modelValue: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    if(this.modelValue === null){
      this.value = 0
    } else {
      this.value = this.modelValue
    }
    this.$emit('update:model-value', this.value)
  },
  watch: {
    modelValue(newValue) {
      this.value = newValue
    },
    value(newValue) {
      this.$emit('update:model-value', newValue)
    }
  },
  data(){
    return {
      value:0,
      items:[
        {
          key:0,
          label:this.$t('Offline')
        },
        {
          key:1,
          label:this.$t('Online')
        }
      ]
    }
  }
}
</script>

<template>
  <VSelect
    v-model.number="value"
    :label="$t('Availability')"
    :items="items"
    item-title="label"
    item-value="key"
  />
</template>

<style scoped>

</style>