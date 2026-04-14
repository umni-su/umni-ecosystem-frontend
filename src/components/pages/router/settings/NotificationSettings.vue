<script>
import NotificationListItem from '../../../chunks/notifications/NotificationListItem.vue'
import ModalDialog from '../../../chunks/ModalDialog.vue'
import NotificationForm from '../../../chunks/notifications/NotificationForm.vue'

export default {
  name: 'NotificationSettings',
  components: {NotificationForm, ModalDialog, NotificationListItem},
  data() {
    return {
      open: false,
      notification: {}
    }
  },
  async created() {
    await this.$store.dispatch('notifications/getNotifications')
  },
  computed: {
    notifications() {
      return this.$store.getters['notifications/getNotifications']
    }
  },
  methods: {
    openModal() {
      this.open = true
      this.notification = {}
    }
  }
}
</script>

<template>
  <VCard
    :title="$t('Notifications settings')"
    class="mt-3"
  >
    <template #append>
      <VBtn
        color="default"
        icon="mdi-plus"
        variant="plain"
        @click="openModal"
      />
    </template>
    <template #text>
      <VList>
        <NotificationListItem
          v-for="n in notifications"
          :key="n"
          :notification="n"
        />
      </VList>
      <ModalDialog
        v-model="open"
        :title="$t('Add notification')"
      >
        <NotificationForm v-model="notification"/>
      </ModalDialog>
    </template>
  </VCard>
</template>

<style scoped>

</style>