<script>
import {isCameraTrigger, isDeviceTrigger} from '../../../../js/helpers/rulesHelper.js'
import CameraSelect from '../../camera/CameraSelect.vue'
import CameraAreaSelect from '../../camera/CameraAreaSelect.vue'

export default {
  name: 'EditTriggerRuleItem',
  components: {CameraAreaSelect, CameraSelect},
  data(){
    return {
      triggerId: null,
      triggerAction: null,
      triggerIds: [5,4]
    }
  },
  computed:{
    isCameraTrigger(){
      return isCameraTrigger(this.flow.el.key)
    },
    isDeviceTrigger(){
      return isDeviceTrigger(this.flow.el.key)
    },
    node(){
      return this.$store.getters['getSelectedNode']
    },
    id(){
      return this.node.id
    },
    type(){
      return this.node.type
    },
    flow(){
      return this.node.data.flow
    },
    options(){
      return this.node.data.options
    }
  },
  methods:{
    updateTriggerIds(index,val){
      this.triggerIds[index] = val
    },
    deleteTriggerId(index,val){
      this.triggerIds = this.triggerIds.filter((id,i)=>i !== index)
    }
  }
}
</script>

<template>
  <VSheet v-if="isCameraTrigger">
    {{triggerIds}}
    <VBtn
      icon="mdi-plus"
      variant="text"
      density="compact"
      @click="triggerIds.push(null)"
    />
    <VSheet
      v-for="(id, index) in triggerIds"
      :key="index"
    >
      <CameraAreaSelect
        v-model="triggerIds[index]"
        @update:model-value="updateTriggerIds(index,$event)"
      >
        <template #append>
          <VBtn
            icon="mdi-close"
            variant="text"
            density="compact"
            @click="deleteTriggerId(index)"
          />
        </template>
      </CameraAreaSelect>

    </VSheet>

  </VSheet>
  <VSheet v-else-if="isDeviceTrigger">device trigger</VSheet>
</template>

<style scoped>

</style>