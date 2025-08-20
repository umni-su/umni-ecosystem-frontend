<template>
  <RuleNodeWrapper
    :title="$t('Device')"
  >
    <template #handle>
      <Handle
        id="input"
        class="handler bg-primary"
        type="target"
        position="left"
        :connectable="true"
      />
    </template>
    <div class="device-node">
      <div class="node-content">
        <div>{{ data.device }}: {{ data.state }}</div>
      </div>
    </div>
  </RuleNodeWrapper>
</template>

<script>
import RuleNodeWrapper from './RuleNodeWrapper.vue'
import {Handle} from '@vue-flow/core'

export default {
  name: 'RuleDeviceNode',
  components: {Handle, RuleNodeWrapper},
  props: {
    data: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
</style>