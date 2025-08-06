<template>
  <RuleNodeWrapper
    :icon="flow.el.icon"
    :title="$t('Camera')"
  >
    <template #handle>
      <Handle
        id="input"
        class="handler bg-primary"
        type="target"
        position="top"
        :connectable="true"
      />
      <Handle
        id="output"
        class="handler bg-primary"
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
  name: 'RuleCameraNode',
  components: {Handle, RuleNodeWrapper},
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    flow() {
      return this.data.flow
    }
  }
}
</script>

<style>
</style>