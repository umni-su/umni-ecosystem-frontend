<script>
import SidebarPanel from '../../chunks/SidebarPanel.vue'
import RulesEditor from '../../chunks/rules/RulesEditor.vue'
import RuleGroups from '../../chunks/rules/RuleGroups.vue'

export default {
  name: 'RulesPage',
  components: {RuleGroups, RulesEditor, SidebarPanel},
  data() {
    return {
      open: true
    }
  },
  created() {
    this.$store.commit('setTitle', this.$t('Rules editor'))
  }
}
</script>

<template>
  <VCard
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
      <RulesEditor />
      <SidebarPanel
        v-model="open"
        :title="$t('Rules elements')"
      >
        <template #default>
          <RuleGroups/>
          EDGES:
          <pre>{{$store.state.edges}}</pre>
          NODES:
          <pre>{{$store.state.nodes}}</pre>
        </template>
      </SidebarPanel>
    </VCardText>
  </VCard>
</template>

<style scoped>
.actions {
  position: absolute;
  top:0;
  right:0;
}
</style>