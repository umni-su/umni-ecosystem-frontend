<script>
export default {
  name: 'RuleListItem',
  props: {
    rule:{
      type:Object,
      required:true
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
        color="secondary"
        icon="mdi-pencil"
        variant="text"
        density="comfortable"
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