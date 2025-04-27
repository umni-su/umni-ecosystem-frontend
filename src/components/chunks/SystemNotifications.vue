<template>
  <VSnackbar
    v-for="(notification, index) in activeNotifications"
    :key="notification"
    v-model="notification.active"
    variant="flat"
    location="bottom right"
    :style="`bottom:${(60 * index)}px`"
    :color="notification.style"
    :timeout="notification.timeout"
    @update:model-value="onClose($event,notification)"
  >
    <template #actions>
      <VBtn
        icon="mdi-close"
        density="compact"
        variant="plain"
        color="white"
        @click="onClose(false, notification)"
      />
    </template>
    <span v-if="typeof notification.text === 'string'">{{ notification.text }}</span>
    <div v-else-if="typeof notification.text === 'object'">
      <div
        v-for="n in notification.text"
        :key="n"
      >
        {{ n }}
      </div>
    </div>
  </VSnackbar>
</template>

<script>
export default {
  name: 'SystemNotifications',
  computed: {
    notifications() {
      return this.$store.getters['getNotifications']
    },
    activeNotifications() {
      return this.notifications.filter(n => n.active === true)
    }
  },
  methods: {
    onClose(state, notification) {
      notification.active = false
      if (!state) {
        this.$store.commit('removeNotification', notification)
      }
    }
  }
}
</script>

<style scoped>

</style>
