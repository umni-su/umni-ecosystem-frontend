<script>
import NotificatioToField from './NotificationToField.vue'

export default {
  name: 'NotificationContentForm',
  components: {NotificatioToField},
  props: {
    modelValue:{
      type:Object,
      default:{}
    }
  },
  data(){
    return {
      message:{}
    }
  },
  created () {
    this.message = this.modelValue
  },
  watch: {
    modelValue(value){
      this.message = value
    },
    message:{
      deep: true,
      handler(value){
        this.$emit('update:model-value', value)
      }
    }
  }
}
</script>

<template>
  <VSheet>
    <NotificatioToField
      v-model="message.to"
      class="mb-4"
    />
    <VTextField
      v-model="message.subject"
      class="mb-4"
      :label="$t('Subject')"
    />
    <VTextarea
      v-model="message.message"
      class="mb-4"
      :label="$t('Message')"
    />
  </VSheet>
</template>

<style scoped>

</style>