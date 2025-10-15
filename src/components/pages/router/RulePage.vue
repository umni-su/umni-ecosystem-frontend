<script>
import RulesEditor from '../../chunks/rules/RulesEditor.vue'
import RuleGroups from '../../chunks/rules/RuleGroups.vue'
import SidebarPanel from '../../chunks/SidebarPanel.vue'
import NotFound from '../../chunks/NotFound.vue'
import {createSuccessNotification} from '../../../js/helpers/notificationHelper.js'

export default {
  name: 'RulePage',
  components: {NotFound, SidebarPanel, RuleGroups, RulesEditor},
  props:{
    id:Number
  },
  async created(){
    await this.getRule()
  },
  data(){
    return {
      open: true,
      notFound:false,
      message:null
    }
  },
  watch:{
    async id(){
      await this.getRule()
    },
    wsMessage:{
      deep: true,
      handler(newVal){
        if(newVal && newVal.topic === 'rule.executed'){
          if(newVal.rule_id===this.rule.id) this.message = newVal
        }
        return null
      }
    },
    message:{
      deep: true,
      handler(newVal){
        if(newVal && newVal.hasOwnProperty('edges')){
          this.$store.commit('setEdges',newVal.edges)
        }
      }
    }
  },
  computed:{
    rule(){
      return this.$store.getters['getCurrentRule']
    },
    wsMessage(){
      return this.$store.getters['getWsLastMessage']
    }
  },
  mounted(){
    this.$store.commit('setFullWidth',true)
  },
  unmounted() {
    this.$store.commit('setFullWidth',false)
  },
  methods: {
    async getRule(){
      const ok = await this.$store.dispatch('getRule', this.id).catch(e=>{
        this.notFound = true
      })
      if(ok){
        this.$store.commit('setTitle',this.$t('Rule: {name}',{name:this.rule.name}))
        this.notFound = false
      }
    },
    async updateRule(){
      const ok = await this.$store.dispatch('updateRule', {
        id: this.id,
        nodes: this.$store.state.nodes,
        edges: this.$store.state.edges
      })
      if (ok){
        this.$store.commit('addNotification',createSuccessNotification(this.$t('Saved')))
      }
    },
    onDragStart(){
      if(this.$vuetify.display.mobile){
        this.open = false
      }
    },
    async executeRule(){
      await this.$store.dispatch('executeRule', this.id)
    }
  }
}
</script>

<template>
  <VCard
    v-if="rule && !notFound"
    class="position-relative fill-height"
  >
    <VCardText class="fill-height pt-10">
      <VSheet class="actions">
        <VBtn
          :icon="open ? 'mdi-menu-close':'mdi-menu-open'"
          density="comfortable"
          color="default"
          variant="text"
          @click="open = !open"
        />
      </VSheet>
      <RulesEditor v-model="rule" />
      <SidebarPanel
        v-model="open"
        :title="$t('Rules elements')"
      >
        <template #prepend>
          <VBtn
            variant="text"
            density="comfortable"
            icon="mdi-play"
            @click="executeRule"
          />
        </template>
        <template #default>
          <RuleGroups @on-drag-start="onDragStart"/>
          <VSheet class="position-absolute bottom-0 left-0 right-0 pa-2">
            <VBtn
              variant="tonal"
              block
              size="large"
              :text="$t('Save')"
              prepend-icon="mdi-content-save"
              @click="updateRule"
            />
          </VSheet>
        </template>
      </SidebarPanel>
    </VCardText>
  </VCard>
  <NotFound v-else-if="notFound"/>
</template>

<style scoped>
.actions {
  position: absolute;
  top:0;
  right:0;
}
</style>

<style scoped>

</style>