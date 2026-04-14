<script>
export default {
  name: 'NotificationsTypesSelect',
  props: {
    modelValue: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      type: null
    }
  },
  computed: {
    types() {
      return this.$store.getters['notifications/getTypes']
    }
  },
  async created() {
    this.type = this.modelValue
    await this.getTypes()
  },
  emits: ['update:modelValue', 'update:fields', 'update:model-value'],
  watch: {
    modelValue(v) {
      this.type = v
    },
    type(v) {
      this.$emit('update:model-value', v)
      const property = this.types.find(type => type?.type_id === v)
      this.$emit('update:fields', property?.options_schema?.fields)
    }
  },
  methods: {
    async getTypes() {
      await this.$store.dispatch('notifications/getNotificationsTypes')
    }
  }
}
</script>

<template>
  <VSelect
    v-model="type"
    :label="$t('Choose notification type')"
    :items="types"
    item-value="type_id"
  >
    <template #item="{item, props}">
      <VListItem
        v-bind="props"
        :title="item.raw.description"
      />
    </template>
    <template #selection="{item}">
      {{ item.raw.description }}
    </template>
  </VSelect>
</template>

<style scoped>

</style>