<script>
export default {
  name: 'PluginDeviceSearchItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    exists() {
      return this.item?.exists
    }
  },
  data() {
    return {
      more: false
    }
  }
}
</script>

<template>
  <VCard :disabled="exists">
    <template #append>
      <VBtn
        variant="plain"
        density="comfortable"
        color="default"
        rounded="pill"
        :icon="more? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="more=!more"
      />
      <slot name="append"/>
    </template>
    <template #title>
      {{ item.name }}
    </template>
    <template #subtitle>
      {{ item.external_id }}
    </template>
    <template
      #text
      v-if="more"
    >
      <pre>{{ item }}</pre>
    </template>
  </VCard>
</template>

<style scoped>

</style>