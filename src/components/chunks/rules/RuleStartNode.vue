<template>
  <RuleNodeWrapper
    color="primary"
    variant="tonal"
    :title="$t('Start')"
    :edit="false"
  >
    <template #handle>
      <!-- Source handle (выход) -->
      <Handle
        id="output"
        class="handler bg-primary"
        type="source"
        position="right"
        :connectable="true"
      />

    </template>
  </RuleNodeWrapper>

</template>

<script>
import RuleNodeWrapper from './RuleNodeWrapper.vue'
import {Handle} from '@vue-flow/core'

export default {
  name: 'RuleStartNode',
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