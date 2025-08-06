<template>
  <RuleNodeWrapper
    :title="$t('Condition')"
    :icon="flow.el.icon"
  >
    <template #handle>
      <!-- Source handle (выход) -->
      <Handle
        id="output-true"
        class="handler bg-success"
        type="source"
        position="bottom"
        :connectable="true"
        :style="{ left: '20%' }"
      />
      <Handle
        id="output-false"
        class="handler bg-error"
        type="source"
        position="bottom"
        :connectable="true"
        :style="{ left: '80%' }"
      />
      <!-- Target handle (вход) -->
      <Handle
        id="input"
        class="handler bg-primary"
        type="target"
        position="top"
        :connectable="true"
      />
    </template>
    <div class="text-center pa-2 pb-0">
      <VBtn
        v-if="typeof icon === 'string' && typeof label === 'string'"
        variant="tonal"
        block
        rounded="pill"
        :color="color"
        :prepend-icon="icon"
        :text="label"
        @mousedown.stop
        @click.capture.stop="changeType"
      />
    </div>
  </RuleNodeWrapper>

</template>

<script>
import RuleNodeWrapper from './RuleNodeWrapper.vue'
import {Handle} from '@vue-flow/core'

export default {
  name: 'RuleConditionNode',
  components: {
    Handle,
    RuleNodeWrapper
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed:{
    flow(){
      return this.data.flow
    },
    label(){
      return this.types[this.index].label
    },
    icon(){
      return this.types[this.index].icon
    },
    color(){
      return this.types[this.index].color ?? 'grey'
    },
    operand(){
      return this.types[this.index].key ?? 'and'
    }
  },
  data(){
    return {
      index: 0,
      types:[
        {
          label:this.$t('And'),
          key: 'and',
          icon:'mdi-gate-and',
          color:'green'
        },
        {
          label:this.$t('Or'),
          key: 'or',
          icon:'mdi-gate-or',
          color:'warning'
        },
        {
          label:this.$t('Not'),
          key: 'not',
          icon:'mdi-gate-not',
          color:'error'
        }
      ]
    }
  },
  methods: {
    changeType() {
      this.index = this.index >= (this.types.length - 1) ? 0 : this.index+1
      this.$store.commit('updateNodeData', {
        id: this.$attrs.id,
        data:{
          operand: this.operand
        }
      })
    }
  }
}
</script>

<style>
</style>