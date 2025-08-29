<template>
  <RuleNodeWrapper
    :title="flow.el.title"
    :icon="flow.el.icon"
    @on-edit-node="open = true"
  >
    <VSheet class="text-center">
      <VChip
        v-if="valuesList.length > 0"
        density="compact"
        class="my-1"
      >
        {{$t('{n} entities',{n:valuesList.length ?? 0})}}
      </VChip>
    </VSheet>
    <template #handle>
      <Handle
        id="input"
        class="handler bg-primary"
        type="target"
        position="left"
        :connectable="true"
      />
      <Handle
        id="output"
        class="handler bg-purple"
        type="source"
        position="right"
        :connectable="true"
      />
    </template>
    <ModalDialog
      v-model="open"
      :title="flow.el.title"
      :subtitle="`#${flow.el.key}`"
    >
      <VSheet
        class="d-flex align-center justify-space-between"
      >
        <RuleEntitySelect
          v-model="area"
          :list="list"
          @update:model-value="addNewEntry(area)"
        />
      </VSheet>
      <VList
        v-if="dataLoaded"
        density="compact"
      >
        <VListItem
          v-for="item in selectedItems"
          :key="item"
          :value="item.id"
        >
          <template #title>{{item.name}}</template>
          <template #prepend>
            <VBtn
              readonly
              density="comfortable"
              class="mr-4"
              :color="item.color ?? 'primary'"
              :icon="item.icon ?? 'mdi-help'"
            />
          </template>
          <template #append>
            <VBtn
              icon="mdi-trash-can"
              density="comfortable"
              variant="plain"
              color="error"
              @click="deleteArea(item.id)"
            />
          </template>
        </VListItem>
      </VList>
      <template #actions>
        <VBtn
          prepend-icon="mdi-check"
          :text="$t('Apply')"
          @click.stop="saveAndClose"
        />
      </template>
    </ModalDialog>
  </RuleNodeWrapper>

</template>

<script>
import RuleNodeWrapper from './RuleNodeWrapper.vue'
import {Handle} from '@vue-flow/core'
import ModalDialog from '../ModalDialog.vue'
import CameraAreaSelect from '../camera/CameraAreaSelect.vue'
import CameraSelect from '../camera/CameraSelect.vue'
import RuleEntitySelect from './edit/RuleEntitySelect.vue'

export default {
  name: 'RuleTriggerNode',
  components: {RuleEntitySelect, CameraSelect, CameraAreaSelect, ModalDialog, Handle, RuleNodeWrapper},
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data(){
    return {
      list:[],
      valuesList:[],
      camera: null,
      area:null,
      open:false,
      nodeOptions:{}
    }
  },
  async created() {
    this.nodeOptions = {...{ids:[]},...this.data.options}
    this.valuesList = this.data?.items ?? []
  },
  computed: {
    currentId(){
      return this.$attrs.id
    },
    dataLoaded(){
      return this.selectedItems.indexOf(undefined) === -1
    },
    selectedNode(){
      return this.$store.getters['getSelectedNode']
    },
    flow(){
      return this.data.flow
    },
    cameras(){
      return this.$store.getters['getCameras']
    },
    selectedItems(){
      return this.nodeOptions.ids.map(id=>{
        return this.list.find(a=>a.id === id)
      })
    }
  },
  watch:{
    async open(val){
      if(val){
        await this.getRuleNodeList()
      }
    }
  },
  methods: {
    async getRuleNodeList(){
      this.list = await this.$store.dispatch('getRuleNodeList', this.currentId)
    },
    addNewEntry(id){
      if(typeof id === 'number' && id > 0){
        const founded = this.nodeOptions.ids.indexOf(id) > -1
        if(!founded){
          this.nodeOptions.ids.push(id)
        }
      }

    },
    saveNode(){
      const _data = {
        id:this.selectedNode.id,
        data: {
          ...this.data,
          ...{options: this.nodeOptions}
        }
      }
      this.$store.commit('updateNodeData',_data)
    },
    saveAndClose(){
      this.saveNode()
      this.$nextTick(() => {
        this.valuesList = this.selectedItems
        this.open = false
      })
    },
    deleteArea(id){
      this.nodeOptions.ids=this.nodeOptions.ids.filter(_id=>_id!==id)
      this.saveNode()
    }
  }
}
</script>

<style>
</style>