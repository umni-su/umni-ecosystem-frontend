<script>
import formatBytes from '../../../js/helpers/formatBytes.js'

export default {
  name: 'StorageListItem',
  methods: {formatBytes},
  props: {
    storage: {
      type: Object,
      required: true
    }
  },
  emits: ['on-click', 'on-edit', 'on-delete'],
  data() {
    return {
      size: null,
      usage: null
    }
  },
  computed: {
    lastMessage() {
      return this.$store.getters['getWsLastMessage']
    },
    storages() {
      return this.$store.getters['getStorages']
    },
    total(){
      return formatBytes(this.usage.total ?? 0)
    },
    used(){
      return formatBytes(this.usage.used ?? 0)
    }
  },
  watch: {
    lastMessage: {
      deep: true,
      handler(newVal) {
        if (newVal.topic === 'storage.size' && newVal.storage_id === this.storage.id) {
          this.size = formatBytes(newVal.size)
          this.usage = newVal.usage
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
    <VProgressLinear
      v-if="size !== null"
      v-tooltip="$t(
        'Used: {used} of {total}',
        {
          used:used,
          total:`${total.val} ${total.size}`,
        }
      )"
      :max="100"
      :model-value="usage.used_total"
      color="primary"
      height="6"
      class="my-2"
    />
    <VProgressLinear
      v-else
      height="6"
      class="my-2"
      color="secondary"
      disabled
      indeterminate
    />
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