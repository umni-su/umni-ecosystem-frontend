<script>
import SystemNotificationMenuItem from '../../components/chunks/SystemNotificationMenuItem.vue'

export default {
  name: 'NotificationsPanel',
  components: {
    SystemNotificationMenuItem
  },
  computed: {
    theme() {
      return this.$store.getters['getTheme']
    },
    systemNotifications() {
      return this.$store.getters['getSystemNotifications']?.map(n => n.data)
    }
  },
  async mounted() {
    await this.getNotifications()
  },
  methods: {
    async getNotifications() {
      //await this.$store.dispatch('getNotifications')
    }
  }
}
</script>

<template>
  <VMenu
    width="500"
    :close-on-content-click="false"
  >
    <template #activator="{props}">
      <VBtn
        class="mr-2"
        density="comfortable"
        v-bind="props"
        variant="text"
        color="orange"
        icon="mdi-bell"
      />
    </template>
    <VList class="pa-0">
      <SystemNotificationMenuItem
        v-for="noty in systemNotifications"
        :key="noty"
        :noty="noty"
      />
      <VListItem
        v-if="systemNotifications.length === 0"
        :title="$t('Empty')"
      />
    </VList>
  </VMenu>
</template>

<style scoped>

</style>
