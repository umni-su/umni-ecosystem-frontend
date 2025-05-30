export default {
    isLoading(state) {
        return state.loading
    },
    isAuthenticated(state) {
        return state.authenticated
    },
    isInstalled(state) {
        return state.installed
    },
    getUser(state) {
        return state.user
    },
    getInterval(state) {
        return state.interval
    },
    getTheme(state) {
        return state.theme
    },
    getTitle(state) {
        return state.title
    },
    getNotifications(state) {
        return state.notifications
    },
    getSystemNotifications(state) {
        return state.systemNotifications
    },
    getWsLastMessage(state) {
        return state.ws.lastMessage
    },
    getDevices(state) {
        return state.devices
    },
    getDevice(state) {
        return state.device
    },
    getDateFormat(state) {
        return state.dateFormat
    },
    getTimeFormat(state) {
        return state.timeFormat
    },
    getDateTimeFormat(state) {
        return `${state.dateFormat} ${state.timeFormat}`
    },
    getActiveSensor(state) {
        return state.sensor
    },
    getServices(state) {
        return state.services
    },
    getStorages(state) {
        return state.storages
    }
}
