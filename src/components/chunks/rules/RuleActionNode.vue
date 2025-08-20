<template>
  <RuleNodeWrapper
    :title="flow.el.title"
    :icon="flow.el.icon"
  >
    <template #handle>
      <!-- Target handle (вход) -->
      <Handle
        id="input"
        class="handler bg-secondary"
        type="target"
        position="left"
        :connectable="true"
      />
    </template>

  </RuleNodeWrapper>
</template>

<script>
import RuleNodeWrapper from './RuleNodeWrapper.vue'
import {Handle} from '@vue-flow/core'

export default {
  name: 'RuleActionNode',
  components: {Handle, RuleNodeWrapper},
  props: {
    data: {
      type: Object,
      required: true
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