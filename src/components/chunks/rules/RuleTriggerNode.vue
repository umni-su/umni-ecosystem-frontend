<template>
  <RuleNodeWrapper
    :title="flow.el.title"
    :icon="flow.el.icon"
    @on-edit-node="open = true"
  >
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
    <VSheet
      v-if="nodeOptions.items !== undefined"
      class="text-center"
    >
      <VChip
        v-if="nodeOptions.items.length > 0"
        class="my-1"
        color="primary"
        variant="tonal"
        size="small"
      >
        {{$t('{n} triggers',{n:nodeOptions.items.length})}}
      </VChip>
    </VSheet>
    <ModalDialog
      v-model="open"
      :title="flow.el.title"
      :subtitle="`#${flow.el.key}`"
    >
      <VSheet>
        <InfiniteAutocomplete
          v-model="nodeOptions.items"
          :store-action-options="{id:selectedNode.id}"
          store-action="getRuleNodeList"
        />
        <!--        <RuleEntitySelect-->
        <!--          v-model="area"-->
        <!--          :list="list"-->
        <!--          @update:model-value="addNewEntry(area)"-->
        <!--        />-->
      </VSheet>

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
import InfiniteAutocomplete from '../InfiniteAutocomplete.vue'

export default {
  name: 'RuleTriggerNode',
  components: {
    InfiniteAutocomplete,
    RuleEntitySelect, CameraSelect, CameraAreaSelect, ModalDialog, Handle, RuleNodeWrapper},
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data(){
    return {
      page:1,
      term: null,
      valuesList:[],
      camera: null,
      area:null,
      open:false,
      nodeOptions:{
        items:[]
      }
    }
  },
  async created() {
    this.nodeOptions = this.options ?? []
    if (this.nodeOptions.items === null){
      this.nodeOptions.items = []
    }
    //this.valuesList = this.data?.items ?? []
  },
  computed: {
    dataLoaded(){
      return this.selectedItems?.indexOf(undefined) === -1
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
    options(){
      return this.data.options ?? []
    },
    selectedItems(){
      return this.options.items ?? []
    }
  },
  watch:{
    async open(val){
      if(val){
        //await this.getRuleNodeList()
      }
    }
  },
  methods: {
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
    deleteItem(id){
      this.nodeOptions.ids=this.nodeOptions.ids.filter(_id=>_id!==id)
      this.nodeOptions.items=this.nodeOptions.items.filter(item=>item.id!==id)
      this.saveNode()
    }
  }
}
</script>

<style>
</style>