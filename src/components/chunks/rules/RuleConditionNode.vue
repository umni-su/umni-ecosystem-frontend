<template>
  <RuleNodeWrapper
    :title="flow.el.title"
    :icon="flow.el.icon"
    @on-edit-node="opened=true"
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
    <ModalDialog
      v-model="opened"
      :title="$t('Condition')"
      :subtitle="`#${flow.el.key}`"
    >

      <RuleConditionItems
        v-model="items"
        @update:model-value="onUpdateConditions"
      />
    </ModalDialog>
  </RuleNodeWrapper>

</template>

<script>
import RuleNodeWrapper from './RuleNodeWrapper.vue'
import {Handle} from '@vue-flow/core'
import ModalDialog from '../ModalDialog.vue'
import RuleConditionItems from './RuleConditionItems.vue'

export default {
  name: 'RuleConditionNode',
  components: {
    RuleConditionItems,
    ModalDialog,
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
    selectedNode(){
      return this.$store.getters['getSelectedNode']
    },
    options(){
      return this.data.options
    },
    conditions(){
      return this.options?.conditions ?? []
    },
    flow(){
      return this.data.flow
    }
  },
  mounted() {
    this.items = this.conditions
  },
  methods:{
    onUpdateConditions(items){
      this.$store.commit('updateNodeData',{
        id: this.selectedNode.id,
        data: {
          ...this.data,
          ...{
            options: {
              conditions: items
            }
          }
        }
      })
    }
  },
  data(){
    return {
      items:[],
      opened: false,
      index: 0
    }
  }
}
</script>

<style>
</style>