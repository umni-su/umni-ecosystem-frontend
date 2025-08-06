<template>
  <RuleNodeWrapper
    :title="flow.el.title"
    :icon="flow.el.icon"
  >
    <template #handle>
      <Handle
        id="input"
        class="handler bg-secondary"
        type="target"
        position="top"
        :connectable="true"
      />
      <Handle
        id="output"
        class="handler bg-orange"
        type="target"
        position="bottom"
        :connectable="true"
      />
    </template>
  </RuleNodeWrapper>

</template>

<script>
import RuleNodeWrapper from './RuleNodeWrapper.vue'
import {Handle} from '@vue-flow/core'

export default {
  name: 'RuleTriggerNode',
  components: {Handle, RuleNodeWrapper},
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data(){
    return {
      open:false
    }
  },
  computed: {
    flow(){
      return this.data.flow
    }
  }
}
</script>

<style>
</style>