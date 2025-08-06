<script>
import CameraSelect from './CameraSelect.vue'

export default {
  name: 'CameraAreaSelect',
  components: {CameraSelect},
  props:{
    modelValue:{
      type:Number,
      default:null
    }
  },
  emits:[
    'update:model-value'
  ],
  data(){
    return {
      camera: null,
      cameraId: null,
      area: null,
      areas: []
    }
  },
  watch:{
    area(){
      this.$emit('update:model-value', this.area)
    },
    async cameraId(val){
      this.camera = null
      this.area = null
      if(val === null){
        this.areas = []
      } else {
        await this.getCamera()
      }
    }
  },
  async created(){

  },
  methods:{
    async getCamera(){
      this.camera = await this.$store.dispatch('getCamera', this.cameraId)
      this.areas = this.camera.areas
    }
  }
}
</script>

<template>
  <VSheet>
    <VContainer class="pa-0">
      <VRow>
        <VCol
          cols="12"
          md="6"
        >
          <CameraSelect v-model="cameraId"/>
        </VCol>
        <VCol
          cols="12"
          md="6"
        >
          <VSelect
            v-model="area"
            :disabled="camera === null"
            clearable
            :label="$t('Area')"
            prepend-inner-icon="mdi-texture-box"
            :items="areas"
            item-value="id"
            item-title="name"
          />
        </VCol>
      </VRow>
    </VContainer>
  </VSheet>
</template>

<style scoped>

</style>