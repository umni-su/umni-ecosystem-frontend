<script>
export default {
  name: 'RuleListItem',
  props: {
    rule:{
      type:Object,
      required:true
    }
  },
  methods:{
    async executeRule(){
      await this.$store.dispatch('executeRule', this.rule.id)
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
      />
    </template>
  </VListItem>
</template>

<style scoped>

</style>