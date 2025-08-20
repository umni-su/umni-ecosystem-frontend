<script>
import SidebarPanel from '../../chunks/SidebarPanel.vue'
import RulesEditor from '../../chunks/rules/RulesEditor.vue'
import RuleGroups from '../../chunks/rules/RuleGroups.vue'
import PageActions from '../../chunks/PageActions.vue'
import ModalDialog from '../../chunks/ModalDialog.vue'
import RuleForm from '../../chunks/rules/edit/RuleForm.vue'
import RuleListItem from '../../chunks/rules/RuleListItem.vue'

export default {
  name: 'RulesPage',
  components: {
    RuleListItem,
    RuleForm,
    ModalDialog,
    PageActions,
    RuleGroups,
    RulesEditor,
    SidebarPanel
  },
  computed: {
    rules(){
      return this.$store.getters['getRules']
    }
  },
  data() {
    return {
      open: false,
      model: null
    }
  },
  async created() {
    this.empty()
    this.$store.commit('setTitle', this.$t('Rules'))
    await this.getRules()
  },
  methods:{
    empty(){
      this.model = {
        name: null,
        description: null,
        active: false,
        priority: 0
      }
    },
    async getRules(){
      await this.$store.dispatch('getRules')
    },
    onSaveRule(){
      this.open = false
      this.empty()
    }
  }
}
</script>

<template>
  <VSheet
    color="default"
    class="pa-4 position-relative fill-height"
  >
    <PageActions>
      <template #append>
        <VBtn
          icon="mdi-plus"
          variant="text"
          color="secondary"
          density="comfortable"
          @click="open = true"
        />
      </template>
    </PageActions>
    <ModalDialog
      v-model="open"
      :title="$t('Add rule')"
    >
      <RuleForm
        v-model="model"
        @rule-saved="onSaveRule"
      />
    </ModalDialog>
    <VList>
      <RuleListItem
        v-for="rule in rules"
        :key="rule.id"
        :rule="rule"
      />
    </VList>
  </VSheet>
</template>

<style scoped>
.actions {
  position: absolute;
  top:0;
  right:0;
}
</style>