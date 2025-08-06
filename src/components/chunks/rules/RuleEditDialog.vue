<template>
  <ModalDialog
    v-if="node !== null"
    v-model="open"
    :title="$t('Edit rule element')"
  >
    <template #default>
      <div v-if="node.type === 'condition'">
        <v-select
          v-model="form.sensor"
          :items="['temp1', 'motion1', 'humidity1']"
          label="Датчик"
        />
        <v-select
          v-model="form.operator"
          :items="['>', '<', '==', '!=']"
          label="Оператор"
          class="mt-2"
        />
        <v-text-field
          v-model.number="form.value"
          type="number"
          label="Значение"
          class="mt-2"
        />
      </div>

      <div v-if="node.type === 'device'">
        <VSelect
          v-model="form.device"
          :items="['relay1', 'light1', 'fan1']"
          label="Устройство"
        />
        <VSelect
          v-model="form.state"
          :items="['on', 'off', 'toggle']"
          label="Состояние"
          class="mt-2"
        />
      </div>
      <EditTriggerRuleItem v-if="type==='trigger'"/>
      {{id}}
      {{type}}
      {{flow.el.key}}
      {{options}}
    </template>
    <template #actions>
      <VBtn
        color="primary"
        :text="$t('Save')"
        prepend-icon="mdi-content-save"
        @click="save"
      />
    </template>
  </ModalDialog>
</template>

<script>
import ModalDialog from '../ModalDialog.vue'
import {isCameraTrigger, isDeviceTrigger} from '../../../js/helpers/rulesHelper.js'
import EditTriggerRuleItem from './edit/EditTriggerRuleItem.vue'

export default {
  name: 'RuleEditDialog',
  components: {EditTriggerRuleItem, ModalDialog},
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  computed:{
    isCameraTrigger(){
      return isCameraTrigger(this.flow.el.key)
    },
    isDeviceTrigger(){
      return isDeviceTrigger(this.flow.el.key)
    },
    node(){
      return this.$store.getters['getSelectedNode']
    },
    id(){
      return this.node.id
    },
    type(){
      return this.node.type
    },
    flow(){
      return this.node.data.flow
    },
    options(){
      return this.node.data.options
    }
  },
  emits: ['save','update:model-value'],
  watch:{
    open(){
      this.$emit('update:model-value', this.open)
      if(!this.open){
        this.$store.commit('destroySelectedNode')
      }
    },
    modelValue(val){
      this.open = val
    },
    node: {
      deep: true,
      handler(val) {
        this.open = val !== null && val!==undefined
      }
    }
  },
  data() {
    return {
      open: false,
      form: {  }
    }
  },
  methods: {
    save() {
      this.$emit('save', this.form)
      this.open = false
      this.$emit('update:model-value', this.open)
    }
  }
}
</script>

<style>
</style>