<script>
import {createErrorNotification} from '../../../../js/helpers/notificationHelper.js'

export default {
  name: 'RuleForm',
  props:{
    modelValue:{
      type:Object,
      required:true
    }
  },
  data(){
    return {
      rule: {}
    }
  },
  emits: ['update:model-value','rule-saved'],
  created(){
    this.rule = this.modelValue
  },
  watch:{
    modelValue(newValue){
      this.rule = newValue
    }
  },
  methods:{
    updateRule(){
      this.$emit('update:model-value', this.rule)
    },
    async saveRule(){
      const ok = await this.$store.dispatch('addRule', this.rule).catch(e=>{
        this.$store.commit('addNotification', createErrorNotification(this.$t('Error save rule')))
      })
      if(ok){
        this.$emit('rule-saved', this.rule)
      }
    }
  }
}
</script>

<template>
  <VTextField
    v-model="rule.name"
    clearable
    :label="$t('Name')"
    @update:model-value="updateRule"
  />
  <VTextarea
    v-model="rule.description"
    class="mt-4"
    rows="3"
    :label="$t('Description')"
  />
  <VSheet class="d-flex justify-space-between align-center mt-4">
    <VSwitch
      v-model="rule.active"
      density="comfortable"
      :label="$t('Active')"
      @update:model-value="updateRule"
    />
    <VBtn
      :text="$t('Save')"
      prepend-icon="mdi-content-save"
      @click="saveRule"
    />
  </VSheet>
</template>

<style scoped>

</style>