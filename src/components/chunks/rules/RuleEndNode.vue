<template>
  <RuleNodeWrapper
    variant="tonal"
    :title="$t('End')"
    :edit="false"
  >
    <template #handle>
      <Handle
        id="input"
        class="handler bg-pink"
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
  name: 'RuleEndNode',
  components: {
    Handle,
    RuleNodeWrapper
  },
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