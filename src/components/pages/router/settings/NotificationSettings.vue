<script>
import NotificationListItem from '../../../chunks/notifications/NotificationListItem.vue'

export default {
  name: 'NotificationSettings',
  components: {NotificationListItem},
  async created() {
    await this.$store.dispatch('getNotifications')
  },
  computed: {
    notifications(){
      return this.$store.getters['getSystemNotifications']
    }
  }
}
</script>

<template>
  <VCard :title="$t('Notifications settings')">
    <template #text>
      <VList>
        <NotificationListItem
          v-for="n in notifications"
          :key="n"
          :notification="n"
        />
      </VList>
    </template>
  </VCard>
</template>

<style scoped>

</style>