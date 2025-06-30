<script>
import formatBytes from "../../../js/helpers/formatBytes.js";

export default {
  name: "StorageListItem",
  props: {
    storage: {
      type: Object,
      required: true
    }
  },
  emits: ['on-click', 'on-edit', 'on-delete'],
  data() {
    return {
      size: null
    }
  },
  computed: {
    lastMessage() {
      return this.$store.getters['getWsLastMessage']
    }
  },
  watch: {
    lastMessage: {
      deep: true,
      handler(newVal) {
        if (newVal.topic === 'storage.size' && newVal.storage_id === this.storage.id) {
          this.size = formatBytes(newVal.size)
        }
      }
    }
  }
}
</script>

<template>
  <VListItem
    :class="{'opacity-50':!storage.active}"
    :title="storage.name"
    :subtitle="storage.path"
    @click="$emit('on-click',storage)"
  >
    {{ size }}
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