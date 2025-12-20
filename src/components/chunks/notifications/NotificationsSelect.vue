<script>
export default {
  name: 'NotificationsSelect',
  props: {
    modelValue: {
      type: Number,
      default: null
    }
  },
  data(){
    return {
      value:null
    }
  },
  async mounted() {
    await this.getNotifications()
  },
  methods: {
    async getNotifications(){
      await this.$store.dispatch('getNotifications')
      this.value = this.modelValue
    }
  },
  computed: {
    notifications(){
      return this.$store.getters['getSystemNotifications']
    }
  },
  watch: {
    value(v){
      this.$emit('update:model-value', v)
    },
    modelValue(v){
      this.value = v
    }
  }
}
</script>

<template>
  <VSelect
    v-model="value"
    clearable
    :label="$t('Notification')"
    :items="notifications"
    item-value="id"
  >
    <template #item="{props, item}">
      <VListItem
        v-bind="props"
        :disabled="!item.raw.active"
        :title="item.raw.name"
      />
    </template>
    <template #selection="{item}">
      <VIcon
        icon="mdi-circle"
        :color="item.raw.active ? 'success' : 'error'"
        size="x-small"
        class="mr-2"
      />{{item.raw.name}}
    </template>
  </VSelect>
</template>

<style scoped>

</style>