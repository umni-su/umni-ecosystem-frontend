<script>
import NotificationTypeFormField from './NotificationTypeFormField.vue'

export default {
  name: 'NotificationTypeForm',
  components: {NotificationTypeFormField},
  props: {
    modelValue: {
      type: Object,
      default: null
    }
  },
  watch: {
    modelValue: {
      deep: true,
      handler(v) {
        this.fields = v
        this.formData = {}
      }
    }
  },
  emits: ['update:modelValue', 'update:model-value', 'update:form-data'],
  created() {
    this.fields = this.modelValue
  },
  data() {
    return {
      fields: null,
      formData: {}
    }
  },
  methods: {
    updatePropertyValue(index, value) {
      const key = Object.keys(this.fields)[index]
      if (key !== null && key !== undefined) {
        this.formData[key] = value
        this.$emit('update:form-data', this.formData)
      }
    }
  }
}
</script>

<template>
  <VSheet v-if="fields !== null">
    <NotificationTypeFormField
      v-for="(v,index) in Object.values(fields)"
      class="mb-4"
      :field="v"
      @update:model-value="updatePropertyValue(index, $event)"
    />
  </VSheet>
</template>

<style scoped>

</style>