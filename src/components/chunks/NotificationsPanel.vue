<script>
import LogItem from './LogItem.vue'

export default {
  name: 'NotificationsPanel',
  components: {
    LogItem
  },
  data(){
    return {
      params: {
        page:1,
        size:25
      }
    }
  },
  computed: {
    theme() {
      return this.$store.getters['getTheme']
    },
    logs() {
      return this.$store.getters['logs/getLogs']
    }
  },
  async mounted() {
    await this.getLogs()
  },
  methods: {
    async getLogs() {
      await this.$store.dispatch('logs/getLogs', this.params)
    }
  }
}
</script>

<template>

  <VMenu
    width="500"
  >
    <template #activator="{props}">
      <VBtn
        class="mr-2"
        density="comfortable"
        v-bind="props"
        variant="text"
        color="orange"
        icon="mdi-math-log"
      />
    </template>
    <VCard>
      <VCardTitle>{{$t('Event log')}}</VCardTitle>
      <VCardText
        style="max-height: 500px"
        class="overflow-x-auto"
      >
        <VList
          v-if="logs.items"
          class="pa-0"
        >
          <LogItem
            v-for="log in logs.items"
            :key="log"
            :log="log"
          />
          <VListItem
            v-if="logs.items.length === 0"
            :title="$t('Empty')"
          />
        </VList>
      </VCardText>
      <VCardActions class="d-block text-center">
        <VBtn
          :to="{name: 'logs'}"
          variant="tonal"
          size="small"
          prepend-icon="mdi-format-list-group"
          :text="$t('History')"
        />
      </VCardActions>
    </VCard>

  </VMenu>
</template>

<style scoped>

</style>
