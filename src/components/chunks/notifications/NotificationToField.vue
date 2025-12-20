<script>
export default {
  name: 'NotificationToField',
  props: {
    modelValue:{
      type:Array,
      default: []
    },
    max: {
      type:Number,
      default:1000
    }
  },
  data(){
    return {
      text:null,
      value:[]
    }
  },
  created(){
    this.value = this.modelValue
  },
  watch: {
    modelValue(newValue){
      this.value = newValue
    },
    value(newValue){
      this.$emit('update:model-value',newValue)
    }
  },
  methods:{
    addTo(){
      if(this.value.indexOf(this.text)===-1 && this.value.length < this.max && this.text !== null){
        this.value.push(this.text)
        this.text = null
        this.$emit('update:model-value',this.value)
      }
    },
    deleteTo(v){
      this.value = this.value.filter(item => item !== v)
      this.$emit('update:model-value',this.value)
    }
  }
}
</script>

<template>
  <VSheet>
    <VTextField
      v-model="text"
      class="mb-1"
      :label="$t('To')"
    >
      <template #append-inner>
        <VBtn
          color="default"
          icon="mdi-plus-circle"
          variant="plain"
          density="compact"
          @click="addTo"
        />
      </template>
    </VTextField>
    <VChip
      v-for="to in value"
      :key="to"
      class="mr-1 mb-1"
      size="small"
      density="comfortable"
      closable
      :text="to"
      color="primary"
      prepend-icon="mdi-account"
      @click:close="deleteTo(to)"
    />
  </VSheet>
</template>

<style scoped>

</style>