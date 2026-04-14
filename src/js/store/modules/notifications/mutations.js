export default {
  setTypes(state, types) {
    state.types = types
  },
  setNotifications(state, notifications) {
    state.notifications = notifications
  },
  addNotification(state, notification) {
    state.notifications.push(notification)
  },
  removeNotification(state, noty) {
    state.notifications = state.notifications.filter(
      n => n.id !== noty.id
    )
  }
}