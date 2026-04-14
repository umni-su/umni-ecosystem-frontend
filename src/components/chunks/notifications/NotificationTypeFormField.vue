<script>
import ConfigurationDynamicField from '../configuration/ConfigurationDynamicField.vue'

export default {
  name: 'NotificationTypeFormField',
  components: {ConfigurationDynamicField},
  props: {
    field: {
      type: Object,
      default: null
    },
    modelValue: {
      type: String | Number
    }
  },
  emits: ['update:model-value'],
  watch: {
    field: {
      deep: true,
      handler() {
        this.value = null
      }
    },
    modelValue(v) {
      this.value = v
    },
    value(v) {
      this.$emit('update:model-value', v)
    }
  },
  data() {
    return {
      value: null
    }
  },
  created() {
    if (this.value === null) {
      this.value = this.defaultValue
    }
  }
}
</script>

<template>
  <ConfigurationDynamicField
    v-model="value"
    :field="field"
  />
  <!--  <VTextField-->
  <!--    v-if="isString"-->
  <!--    v-model="value"-->
  <!--    :label="description"-->
  <!--    type="text"-->
  <!--  />-->
  <!--  <VTextField-->
  <!--    v-else-if="isNumber"-->
  <!--    v-model="value"-->
  <!--    :label="description"-->
  <!--    type="number"-->
  <!--  />-->
  <!--  <VSelect-->
  <!--    v-else-if="isSelect"-->
  <!--    v-model="value"-->
  <!--    :label="description"-->
  <!--    :items="this.field?.enum"-->
  <!--  />-->
</template>

<style scoped>

</style>