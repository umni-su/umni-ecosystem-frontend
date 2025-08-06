<script>
export default {
  name: 'StorageSelect',
  props: {
    modelValue: {
      type: Number,
      default: null
    }
  },
  emits: ['update:model-value'],
  data() {
    return {
      value: null
    }
  },
  computed: {
    storages() {
      return this.$store.getters['getStorages']
    }
  },
  async created() {
    if (this.storages.length === 0) {
      await this.$store.dispatch('getStorages')
    }
    if (this.modelValue !== null) {
      this.value = this.modelValue
    }
    this.$emit('update:model-value', this.value)
  }
}
</script>

<template>
  <VSelect
    v-model="value"
    :label="$t('Storage')"
    :items="storages"
    item-title="name"
    item-value="id"
    @update:model-value="$emit('update:model-value', value)"
  />
</template>

<style scoped>

</style>