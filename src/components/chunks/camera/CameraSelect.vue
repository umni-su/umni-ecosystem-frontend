<script>
export default {
  name: 'CameraSelect',
  props:{
    modelValue:{
      type:Number,
      default:null
    }
  },
  computed: {
    cameras(){
      return this.$store.getters['getCameras']
    }
  },
  emits:[
    'update:model-value'
  ],
  data(){
    return {
      camera: []
    }
  },
  watch:{
    camera(){
      this.$emit('update:model-value', this.camera)
    }
  },
  async created(){
    this.camera = this.modelValue
    await this.getCameras()
  },
  methods:{
    async getCameras(){
      await this.$store.dispatch('getCameras')
    }
  }
}
</script>

<template>
  <VSelect
    v-model="camera"
    clearable
    :label="$t('Camera')"
    prepend-inner-icon="mdi-camera"
    :items="cameras"
    item-value="id"
    item-title="name"
  />
</template>

<style scoped>

</style>