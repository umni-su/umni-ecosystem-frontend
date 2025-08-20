<template>
  <RuleNodeWrapper
    :title="flow.el.title"
    :icon="flow.el.icon"
  >
    <template #handle>
      <!-- Source handle (выход) -->
      <Handle
        id="output-true"
        class="handler bg-success"
        type="source"
        position="right"
        :connectable="true"
        :style="{ top: '20%' }"
      />
      <Handle
        id="output-false"
        class="handler bg-error"
        type="source"
        position="right"
        :connectable="true"
        :style="{ top: '80%' }"
      />
      <!-- Target handle (вход) -->
      <Handle
        id="input"
        class="handler bg-purple"
        type="target"
        position="left"
        :connectable="true"
      />
    </template>
    <div class="text-center pa-2 pb-0">
      <VBtn
        v-if="typeof icon === 'string' && typeof label === 'string'"
        variant="tonal"
        block
        density="compact"
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
    options(){
      return this.data.options
    },
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
  created() {
    const operand = this.data?.options?.operand
    if (operand !== null){
      this.index = this.types.findIndex(t=> t.key === operand)
    }
  },
  methods: {
    changeType(e) {
      this.index = this.index >= (this.types.length - 1) ? 0 : this.index+1
      this.$store.commit('updateNodeDataOptions', {
        id: this.$attrs.id,
        options:{
          operand: this.operand
        }
      })
    }
  }
}
</script>

<style>
</style>