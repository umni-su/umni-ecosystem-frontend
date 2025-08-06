<template>
  <VSheet
    class="dnd-flow rules-editor fill-height"
    border="sm"
    @drop="onDrop"
  >
    <VueFlow
      ref="vueFlow"
      :nodes="nodes"
      :edges="edges"
      :node-types="nodeTypes"
      class="flow-area"
      @dragover="onDragOver"
      @connect="onConnect"
      @node-context-menu="handleNodeRemove"
      @node-drag-stop="onNodeDragStop"
      @edges-change="onEdgesChanged"
    >
      <Controls
        position="top-right"
        :show-zoom="true"
        :show-fit-view="true"
        :show-interactive="true"
      />
      <Background />
    </VueFlow>
    <RuleEditDialog
      v-model="edit"
      @save="updateNode"
    />
  </VSheet>
</template>

<script>
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import { VueFlow} from '@vue-flow/core'
import { Controls, Background } from '@vue-flow/additional-components'
import RuleConditionNode from './RuleConditionNode.vue'
import RuleDeviceNode from './RuleDeviceNode.vue'
import RuleCameraNode from './RuleCameraNode.vue'
import RuleActionNode from './RuleActionNode.vue'
import RuleEditDialog from './RuleEditDialog.vue'
import {markRaw} from 'vue'
import RuleStartNode from './RuleStartNode.vue'
import RuleEndNode from './RuleEndNode.vue'
import RuleTriggerNode from './RuleTriggerNode.vue'
import {createErrorNotification} from '../../../js/helpers/notificationHelper.js'

export default {
  name: 'RulesEditor',
  components: {
    VueFlow,
    Background,
    Controls,
    RuleEditDialog
  },
  computed:{
    nodes(){
      return this.$store.getters['getNodes']
    },
    edges(){
      return this.$store.getters['getEdges']
    },
    isDragging(){
      return this.$store.state.flow.dragging
    },
    flowType(){
      return this.$store.state.flow.type
    },
    selectedNode(){
      return this.$store.getters['getSelectedNode']
    }
  },
  data() {
    return {
      edit: false,
      connectionPorts:{
        output: ['input'],
        input: ['output', 'output-true','output-false'],
        'output-true':['input'],
        'output-false':['input']
      },
      connectionRules: {
        // Какие типы узлов можно соединять
        trigger: ['start','device'],
        finish: ['start','condition','device', 'action', 'camera'],
        start: ['finish','trigger'],
        condition: ['trigger','condition','device', 'action', 'camera','finish'],
        device: ['action'],
        camera: ['action'],
        action: ['device', 'camera', 'condition','trigger']
      },
      nodeTypes: markRaw({
        trigger: RuleTriggerNode,
        start: RuleStartNode,
        finish: RuleEndNode,
        condition: RuleConditionNode,
        device: RuleDeviceNode,
        camera: RuleCameraNode,
        action: RuleActionNode
      })
    }
  },
  mounted() {
    this.initNodes()
  },
  methods: {
    onEdgesChanged(e){
      console.log('edges changed',e)
      return true
    },
    onNodeDragStop(event){
      const node = event.node
      this.updateNode(node)
    },
    handleNodeRemove(event) {
      event.event.preventDefault()
      const nodeId = event.node.id
      // Удаляем ноду
      this.nodes = this.nodes.filter(node => node.id !== nodeId)

      // Удаляем связанные соединения
      const edges = this.edges.filter(
        edge => edge.source !== nodeId && edge.target !== nodeId
      )
      this.$store.commit('setEdges', edges)

    },
    initNodes() {
      //DEMO
      const testNodes = [
        {
          id: '1',
          type: 'start',
          position: { x: 10, y: 10 }
        },
        {
          id: '2',
          type: 'finish',
          position: { x: 10, y: 500 }
        }
      ]
      this.$store.commit('setNodes', testNodes)
    },
    onConnect(params) {
      const sourceNode = this.nodes.find(n => n.id === params.source)
      const targetNode = this.nodes.find(n => n.id === params.target)

      // Проверяем правила соединения
      if (
        this.isConnectionAllowed(sourceNode.type, targetNode.type) &&
          this.isPortConnectionAllowed(params.sourceHandle, params.targetHandle)
      ) {
        //this.edges = [...this.edges, params]
        console.log('Add new edge', params)
        this.$store.commit('addEdge', params)
      } else {
        console.warn('Соединение не разрешено')
      }
    },
    isPortConnectionAllowed(sourceHandle, targetHandle) {
      return this.connectionPorts[sourceHandle]?.includes(targetHandle) || false
    },
    isConnectionAllowed(sourceType, targetType) {
      return this.connectionRules[sourceType]?.includes(targetType) || false
    },
    updateNode(newData) {
      this.$store.commit('addNode', newData)
      this.$store.commit('destroySelectedNode')
      this.edit = false
    },

    onDragOver(event) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'move'
    },

    checkStartExists(){
      const index = this.nodes.findIndex(node => node.type === 'start')
      return index > -1 && this.flowType === 'start'
    },

    onDrop(event) {
      event.preventDefault()
      if (!this.flowType) return
      if (this.checkStartExists()) {
        this.$store.commit('addNotification', createErrorNotification(this.$t('Only one start node can exists!')))
        return
      }

      try {
        const flow = event.dataTransfer.getData('flow')
        const objFlow = JSON.parse(flow)

        // Получаем позицию относительно области VueFlow
        const flowArea = document.querySelector('.flow-area')
        const rect = flowArea.getBoundingClientRect()

        // 1. Получаем экземпляр VueFlow
        const vueFlowInstance = this.$refs.vueFlow

        // 2. Рассчитываем позицию с учётом ВСЕХ трансформаций
        const position = vueFlowInstance.project({
          x: event.clientX - rect.left - 150,
          y: event.clientY - rect.top - 10,
          // Учитываем дополнительные смещения если нужно:
          offset: {
            x: 10, // Небольшой отступ от курсора
            y: 10
          }
        })

        // const position = {
        //   x: event.clientX - rect.left,
        //   y: event.clientY - rect.top
        // }

        const nodeData = {...this.getInitialNodeData(this.flowType),...{flow: objFlow}}

        // Создаем новую ноду
        const newNode = {
          id: `${Date.now()}`,
          type: this.flowType,
          position,
          data: nodeData
        }

        // Добавляем ноду в массив
        //this.nodes = [...this.nodes, newNode]
        this.$nextTick(()=>{
          this.$store.commit('addNode', newNode)
          this.$store.commit('setFlowDragging', false)
        })
      } catch (e) {
        console.error(e)
      }

    },

    getInitialNodeData(nodeType) {
      const dataMap = {
        trigger: {  },
        condition: { operand: 'and', items:[] },
        device: { device: 'relay1', state: 'on' },
        camera: { camera: 'cam1', action: 'record' },
        action: {  },
        start: { type: 'start'},
        end: { }
      }
      return dataMap[nodeType] || {}
    }
  }
}
</script>

<style>
.rules-editor {
  position: relative;
  width: 100%;
}


</style>