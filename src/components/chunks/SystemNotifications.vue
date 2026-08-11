<template>
  <VSnackbar
    v-for="(notification, index) in activeNotifications"
    :key="notification"
    v-model="notification.active"
    variant="flat"
    location="bottom right"
    class="position-fixed"
    :style="`bottom:${(60 * index)}px`"
    :color="notification.style"
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
    <!-- Для строк с переносами используем white-space: pre-line -->
    <span
      v-if="typeof notification.text === 'string'"
      class="notification-text"
      style="white-space: pre-line;"
    >
      {{ notification.text }}
    </span>

    <!-- Для массивов оставляем как есть -->
    <div v-else-if="Array.isArray(notification.text)">
      <div
        v-for="(item, idx) in notification.text"
        :key="idx"
      >
        {{ item.message }}
      </div>
    </div>
  </VSnackbar>
</template>

<script>
export default {
  name: 'SystemNotifications',
  computed: {
    notifications() {
      return this.$store.getters['getUiNotifications']
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
