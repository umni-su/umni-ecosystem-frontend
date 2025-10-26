<script>
import ConfirmationDialog from '../ConfirmationDialog.vue'
import {createErrorNotification, createSuccessNotification} from '../../../js/helpers/notificationHelper.js'

export default {
  name: 'RuleListItem',
  components: {ConfirmationDialog},
  props: {
    rule:{
      type:Object,
      required:true
    }
  },
  methods:{
    async executeRule(){
      await this.$store.dispatch('executeRule', this.rule.id)
    },
    async deleteRule(){
      const ok = await this.$refs.confirm.show({
        title: this.$t('Delete area'),
        message: this.$t('Rule will be deleted'),
        okText: this.$t('Delete'),
        okIcon: 'mdi-trash-can'
      }).catch(e=>{
        this.$store.commit('addNotification', createErrorNotification(e.response.data.detail))
      })
      if(ok){
        const res = await this.$store.dispatch('deleteRule', this.rule.id)
        if(res){
          this.$store.commit('addNotification', createSuccessNotification(res.data.message))
        }
      }
    }
  }
}
</script>

<template>
  <VListItem
    :to="{name:'rule',params:{id: this.rule.id}}"
    :value="rule.id"
    :title="rule.name"
    :subtitle="rule.description"
  >
    <template #prepend>
      <VIcon
        icon="mdi-circle"
        :color="rule.enabled ? 'success' : 'error'"
      />
    </template>
    <template #append>
      <VBtn
        color="primary"
        icon="mdi-play"
        variant="text"
        density="comfortable"
        @click.prevent.stop="executeRule"
      />
      <VBtn
        color="secondary"
        icon="mdi-map-marker-path"
        variant="text"
        density="comfortable"
      />
      <VBtn
        color="error"
        icon="mdi-trash-can"
        variant="text"
        density="comfortable"
        @click.stop="deleteRule"
      />
    </template>
    <template #default>
      <ConfirmationDialog ref="confirm"/>
    </template>
  </VListItem>
</template>

<style scoped>

</style>