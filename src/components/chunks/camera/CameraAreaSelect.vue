<script>
import CameraSelect from './CameraSelect.vue'

export default {
  name: 'CameraAreaSelect',
  components: {CameraSelect},
  props:{
    modelValue:{
      type:Number,
      default:null
    },
    camera:{
      type:Object,
      required:true
    }
  },
  emits:[
    'update:model-value'
  ],
  data(){
    return {
      area:null
    }
  },
  watch:{
    camera:{
      deep:true,
      handler(value){
        this.area = null
      }
    }
  },
  computed:{
    areas(){
      return this.camera !== null? this.camera.areas : []
    }
  }
}
</script>

<template>
  <VSelect
    v-model="area"
    clearable
    :label="$t('Area')"
    prepend-inner-icon="mdi-texture-box"
    :items="areas"
    item-value="id"
    item-title="name"
    @update:model-value="$emit('update:model-value', this.area)"
  />
</template>

<style scoped>

</style>