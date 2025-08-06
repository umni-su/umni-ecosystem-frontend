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
      triggerIds: []
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
  }
}
</script>

<template>
  <VSheet v-if="isCameraTrigger">
    <VBtn
      icon="mdi-plus"
      variant="text"
      density="compact"
      @click="triggerIds.push(null)"
    />
    <CameraAreaSelect
      v-for="(id, index) in triggerIds"
      :key="index"
      @update:model-value="triggerIds[index] = $event"
    />
  </VSheet>
</template>

<style scoped>

</style>