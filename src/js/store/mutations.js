export default {
    setLoading(state, loading) {
        state.loading = loading
    },
    setTitle(state, title) {
        state.title = title
    },
    setInterval(state, interval) {
        state.interval = interval
    },
    setAuthenticated(state, authenticated) {
        state.authenticated = authenticated
    },
    setInstalled(state, installed) {
        state.installed = installed
    },
    setUser(state, user) {
        state.user = user
    },
    setToken(state, token) {
        state.token = token
        localStorage.setItem('token', token)
    },
    setTheme(state, theme) {
        localStorage.setItem('theme', theme)
        state.theme = theme
    },
    addNotification(state, notification) {
        state.notifications.push(notification)
    },
    removeNotification(state) {
        state.notifications = state.notifications.filter(n => n.active === true)
    },
    setSystemNotifications(state, notifications) {
        state.systemNotifications = notifications
    },
    addSystemNotification(state, notification) {
        state.systemNotifications.push(notification)
    },
    removeSystemNotification(state, noty) {
        state.systemNotifications = state.systemNotifications.filter(n => n.id !== noty.id)
    },
    setWsLastMessage(state, message) {
        state.ws.lastMessage = message
    },
    setDevices(state, devices) {
        state.devices = devices
    },
    setDevice(state, device) {
        state.device = Object.create(device)
    },
    setOnline(state, {id, online}) {
        const index = state.devices.findIndex(d => d.id === id)
        if (index > -1) {
            state.devices[index].online = online
        }
    },
    addDevice(state, device) {
        const index = state.devices.findIndex(d => d.id === device.id)
        if (index > -1) {
            state.devices[index] = device
        } else {
            state.devices.push(device)
        }
    },
    removeDevice(state, device) {
        state.devices = state.devices.filter(d => d.id !== device.id)
    },
    setActiveSensor(state, sensor) {
        state.sensor = sensor
    },
}
