<template>
  <RuleNodeWrapper
    :title="flow.el.title"
    :icon="flow.el.icon"
    @on-edit-node="opened = true"
  >
    <template #handle>
      <!-- Target handle (вход) -->
      <Handle
        id="input"
        class="handler bg-secondary"
        type="target"
        position="left"
        :connectable="true"
      />
    </template>
    <VSheet
      v-if="action && flow.el.key === 'action.notification'"
      class="text-center"
    >
      <VChip
        v-for="to in action?.to"
        :key="to"
        class="my-1"
        size="small"
        color="primary"
        :text="to"
      />
    </VSheet>
    <VSheet
      v-else-if="action && flow.el.key === 'action.webhook'"
      class="text-center"
    >
      <VChip
        class="my-1"
        size="small"
        color="primary"
        :text="action.url"
      />
    </VSheet>


    <ModalDialog
      v-model="opened"
      :title="$t('Action')"
      :subtitle="`#${flow.el.key}`"
    >
      <VSheet v-if="flow.el.key === 'action.notification'">
        <NotificationsSelect v-model="selected"/>
        <NotificationContentForm
          v-if="selected"
          v-model="action"
          class="mt-4"
        />
      </VSheet>
      <VSheet v-if="flow.el.key === 'action.webhook'">
        <VTextField
          v-model="action.url"
          prepend-inner-icon="mdi-link"
          :rules="[isUrl]"
          :label="$t('Webhook')"
        />
      </VSheet>

      <template #actions>
        <VBtn
          prepend-icon="mdi-check"
          :text="$t('Apply')"
          @click="applyData"
        />
      </template>
    </ModalDialog>

  </RuleNodeWrapper>
</template>

<script>
import RuleNodeWrapper from './RuleNodeWrapper.vue'
import {Handle} from '@vue-flow/core'
import ModalDialog from '../ModalDialog.vue'
import NotificationsSelect from '../notifications/NotificationsSelect.vue'
import NotificationContentForm from '../notifications/NotificationContentForm.vue'

export default {
  name: 'RuleActionNode',
  components: {NotificationContentForm, NotificationsSelect, ModalDialog, Handle, RuleNodeWrapper},
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data(){
    return {
      opened: false,
      selected:null,
      action:{}
    }
  },
  watch: {
    selected:{
      deep: true,
      handler(){
        this.action.notification_id = this.selected
      }
    }
  },
  computed: {
    data_action(){
      return this.data.options.action
    },
    flow(){
      return this.data.flow
    },
    selectedNode(){
      return this.$store.getters['getSelectedNode']
    }
  },
  created(){
    if(this.action){

      switch (this.flow.el.key) {
      case 'action.notification':
        if(this.data_action?.notification_id) {
          this.selected = this.data_action.notification_id
          this.action = {
            to: this.data_action.to,
            subject: this.data_action.subject ?? null,
            message: this.data_action.message ?? null
          }
        }
        break
      case 'action.webhook':
        this.action = {
          url: this.data_action?.url ?? null
        }
        break
      }
    }
  },
  methods:{
    applyData(){
      const _data = {
        id: this.selectedNode.id,
        options: null
      }
      switch (this.flow.el.key) {
      case 'action.notification':
        _data.options = {
          notification_id: this.selected,
          action: this.action
        }
        break
      case 'action.webhook':
        _data.options = {
          action:{
            url: this.action.url
          }
        }
        break
      }
      this.$store.commit('updateNodeDataOptions', _data)
      this.opened = false
    },
    isUrl(v){
      const re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/
      return re.test(v)
    }
  }
}
</script>

<style>
</style>