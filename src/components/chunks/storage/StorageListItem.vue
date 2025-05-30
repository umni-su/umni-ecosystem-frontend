<script>
export default {
  name: "StorageListItem",
  props: {
    storage: {
      type: Object,
      required: true
    }
  },
  emits: ['on-click', 'on-edit', 'on-delete'],
}
</script>

<template>
  <VListItem
    :title="storage.name"
    :subtitle="storage.path"
    @click="$emit('on-click',storage)"
  >
    <template #prepend>
      <VBtn
        icon="mdi-harddisk"
        variant="text"
        readonly
        color="default"
        class="opacity-100"
      />
    </template>
    <template #append>
      <VBtn
        color="default"
        icon="mdi-pencil"
        variant="plain"
        density="comfortable"
        @click.stop="$emit('on-edit',storage)"
      />
      <VBtn
        color="error"
        icon="mdi-trash-can"
        class="ml-2"
        variant="plain"
        density="comfortable"
        @click.stop="$emit('on-delete',storage)"
      />
    </template>
  </VListItem>
</template>

<style scoped>

</style>